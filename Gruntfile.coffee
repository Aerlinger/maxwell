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
          captureFile: "results.txt"
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
      app: ['*.coffee']
      options:
        configFile: 'coffeelint.json'
    coffeeify:
#      options:
#        debug: true
      files:
        paths: ['./node_modules','./src']
        src: 'src/**/*.coffee',
        dest: 'app/script.js'
  
  #autoreload: {
  #  files: ['lib/**/*', 'built-app/**/*'],
  #  options: {
  #    livereload: true
  #  }
  #}
  grunt.loadNpmTasks "grunt-mocha-test"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-coffeeify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.registerTask "default", "mochaTest"

  return
