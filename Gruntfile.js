module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      glob_to_multiple: {
        expand: true,
        //flatten: true,
        //cwd: 'path/to',
        src: ['src/**/*.coffee'],
        dest: 'build/js',
        ext: '.js'
      }
    },
    clean: {
      build: ["build"],
      release: ["path/to/another/dir/two"]
    },
    requirejs: {
      compile: {
        options: {
          almond: true,
          //wrap: true,
          baseUrl: "src",
          mainConfigFile: "main.js",
          include: ["../bower_components/almond/almond", "../build/js/src/Maxwell"],
          exclude: ['coffee-script'],
          stubModules: ['cs'],
          //modules: [
          //  {
          //    name: '../main',
          //    exclude: 'coffee-script'
          //  }
          //],
          paths: {
            'cs' :'../bower_components/require-cs/cs',
            'coffee-script': '../bower_components/coffeescript/extras/coffee-script'
          },
          optimize: "none",
          out: "build/maxwell.js",
          name: '../bower_components/almond/almond'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt',
          quiet: false,
          ui: 'bdd',
          clearRequireCache: false,
          require: ['coffee-script/register', 'test/test-main.js']
        },
        src: ['test/**/*test.coffee']
      }
    },
    watch: {
      module_test: {
        files: ['Gruntfile.js', 'test/**/*', "src/**/*.coffee"],
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
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('default', 'mochaTest');
};
