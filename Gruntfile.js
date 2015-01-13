module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          almond: true,
          //wrap: true,
          baseUrl: "",
          mainConfigFile: "main.js",
          //name: 'node_modules/almond/almond',
          optimize: "none",
          out: "build/maxwell.js",
          name: 'bower_components/almond/almond'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt',
          quiet: false,
          clearRequireCache: false,
          require: ['coffee-script/register', 'test/test-main.js']
        },
        src: ['test/**/*test.coffee']
      }
    },
    watch: {
      module_test: {
        files: ['test/**/*'],
        tasks: ['mochaTest']
      }
      //autoreload: {
      //  files: ['lib/**/*', 'built-app/**/*'],
      //  options: {
      //    livereload: true
      //  }
      //}
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('default', 'mochaTest');
};
