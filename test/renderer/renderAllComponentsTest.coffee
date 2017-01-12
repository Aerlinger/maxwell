describe "Render all components", ->
  it.skip "can render all components", ->
    this.timeout(5000)

    Canvas = require('canvas')
    @canvas = new Canvas(2200, 1000)
    ctx = @canvas.getContext('2d')

    @Circuit = new Circuit("AllComponents")

    @renderer = new Renderer(@Circuit, @canvas)
    ctx.imageSmoothingEnabled = true
    @renderer.context = ctx

    col = 0
    height = 80

    offsetX = 200
    nCols = 10

    for sym, Component of ComponentRegistry.ComponentDefs
      if sym not in ['170', 'A', 'o', '$', '%', '?', 'B']

        x = col % (nCols * offsetX) + offsetX
        y = 2 * Math.floor(col / (offsetX * nCols)) * height + height

        @component = new Component(x, y, x, y + height)
        @Circuit.solder(@component)

        origfont = ctx.font
        ctx.font = "12px serif"
        ctx.fillText(@component.toString(), x - @component.boundingBox.width, y - 30)
        ctx.font = origfont

        col += offsetX

    @renderer.drawComponents()

    fs.writeFileSync("test/fixtures/componentRenders/all_components.png", @canvas.toBuffer())
