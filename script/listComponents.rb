#!/usr/bin/env ruby

Dir.chdir('../src/component/components/') do
  Dir.glob('*.coffee').each do |item|
    fname = item.gsub('.coffee', '')
    puts "#{fname}: 'cs!src/component/#{fname}',"
  end
end
