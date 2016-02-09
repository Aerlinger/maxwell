fs = require('fs')
path = require('path')

#examples = ->
#  result = []
#
#  for example in fs.readdirSync('./examples/templates')
#    result.push(path.basename(example, '.jade'))
#
#  return result

#enumerate_examples = ->
#  result = {}
#
#  for example in examples()
#    result['./examples/' + example + ".html"] = './examples/templates/' + example + ".jade"
#
#  return result

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
      release: ["dist"]

    mochaTest:
      test:
        options:
          reporter: "spec"
          quiet: false
          ui: "bdd"
          clearRequireCache: false
          require: [
            "coffee-script/register"
            "test/test_helper.js"
          ]
        src: ["test/**/*Test.coffee"]
      testComponents:
        options:
          reporter: "spec"
          quiet: false
          ui: "bdd"
          clearRequireCache: false
          require: [
            "coffee-script/register"
            "test/test_helper.js"
          ]
        src: ["test/component/**/*Test.coffee"]

    mocha:
      test:
        src: ['test/client/**/*.html']
        require: [
          "coffee-script/register"
        ]
        options:
          run: true,
          require: [
            "coffee-script/register"
          ]

    watch:
      test:
        files: [
          "Gruntfile.js"
          "test/test_helper.js"
          "test/**/*.coffee"
          "src/**/*.coffee"
        ]
        tasks: ["mochaTest"]
      compile:
        files: [
          "src/**/*.coffee"
        ]
        tasks: ["coffeeify"]
        options:
          livereload: true

    coffeelint:
      app: ['src/**/*.coffee', 'test/**/*.coffee']
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
    uglify:
      mangle: true
      release:
        files:
          'dist/maxwell.min.js': ['dist/maxwell.js']


  grunt.loadNpmTasks "grunt-mocha"
  grunt.loadNpmTasks "grunt-mocha-test"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-coffeeify"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  grunt.registerTask 'server', ['connect:server']
  grunt.registerTask "test", ["mochaTest", "mocha"]
  grunt.registerTask "default", ["test", "coffeeify"]

  grunt.registerTask('heroku:development', 'coffeeify');

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
