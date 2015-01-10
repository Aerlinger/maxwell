module.exports = function(grunt) {
  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          //almond: true,
          //wrap: true,
          baseUrl: "",
          mainConfigFile: "main.js",
          //name: 'node_modules/almond/almond',
          optimize: "none",
          out: "build/maxwell.js"


          //name: 'bower_components/almond/almond'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');
  //grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask("dist", ["requirejs"]);
};
