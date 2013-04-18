define(['chai'], function(chai) {

    chai.should();
    chai.expect();

    console.log("Loading helper.js");

    // Simple check to make sure mocha is loaded and working
    describe("Sanity check", function () {
        it("should satisfy true equals true", function (done) {
            "true".should.equal("true");
            done();
        });
    });

});