// Generated by CoffeeScript 1.8.0
(function() {
  define(['cs!CircuitNode'], function(CircuitNode) {
    return describe("Circuit Node", function() {
      beforeEach(function() {
        this.CircuitNode1 = new CircuitNode();
        return this.CircuitNode = new CircuitNode(4, 5, false, [this.CircuitNode1]);
      });
      it("Has the correct defaults");
      it("has position, links and an internal flag.", function() {
        this.CircuitNode.x.should === 4;
        this.CircuitNode.y.should === 5;
        this.CircuitNode.intern.should === false;
        return this.CircuitNode.links.should === [this.CircuitNode1];
      });
      return it("should output to string", function() {
        return console.log(this.CircuitNode.toString());
      });
    });
  });

}).call(this);

//# sourceMappingURL=circuitNodeTest.js.map
