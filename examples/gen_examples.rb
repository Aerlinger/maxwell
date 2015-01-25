files = Dir.glob("circuits/*.json").map { |circuit_name| circuit_name.gsub('circuits/', '').gsub(".json", "") }

width=1000
height=800

files.each do |filename|
  template = <<-JADE
extends ../layout

block body
  canvas.maxwell(data-circuit="#{filename}", width="#{width}", height="#{height}")

  JADE

  File.write("examples/templates/#{filename}.jade", template)
end
