(function() {
  define([], function() {
    var Rectangle;
    Rectangle = (function() {
      function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }

      Rectangle.prototype.contains = function(x, y) {
        return x >= this.x && x <= (this.x + this.width) && y >= this.y && (y <= this.y + this.height);
      };

      Rectangle.prototype.equals = function(otherRect) {
        if (otherRect != null) {
          if (otherRect.x === this.x && otherRect.y === this.y && otherRect.width === this.width && otherRect.height === this.height) {
            return true;
          }
        }
        return false;
      };

      Rectangle.prototype.intersects = function(otherRect) {
        var otherX, otherX2, otherY, otherY2;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
        otherX = otherRect.x;
        otherY = otherRect.y;
        otherX2 = otherRect.x + otherRect.width;
        otherY2 = otherRect.y + otherRect.height;
        return this.x < otherX2 && this.x2 > otherX && this.y < otherY2 && this.y2 > otherY;
      };

      Rectangle.prototype.collidesWithComponent = function(circuitComponent) {
        return this.intersects(circuitComponent.getBoundingBox());
      };

      return Rectangle;

    })();
    return Rectangle;
  });

}).call(this);
