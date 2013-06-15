module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef:  true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          XMLHttpRequest: true,
          ActiveXObject: true,
          module: true,
          L:true
        }
      },
      all: ['Gruntfile.js', 'src/**/*.js']
    },
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [
          'vendor/arcgis-node/browser/arcgis.js',
          'vendor/terraformer/dist/browser/terraformer.js',
          'vendor/terraformer/dist/browser/rtree.js',
          'vendor/terraformer/dist/browser/arcgis.js',
          'src/**/*.js'
        ],
        dest: 'dist/esri-leaflet.js'
      }
    },
    uglify: {
      options: {
        wrap: false,
        mangle: {
          except: ['Esri', 'Terraformer']
        },
        report: 'gzip',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache License' +
        '*/\n'
      },
      dist: {
        files: {
          'dist/esri-leaflet.min.js': [
            'vendor/arcgis-node/browser/arcgis.js',
            'vendor/terraformer/dist/browser/terraformer.js',
            'vendor/terraformer/dist/browser/rtree.js',
            'vendor/terraformer/dist/browser/arcgis.js',
            'src/**/*.js'
          ],
          'dist/esri-leaflet.unbundled.min.js': [
            'src/**/*.js'
          ]
        }
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache License' +
        '*/\n',
        report: 'gzip'
      },
      compress: {
        files: {
          'dist/esri-leaflet.min.css': ['src/esri-leaflet.css']
        }
      }
    },
    watch: {
      src: {
        files: ['src/**/*.js'],
        tasks: ['build'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['default', 'uglify', 'cssmin']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');


};