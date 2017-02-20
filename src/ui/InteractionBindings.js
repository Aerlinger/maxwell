let Util = require('../util/Util');

/**
 *
 * @param Circuit
 * @param canvas
 *
 *
 * This function's 'this' reference is bound to the parent CircuitController
 */
let interactionController = function (Circuit, canvas) {
  canvas.addEventListener('mousemove', mousemove.bind(this));
  canvas.addEventListener('mousedown', mousedown.bind(this));
  canvas.addEventListener('mouseup', mouseup.bind(this));

  // Callbacks
  let onSelectionChanged = this.noop;
  let onComponentClick = this.noop;
  let onComponentHover = this.noop;
  let onNodeHover = this.noop;
  let onNodeClick = this.noop;
  let onUpdateComplete = this.noop;

  function mousemove(event) {
    let component;
    let x = event.offsetX - this.xMargin;
    let y = event.offsetY - this.yMargin;

    this.newlyHighlightedComponent = null;

    this.lastX = this.snapX;
    this.lastY = this.snapY;

    this.snapX = this.snapGrid(x);
    this.snapY = this.snapGrid(y);

    // TODO: WIP for interactive element placing
    if (this.placeComponent) {
      this.placeComponent.setPoints();

      if (this.placeX && this.placeY) {
        this.placeComponent.point1.x = this.placeX;
        this.placeComponent.point1.y = this.placeY;

        this.placeComponent.point2.x = this.snapX;
        this.placeComponent.point2.y = this.snapY;

        this.placeComponent.place();
      }
    } else {

      // Update marquee
      if (this.marquee) {
        this.marquee.reposition(x, y);
        this.allSelectedComponents = [];

        //this.selectedComponents = [];

        for (let component of this.Circuit.getElements()) {
          if (this.marquee.collidesWithComponent(component)) {
            this.allSelectedComponents.push(component);

            /*
             if (this.selectedComponents.indexOf(component) < 0) {
             this.selectedComponents.push(component);
             this.onSelectionChanged(this.selectedComponents);
             }
             */
          }
        }

        // UPDATE MARQUEE SELECTION
        // TODO OPTIMIZE
        if (this.allSelectedComponents.length != this.previouslySelectedComponents.length) {
          let newlySelectedComponents = [];
          let newlyUnselectedComponents = [];

          for (let currentlySelectedComponent of this.allSelectedComponents)
            if (this.previouslySelectedComponents.indexOf(currentlySelectedComponent) < 0)
              newlySelectedComponents.push(currentlySelectedComponent);

          for (let previouslySelectedComponent of this.previouslySelectedComponents)
            if (this.allSelectedComponents.indexOf(previouslySelectedComponent) < 0)
              newlyUnselectedComponents.push(previouslySelectedComponent);


          if (newlySelectedComponents.length > 0 || newlyUnselectedComponents.length > 0) {
            this.onSelectionChanged({
              selection: this.allSelectedComponents,
              added: newlySelectedComponents,
              removed: newlyUnselectedComponents
            })
          }
        }

        this.selectedComponents = this.allSelectedComponents;
        this.previouslySelectedComponents = this.allSelectedComponents;


        // Update highlighted node
      } else {
        this.previouslyHighlightedNode = this.highlightedNode;
        this.highlightedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);

        if (this.highlightedNode) {

          if (!this.selectedNode && this.previouslyHighlightedNode != this.highlightedNode)
            this.onNodeHover(this.highlightedNode);

        } else {

          for (let component of this.Circuit.getElements()) {
            if (component.getBoundingBox().contains(x, y)) {
              this.newlyHighlightedComponent = component;
            }
          }
        }

        if (!this.selectedNode && this.previouslyHighlightedNode && !this.highlightedNode && this.onNodeUnhover)
          this.onNodeUnhover(this.previouslyHighlightedNode);

        if (this.selectedNode) {
          for (let element of this.selectedNode.getNeighboringElements()) {
            if (element) {
              // console.log(element);
              let post = element.getPostAt(this.selectedNode.x, this.selectedNode.y);
              if (post) {
                post.x = this.snapX;
                post.y = this.snapY;

                element.place()
              } else {
                console.warn("No post at", this.selectedNode.x, this.selectedNode.y);
              }

              element.recomputeBounds();
            }
          }

          this.lastNodeX = this.selectedNode.x;
          this.lastNodeY = this.selectedNode.y;

          this.selectedNode.x = this.snapX;
          this.selectedNode.y = this.snapY;

          if (this.onNodeDrag && ((this.lastNodeX != this.selectedNode.x) || (this.lastNodeY != this.selectedNode.y))) {
            this.onNodeDrag(this.selectedNode);

            this.lastNodeX = this.selectedNode.x;
            this.lastNodeY = this.selectedNode.y;
          }
        } else {

          // COMPONENT HOVER/UNHOVER EVENT
          if (this.newlyHighlightedComponent) {
            if (this.newlyHighlightedComponent !== this.highlightedComponent) {
              this.highlightedComponent = this.newlyHighlightedComponent;

              if (this.onComponentHover && !this.isDragging)
                this.onComponentHover(this.highlightedComponent);

              this.notifyObservers(CircuitUI.ON_COMPONENT_HOVER, this.highlightedComponent);
            }

          } else {
            if (this.highlightedComponent && this.onComponentUnhover && !this.isDragging)
              this.onComponentUnhover(this.highlightedComponent);

            this.highlightedComponent = null;
          }
        }
      }
    }

    // Move components
    if (!this.marquee && !this.isPlacingComponent() && !this.selectedNode && (this.selectedComponents && this.selectedComponents.length > 0) && (event.which === CircuitUI.MOUSEDOWN) && ((this.lastX !== this.snapX) || (this.lastY !== this.snapY))) {
      this.isDragging = true;
      if (this.onComponentsDrag)
        this.onComponentsDrag(this.selectedComponents);

      for (let component of Array.from(this.selectedComponents)) {
        component.move(this.snapX - this.lastX, this.snapY - this.lastY);
      }
    }
  }


  function mousedown(event) {
    let x = event.offsetX - this.xMargin;
    let y = event.offsetY - this.yMargin;

    if (this.placeComponent) {
      if (!this.placeX && !this.placeY) {

        // Place the first post
        this.placeX = this.snapX;
        this.placeY = this.snapY;
      } else {

        // Place the component
        this.Circuit.solder(this.placeComponent);

        this.placeComponent.place();
        this.placeComponent = null;
        this.placeX = null;
        this.placeY = null;
      }
    } else {

      if (!this.highlightedComponent && !this.placeComponent && !this.highlightedNode) {
        this.marquee = new SelectionMarquee(x, y);
      }

      this.selectedNode = this.Circuit.getNodeAtCoordinates(this.snapX, this.snapY);

      if (this.selectedNode && this.onNodeClick)
        this.onNodeClick(this.selectedNode);

      for (let component of this.Circuit.getElements()) {
        if (component.getBoundingBox().contains(x, y)) {
          this.notifyObservers(CircuitUI.ON_COMPONENT_CLICKED, component);

          if (this.onComponentClick)
            this.onComponentClick(component);

          if (component.toggle)
            component.toggle();

          if (component.onclick)
            component.onclick();

          if (component.onComponentClick)
            component.onComponentClick();
        }
      }
    }
  }

  function mouseup(event) {
    this.marquee = null;
    this.selectedNode = null;

    if (this.highlightedComponent && !this.selectedNode && !this.isDragging) {
      if (this.selectedComponents.length > 1 || this.selectedComponents.indexOf(this.highlightedComponent) < 0) {
        let added = (this.selectedComponents.indexOf(this.highlightedComponent) < 0) ? [this.highlightedComponent] : [];
        let removed = (this.selectedComponents.indexOf(this.highlightedComponent) < 0) ? [] : [this.highlightedComponent];

        this.onSelectionChanged({
          selection: [this.highlightedComponent],
          added: added,
          removed: removed
        });

        this.selectedComponents = [this.highlightedComponent];
      }
    }

    this.isDragging = false;

    if (this.selectedComponents && this.selectedComponents.length > 0) {
      this.notifyObservers(CircuitUI.ON_COMPONENTS_DESELECTED, this.selectedComponents);
    }
  }

  function togglePause() {
    if (this.Circuit.isStopped)
      this.Circuit.resume();
    else
      this.Circuit.pause();
  }

  function isSelecting() {
    return !!this.marquee;
  }

  function isPlacingComponent() {
    return !!this.placeComponent;
  }

  function getMode() {
    let mode = "";

    if (this.isDragging)
      mode = "DRAGGING";
    else if(this.isPlacingComponent())
      mode = "PLACING";
    else if(this.isSelecting())
      mode = "SELECTING";
    else
      mode = "IDLE";

    return mode
  }

  function clearPlaceComponent() {
    this.placeX = null;
    this.placeY = null;
    this.placeComponent = null;
  }

  function resetSelection() {
    if (this.selectedComponents && (this.selectedComponents.length > 0))
      this.onSelectionChanged({
        selection: [],
        added:[],
        removed: this.selectedComponents
      });

    this.selectedComponents = [];
  }

  function getSelectedComponents() {
    return this.selectedComponents;
  }

  function setPlaceComponent(componentName) {
    let klass = eval(componentName);

    this.placeComponent = new klass();

    this.resetSelection();

    return this.placeComponent;
  }

  function remove(components) {
    console.log("components", components);
    return this.Circuit.destroy(components);
  }
};

interactionController.ON_COMPONENT_HOVER = "ON_COMPONENT_HOVER";
interactionController.ON_COMPONENT_CLICKED = "ON_COMPONENT_CLICKED";
interactionController.ON_COMPONENTS_SELECTED = "ON_COMPONENTS_SELECTED";
interactionController.ON_COMPONENTS_DESELECTED = "ON_COMPONENTS_DESELECTED";
interactionController.ON_COMPONENTS_MOVED = "ON_COMPONENTS_MOVED";

interactionController.MOUSEDOWN = 1;

module.exports = interactionController;
