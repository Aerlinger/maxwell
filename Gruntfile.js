module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    "mocha-server": {
      testRequireJS: {
        src: 'test/**/*.test.js',
        options: {
          require: ['coffee-script/register', 'test/test-main.js'],
          rjsConfig: {
            baseUrl: "./src",
            paths: {
              FormatUtils: "util/formatUtils",
              cs: '../bower_components/require-cs/cs',
              "maxwell.test": "../test/maxwell.test"
            },
            packages: [
              {
                name: 'cs',
                location: 'bower_components/require-cs/',
                main: 'cs'
              },
              {
                name: 'coffee-script',
                location: 'bower_components/coffee-script/extras',
                main: 'coffee-script'
              }
            ]
          }
        }
      }
    },
    //requirejs: {
    //  compile: {
    //    options: {
    //      almond: true,
    //      wrap: true,
          //baseUrl: "",
          //mainConfigFile: "main.js",
          //name: 'node_modules/almond/almond',
          //optimize: "none",
          //out: "build/maxwell.js"
          //
          //
          //name: 'bower_components/almond/almond'
        //}
      //}
    //},
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          require: ['coffee-script/register', 'test/test-main.js']
        },
        src: ['test/**/*test.coffee']
      }
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-server-mocha');
  //grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('default', 'mochaTest');

  //grunt.registerTask("dist", ["requirejs"]);
};
