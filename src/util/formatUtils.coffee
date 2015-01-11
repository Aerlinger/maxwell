# <DEFINE>
define [], () ->
# </DEFINE>

    class FormatUtils

      @showFormat: (decimalNum) ->
        decimalNum.toPrecision(2)
      
      @shortFormat: (decimalNum) ->
        return decimalNum.toPrecision(1);

      @longFormat: (decimalNum) ->
        decimalNum.toPrecision(4)

      ###
      Removes commas from a number containing a string:
      e.g. 1,234,567.99 -> 1234567.99
      ###
      @noCommaFormat: (numberWithCommas) ->
        numberWithCommas.replace(/,/g, '');
      
      ###
      Adds commas to a number, and returns the string representation of that number
      e.g. 1234567.99 -> 1,234,567.99
      ###
      @commaFormat: (plainNumber) ->
        # Simple method of converting a parameter to a string
        plainNumber += ""
      
        # Ignore any numbers after a '.'
        x = plainNumber.split(".")
        x1 = x[0]
        x2 = (if x.length > 1 then "." + x[1] else "")
        pattern = /(\d+)(\d{3})/
        x1 = x1.replace(pattern, "$1" + "," + "$2")  while pattern.test(x1)
        x1 + x2

    return FormatUtils
