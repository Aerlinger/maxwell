require "json"

namespace :db do
  desc "Read circuits from setup list and populates database with the data"
  task populate_circuit_simulations: :environment do
    CircuitSimulation.delete_all
    read_circuit_setup_list
  end
end

def read_circuit_setup_list

  topic_stack = Array.new
  topic_stack << "root"

  path = "app/assets/javascripts/Faraday/"
  file_string = File.read(path+"setuplist.txt")

  lines = file_string.split("\n")

  lines.each do |line|

    if line[0] == "#"
      next
    elsif line[0] == "+"
      new_topic = line
      print "\n#{"  "*(topic_stack.size)}Created topic: #{topic_stack}   >>   #{new_topic}\n"
      new_topic[0] = ''
      topic_stack << new_topic
    elsif line[0] == "-"
      last_topic = topic_stack.pop
      print "#{"  "*(topic_stack.size)}Removed topic: #{topic_stack}   <<   #{last_topic}\n"
    else
      circuit_sim = CircuitSimulation.new
      file_line = line.split(" ")

      filename  = file_line.shift()
      title     = file_line.join(" ")
      topic     = topic_stack.last

      if filename[0] == "$"
        working     = true
        filename[0] = ''
      end
      print  "#{"  "*topic_stack.size}  Creating: \t#{filename}  \t#{title}\n"

      circuit_sim.title             = title
      circuit_sim.completion_status = "complete" if working
      circuit_sim.topic             = topic
      circuit_sim.name_unique       = filename

      read_circuit_file(circuit_sim, path, filename)

      begin
        circuit_sim.save!
      rescue Exception => e
        print e
      end
    end

  end
end

def read_circuit_file(circuit_sim, path, circuit_filename)

  circuit_data = File.read("#{path}circuits/#{circuit_filename}")

  lines = circuit_data.split("\n")
  output_data = []

  lines.each do |line|

    # Skip blank lines, empty lines, and comments ()starting with a '#')
    next if line.nil? || line.empty? || line[0] == "#"

    # If this is a circuit configuration line (starts with '$')
    if line[0] == '$'
      line[0] = ''
      sim_params = line.split(' ')

      circuit_sim.flags           = sim_params.shift
      circuit_sim.time_step       = sim_params.shift
      circuit_sim.sim_speed       = sim_params.shift
      circuit_sim.current_speed   = sim_params.shift
      circuit_sim.voltage_range   = sim_params.shift
      circuit_sim.power_range     = sim_params.shift || 0

      output_data << circuit_sim

    # Else, this is a Circuit Element
    else
      circuit_element_params = line.split(' ')

      new_circuit_element = {}
      new_circuit_element[:sym] = circuit_element_params.shift
      new_circuit_element[:x1] = circuit_element_params.shift
      new_circuit_element[:y1] = circuit_element_params.shift
      new_circuit_element[:x2] = circuit_element_params.shift
      new_circuit_element[:y2] = circuit_element_params.shift
      new_circuit_element[:flags] = circuit_element_params.shift
      new_circuit_element[:params] = circuit_element_params

      output_data << new_circuit_element

    end

  end

  #File.open(circuit_filename.gsub("txt", "json"), 'w+') { |f| f.write clean_json(output_data.to_json) }

end

def clean_json(json_string)
  json_string.gsub!("},", "},\n")
  json_string.gsub!(",", ",\t\t")
end