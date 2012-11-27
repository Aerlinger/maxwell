global.showFormat = (decimalNum) ->
  decimalNum.toFixed(2)

global.shortFormat = (decimalNum) ->
  return decimalNum.toFixed(1);

###
Removes commas from a number containing a string:
e.g. 1,234,567.99 -> 1234567.99
###
global.noCommaFormat = (numberWithCommas) ->
  numberWithCommas.replace(',', '');

###
Adds commas to a number, and returns the string representation of that number
e.g. 1234567.99 -> 1,234,567.99
###
global.commaFormat = (plainNumber) ->
  # Simple method of converting a parameter to a string
  plainNumber += ""

  # Ignore any numbers after a '.'
  x = plainNumber.split(".")
  x1 = x[0]
  x2 = (if x.length > 1 then "." + x[1] else "")
  rgx = /(\d+)(\d{3})/
  x1 = x1.replace(rgx, "$1" + "," + "$2")  while rgx.test(x1)
  x1 + x2