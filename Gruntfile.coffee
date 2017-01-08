fs = require('fs')
path = require('path')

module.exports = (grunt) ->
  require('time-grunt')(grunt)

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

  grunt.loadNpmTasks "grunt-mocha"
  grunt.loadNpmTasks "grunt-mocha-test"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-clean"

  grunt.registerTask 'server', ['connect:server']
  grunt.registerTask "test", ["mochaTest", "mocha"]
  grunt.registerTask "default", ["test", "coffeeify"]


  return
