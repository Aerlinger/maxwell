_ = require("underscore")._
RJSConfig = require("./main.js")

module.exports = (grunt) ->

  # Add require.js to the paths.
  RJSConfig.paths = _.extend(RJSConfig.paths,
    "require-lib": "../node_modules/requirejs/require"
  )

  # Include EVERY path in the distributable.
  RJSConfig.include = []
  _.each RJSConfig.paths, (path, key) ->
    RJSConfig.include.push key
    return

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    requirejs:
      compile:
        options: _.extend(RJSConfig,
          name: "config"
          out: "dist/my-proj.js"
          baseUrl: "./src"
          generateSourceMaps: true
          optimize: "uglify2"
          optimizeAllPluginResources: true
          preserveLicenseComments: false
        )

    mocha:
      options:
        reporter: "Nyan" # Duh!
        run: true
        require: "coffee-script"


    coffee:
      test:
        files:
          "test/*.js": "test/*.coffee"

      glob_to_multiple:
        expand: true

      #        flatten: true,
        cwd: "./"
        src: [
          "src/**/*.coffee"
          "test/**/*_test.coffee"
        ]

        ext: ".js"

  grunt.loadNpmTasks "grunt-mocha"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-requirejs"
  grunt.registerTask "test", "Run Mocha tests.", ->

    # If no --test option is specified, run all tests.
    test_case = grunt.option("test") or "**/*"
    grunt.config.set "mocha.browser", ["test/" + test_case + ".html"]
    grunt.task.run "coffee"
    grunt.task.run "mocha"
    return

  grunt.registerTask "dist", ["requirejs"]
  return
