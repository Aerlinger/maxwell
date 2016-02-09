describe "Render all components", ->
  it "can render all components", ->
    @circuit = new Circuit("All components")

    row = 0
    col = 0

    Canvas = require('canvas')
    @canvas = new Canvas(1000, 1000)
    ctx = @canvas.getContext('2d')

    @Circuit = new Circuit("AllComponents")

    @renderer = new Renderer(@Circuit, @canvas)
    ctx.imageSmoothingEnabled = true
    @renderer.context = ctx

    col = 0
    row = 0
    height = 100

    for sym, Component of ComponentRegistry.ComponentDefs
      if sym not in ['170', 'A', 'o', '$', '%', '?', 'B']

        console.log(sym, ": ", Component.name)

        col += 100
        row = col / 500 + 50

        x = col % (900) + 100
        y = 2 * Math.floor(col / 800) * height + height

        @component = new Component(x, y, x, y + height)
        @Circuit.solder(@component)

    @renderer.drawComponents()

    fs.writeFileSync("test/fixtures/componentRenders/all_components.png", @canvas.toBuffer())
