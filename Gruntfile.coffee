fs = require('fs')
path = require('path')

examples = ->
  result = []

  for example in fs.readdirSync('./examples/templates')
    result.push(path.basename(example, '.jade'))

  return result

enumerate_examples = ->
  result = {}

  for example in examples()
    result['./examples/' + example + ".html"] = './examples/templates/' + example + ".jade"

  return result

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    coffee:
      glob_to_multiple:
        expand: true
        src: ["src/**/*.coffee"]
        dest: "build/js"
        ext: ".js"

    clean:
      build: ["build"]
      release: ["path/to/another/dir/two"]

    mochaTest:
      test:
        options:
          reporter: "spec"
          quiet: false
          ui: "bdd"
          clearRequireCache: false
          require: [
            "coffee-script/register"
            "test/test-main.js"
          ]
        src: ["test/**/*test.coffee"]

    watch:
      test:
        files: [
          "Gruntfile.js"
          "test/test-main.js"
          "test/**/*.coffee"
          "src/**/*.coffee"
        ]
        tasks: ["mochaTest"]
      examples:
        files: [
          "examples/layout.jade"
          "examples/templates/**/*"
        ]
        tasks: ["jade"]
        options:
          livereload: true
      compile:
        files: [
          "src/**/*.coffee"
        ]
        tasks: ["coffeeify"]
        options:
          livereload: true

    coffeelint:
      app: ['src/**/*.coffee']
      options:
        configFile: 'coffeelint.json'

    coffeeify:
      files:
        src: 'src/Maxwell.coffee',
        dest: 'dist/maxwell.js'

    connect:
      options:
        hostname: 'localhost'
      server:
        options:
          livereload: 35729,
          keepalive: true
          open: 'http://localhost:6502/examples'
          port: 6502
      test:
        options:
          port: 4004
          base: [
            '.tmp',
            'test'
          ]
    jade:
      compile:
        options:
          pretty: true
          data:
            debug: false
            examples: examples()
        files: enumerate_examples()

  grunt.loadNpmTasks "grunt-mocha-test"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-coffeeify"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-clean"

  grunt.registerTask 'server', ['connect:server']
  grunt.registerTask "default", ["coffeeify", "mochaTest"]

#  grunt.registerTask 'examples', 'Creates base example jade files', ->
#    files = [
#      "ohms"
#      "induct"
#
#      # Buggy:
#      "amp-follower"
#      "nmosfet"
#      "amp-noninvert"
#
#      "zeneriv"
#      "relaxosc"
#      "amp-schmitt"
#      "howland"
#      "dcrestoration"
#      "ladder"
#
#      "sine"
#
#      "sawtooth"
#
#      "grid"
#      "amp-fullrect"
#
#      "triangle"
#      "phaseshiftosc"
#
#      "mosfetamp"
#      "mosswitch"
#      "amp-diff"
#      "inductac"
#      "amp-integ"
#      "indmultind"
#      "diodelimit"
#      "rectify"
#      "diodecurve"
#      "fullrect"
#      "amp-sum"
#      "gyrator"
#      "voltdividesimple"
#    ]

  return
