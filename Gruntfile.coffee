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
      module_test:
        files: [
          "Gruntfile.js"
          "test/**/*"
          "src/**/*.coffee"
        ]
        tasks: ["mochaTest"]

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
        base: 'examples',
        livereload: 35729,
        hostname: 'localhost'
#      livereload:
#        options:
#          open: true,
#          base: ['.tmp', './examples']
      server:
        options:
          keepalive: true,
          open: true
          port: 6502
      test:
        options:
          port: 4004
          base: [
            '.tmp',
            'test'
          ]

    open:
      all:
        path: 'http://localhost:<%= connect.server.options.port %>'


  grunt.loadNpmTasks "grunt-mocha-test"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-coffeeify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-open"

  grunt.registerTask 'server', ['connect:server']
  grunt.registerTask "default", ["coffeeify", "mochaTest"]

  return
