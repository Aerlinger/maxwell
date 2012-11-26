class CircuitLoader

  @readSetupList: (Circuit, retry) ->
    stack = new Array(6)
    stackptr = 0

    # Stack structure to keep track of menu items
    stack[stackptr++] = "root"
    circuitPresetHTML = ""
    #TODO:
#    $.get js_asset_path + "setuplist.txt", (b) ->
#      len = b.length # Number of bytes (characters) in the file
#      p = undefined # Address of current character
#
#      # For each line in the setup list
#      p = 0
#      while p < len
#        l = undefined # l is the number of characters in this line.
#        l = 0
#        while l isnt len - p
#          if b[l + p] is "\n"
#            l++ # Increment l until we reach the end
#            break
#          l++
#        line = b.substring(p, p + l - 1)
#
#        # If this is a comment line, skip it.
#        if line.charAt(0) is "#"
#
#
#          # Lines starting with a + add a submenu item
#        else if line.charAt(0) is "+"
#          menuName = line.substring(1)
#          circuitPresetHTML += "<br />" + "<strong>" + menuName + "</strong><br />"
#          console.log "push " + menuName
#          stack[stackptr++] = menuName
#
#          # Sub menus are delimited by a '-'
#        else if line.charAt(0) is "-"
#          pop = stack[--stackptr - 1]
#          console.log "pop " + pop
#        else
#          testedWorkingCircuit = false
#
#          # If the first line of the file begins with a $ this is a valid circuit
#          testedWorkingCircuit = true  if line.charAt(0) is "$"
#
#          # Get the location of the title of this menu item
#          i = line.indexOf(" ")
#          if i > 0
#            title = line.substring(i + 1)
#            first = false
#            first = true  if line.charAt(0) is ">"
#            line = line.replace("$", "")
#            circuitName = line.substring((if first then 1 else 0), i).replace("$", "")
#            prefix = ""
#            i = 0
#
#            while i < stackptr
#              prefix += " "
#              ++i
#
#            # Append this circuit file to the HTML
#            (if testedWorkingCircuit then className = "green circuit_preset_link" else className = "red circuit_preset_link")
#            circuitPresetHTML += prefix + "<a class=\"" + className + "\" id=\"" + circuitName + "\" href=\"#\">" + title + "</a> <br />"  if testedWorkingCircuit
#            console.log prefix + "Adding: " + title + " :: circuit: " + circuitName
#            if first and not Circuit.startCircuit?
#              Circuit.startCircuit = circuitName
#              Circuit.startLabel = title
#        p += l
#      $("#circuit_presets").html circuitPresetHTML
#
#      # Bind load file event to default circuit links
#      $(".circuit_preset_link").click ->
#        console.log "Loading Circuit: " + $(this).attr("id")
#        Circuit.readCircuitFromFile $(this).attr("id"), false


  ###
  Retrieves string data from a circuit text file (via AJAX GET)
  ###
  @readCircuitFromFile: (Circuit, circuitFileName, retain) ->
    #TODO:
#    result = $.get(js_asset_path + "circuits/" + circuitFileName, (b) ->
#      Circuit.clearAll()  unless retain
#      Circuit.readCircuitFromString b
#      Circuit.handleResize()  unless retain # for scopes
#    )


  ###
  Reads a circuit from a string buffer after loaded from from file.
  Called when the defaultCircuitFile is finished loading
  ###
  @readCircuitFromString: (Circuit, b) ->
    Circuit.clearAndReset()
    p = 0

    while p < b.length
      l = undefined
      linelen = 0
      l = 0
      while l isnt b.length - p
        if b.charAt(l + p) is "\n" or b.charAt(l + p) is "\r"
          linelen = l++
          l++  if l + p < b.length and b.charAt(l + p) is "\n"
          break
        l++
      line = b.substring(p, p + linelen)
      st = line.split(" ")
      while st.length > 0
        type = st.shift()
        if type is "o"
          sc = new Scope()
          sc.position = Circuit.scopeCount
          sc.undump st
          Circuit.scopes[Circuit.scopeCount++] = sc
          break
        if type is ("h")
          Circuit.readHint st
          break
        if type is ("$")
          Circuit.readOptions st
          break

        # ignore filter-specific stuff
        break  if type is ("%") or type is ("?") or type is ("B")
        type = parseInt(type)  if type >= ("0") and type <= ("9")
        x1 = Math.floor(st.shift())
        y1 = Math.floor(st.shift())
        x2 = Math.floor(st.shift())
        y2 = Math.floor(st.shift())
        f = Math.floor(st.shift())
        cls = Circuit.dumpTypes[type]
        unless cls?
          Circuit.error "unrecognized dump type: " + type
          break

        # ===================== NEW ELEMENTS ARE INSTANTIATED HERE ============================================
        ce = Circuit.constructElement(cls, x1, y1, x2, y2, f, st)
        console.log ce
        ce.setPoints()
        # =====================================================================================================

        # Add the element to the Element list
        Circuit.elementList.push ce
        break
      p += l
    dumpMessage = Circuit.dumpCircuit()
    Circuit.needAnalyze()
    Circuit.handleResize()

    #initCircuit();
    console.log "dump: \n" + dumpMessage


# The Footer exports class(es) in this file via Node.js, if Node.js is defined.
# This is necessary for testing through Mocha in development mode.
#
# see script/test and the /test directory for details.
#
# To require this class in another file through Node, write {ClassName} = require(<path_to_coffee_file>)
root = module ? window
module.exports = CircuitLoader