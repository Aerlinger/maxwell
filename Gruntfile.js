// Generated by CoffeeScript 1.8.0
(function() {
  var RJSConfig, _;

  _ = require("underscore")._;

  RJSConfig = require("./main.js");

  module.exports = function(grunt) {
    RJSConfig.paths = _.extend(RJSConfig.paths, {
      "require-lib": "node_modules/requirejs/require"
    });
    RJSConfig.include = [];
    _.each(RJSConfig.paths, function(path, key) {
      RJSConfig.include.push(key);
    });
    grunt.initConfig({
      pkg: grunt.file.readJSON("package.json"),
      requirejs: {
        compile: {
          options: _.extend(RJSConfig, {
            name: "build/Maxwell",
            out: "build/maxwell.min.js",
            baseUrl: "",
            include: [''],
            generateSourceMaps: true,
            optimize: "uglify2",
            optimizeAllPluginResources: true,
            preserveLicenseComments: false
          })
        }
      },
      mocha: {
        options: {
          reporter: "Nyan",
          run: true,
          require: "coffee-script"
        }
      },
      coffee: {
        app: {
          src: "src/**/*.coffee",
          dest: "build/Maxwell.js",
          options: {
            bare: false,
            preserve_dirs: true,
            base_path: 'build/coffee'
          }
        },
        test: {
          files: {
            "test/*.js": "test/*.coffee"
          }
        },
        glob_to_multiple: {
          expand: true,
          cwd: "./",
          src: ["src/**/*.coffee", "test/**/*_test.coffee"],
          ext: ".js"
        }
      }
    });
    grunt.loadNpmTasks("grunt-contrib-coffee");
    grunt.loadNpmTasks("grunt-mocha");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.registerTask("test", "Run Mocha tests.", function() {
      var test_case;
      test_case = grunt.option("test") || "**/*";
//      grunt.config.set("mocha.browser", ["test/" + test_case + ".html"]);
//      grunt.task.run("coffee");
      grunt.task.run("mocha");
    });
    grunt.registerTask("dist", ["requirejs"]);
  };

}).call(this);
