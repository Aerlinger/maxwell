AntennaElm = (xa, ya, xb, yb, f, st) ->
  CircuitElement.call this, xa, ya, xb, yb, f

# Step 1: Prototype of DepthRectangle is Rectangle
AntennaElm:: = new CircuitElement()

# Step 2: Now we need to set the constructor to the DepthRectangle instead of Rectangle
AntennaElm::constructor = AntennaElm
