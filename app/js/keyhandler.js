function keyDownTextField(e) {
  var keyCode = e.keyCode;
  if (keyCode == 27) {
    console.log("KEYPRESS: ESC");

    renderer.clearPlaceComponent();
    $("#selectedComponent").text("");
  }

  else if (keyCode == 82)
    console.log("KEYPRESS: r");
  else if (keyCode == 87)
    console.log("KEYPRESS: w");
  else if (keyCode == 71)
    console.log("KEYPRESS: g");
  else if (keyCode == 8)
    console.log("KEYPRESS: backspace");
  else if (keyCode == 48)
    console.log("KEYPRESS: 0");
  else if (keyCode == 49)
    console.log("KEYPRESS: 1");
  else if (keyCode == 50)
    console.log("KEYPRESS: 2");
  else if (keyCode == 51)
    console.log("KEYPRESS: 3");
  else if (keyCode == 51)
    console.log("KEYPRESS: ~");
  else if (keyCode == 37)
    console.log("KEYPRESS: LEFT");
  else if (keyCode == 38)
    console.log("KEYPRESS: UP");
  else if (keyCode == 39)
    console.log("KEYPRESS: RIGHT");
  else if (keyCode == 40)
    console.log("KEYPRESS: DOWN");
  else if (keyCode == 187)
    console.log("KEYPRESS: +");
  else if (keyCode == 189)
    console.log("KEYPRESS: -");
  else if (keyCode == 190)
    console.log("KEYPRESS: .");
  else if (keyCode == 188)
    console.log("KEYPRESS: ,");
  else if (keyCode == 220)
    console.log("KEYPRESS: \\");
  else if (keyCode == 191)
    console.log("KEYPRESS: /");
  else if (keyCode == 221)
    console.log("KEYPRESS: ]");
  else if (keyCode == 219)
    console.log("KEYPRESS: [");
  else if (keyCode == 91 || keyCode == 93)
    console.log("KEYPRESS: CMD");
  else if (keyCode == 18)
    console.log("KEYPRESS: ALT");
  else if (keyCode == 17)
    console.log("KEYPRESS: CTL");
  else if (keyCode == 16)
    console.log("KEYPRESS: SHIFT");
  else if (keyCode == 9)
    console.log("KEYPRESS: TAB");
  else if (keyCode == 32)
    console.log("KEYPRESS: SPACE");
  else
    console.log("PRESSED: " + keyCode);
}
