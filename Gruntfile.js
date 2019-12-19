const sass = require('node-sass');

module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      options: {
        sourceMap: true,
        implementation: sass
      },
      dist: {
        files: {
          "public/css/style.css": "public/css/style.scss"
        }
      }
    },
    watch: {
      scripts: {
        files: ["public/css/*.scss"],
        tasks: ["sass"],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("scss", ["sass"]);
  grunt.registerTask("scsswatch", ["watch"]);
};
