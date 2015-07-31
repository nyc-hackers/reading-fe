module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ["Gruntfile.js", "js/**/*.js"],
      options: {
        globals: {
          jQuery: true
        }
      },
    },
    watch: {
      files: ['<%= jshint.files %>', 'js/**/*.js'],
      tasks: ['jshint', 'concat']
    },
    concat: {
        options: {
          // define a string to put between each file in the concatenated output
          separator: ';'
        },
        app: {
          // the files to concatenate
          src: ['js/**/*.js'],
          // the location of the resulting JS file
          dest: 'public/js/app.js'
        },
        deps: {
          src: ['node_modules/**/*.min.js'],
          // the location of the resulting JS file
          dest: 'public/js/libraries-<%= pkg.name %>-<%= pkg.version %>.js'
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['jshint', 'concat']);

};
