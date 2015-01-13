chai = require 'chai'
chai.use require 'chai-as-promised'

{expect} = chai
chai.should()

describe "Authentication capabilities", ->

    it "returns true", ->
      true.should.eq(true)
