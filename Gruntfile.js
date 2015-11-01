module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    configs: {
      target: grunt.option("target") || "development"
    },
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
        separator: ";",
      },
      app: {
        src: ["js/*.js",
          "js/config/" + "<%= configs.target %>" + ".js",
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
          "public/css/app.css": "scss/app.scss"
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
      },
      templates: {
        files: grunt.file.expandMapping(["templates/_*.haml"], "views/", {
          rename: function(base, path) {
            return base + path.replace("templates\/", "").replace(/\.haml$/, ".html");
          }
        })
      }
    },
    karma: {
      unit: {
        options: {
          frameworks: ["jasmine"],
          singleRun: true,
          browsers: ["PhantomJS"],
          files: [
            "node_modules/angular/angular.js",
            "bower_components/angular-mocks/angular-mocks.js",
            "public/js/app.js",
            "tests/*.js"
          ]
        }
      }
    }
  });

  var target = grunt.option("target") || "development";
  console.log("HELLO", target);

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-haml");
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks("grunt-karma");

  grunt.registerTask("default",
                     ["jshint", "concat", "sass", "haml", "jscs"]);

};
