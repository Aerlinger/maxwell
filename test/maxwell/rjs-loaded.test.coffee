requirejs = require("requirejs");

describe "Authentication capabilities", ->
  it "loads rjs", ->
    !!requirejs == true
