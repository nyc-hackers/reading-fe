module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jscs: {
      files: ["Gruntfile.js", "js/**/*.js"],
      options: {
        preset: "google",
        validateQuoteMarks: "\"",
        verbose: true
      }
    },
    jshint: {
      files: ["Gruntfile.js", "js/**/*.js"],
      options: {
        curly: true,
        eqeqeq: true,
        maxdepth: 2,
        //undef: true, // NOTE: use this later
        //unused: true,
        quotmark: "double",
        globals: {
          jQuery: true
        }
      },
    },
    watch: {
      js: {
        files: ["<%= jshint.files %>", "js/**/*.js"],
        tasks: ["jshint", "jscs", "concat"]
      },
      scss: {
        files: ["scss/**/*.scss"],
        tasks: ["sass"]
      },
      haml: {
        files: ["templates/**/*.haml"],
        tasks: ["haml"]
      }
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ";"
      },
      app: {
        src: ["js/*.js",
          "js/factories/**/*.js",
          "js/directives/**/*.js",
          "js/controllers/**/*.js",
        ],
        // the location of the resulting JS file
        dest: "public/js/app.js"
      },
      deps: {
        src: ["node_modules/**/*.min.js"],
        // the location of the resulting JS file
        dest: "public/js/libraries-<%= pkg.name %>-<%= pkg.version %>.js"
      }
    },
    sass: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          "public/css/app.css": "css/app.scss"
        }
      }
    },
    haml: {
      options: {
        language: "ruby",
        rubyHamlCommand: "haml -t indented"
      },
      index: {
        files: {
          "index.html": "templates/index.haml",
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-haml");
  grunt.loadNpmTasks("grunt-jscs");

  grunt.registerTask("default", ["jshint", "concat", "sass", "haml", "jscs"]);

};
