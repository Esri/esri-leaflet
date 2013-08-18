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
        separator: '\n',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache License' +
        '*/\n'
      },
      core: {
        src: [
          'vendor/terraformer/dist/browser/terraformer.js',
          'vendor/terraformer/dist/browser/rtree.js',
          'vendor/terraformer/dist/browser/arcgis.js',
          'src/esri-leaflet.js',
          'src/Layers/BasemapLayer.js',
          'src/Layers/FeatureLayer.js',
          'src/Layers/TiledMapLayer.js',
          'src/Layers/DynamicMapLayer.js'
        ],
        dest: 'dist/esri-leaflet-src.js'
      },
      basemaps: {
        src: [
          'src/esri-leaflet.js',
          'src/Layers/BasemapLayer.js'
        ],
        dest: 'dist/extras/esri-basemaps-src.js'
      },
      cluster: {
        src: ["src/Layers/ClusteredFeatureLayer.js"],
        dest: 'dist/extras/clustered-feature-layer-src.js'
      }
    },
    uglify: {
      options: {
        wrap: false,
        mangle: {
          except: ['Terraformer']
        },
        preserveComments: 'some',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/esri-leaflet.js': [
            "dist/esri-leaflet-src.js"
          ],
          'dist/extras/clustered-feature-layer.js': [
            'dist/extras/clustered-feature-layer-src.js'
          ],
          'dist/extras/esri-basemaps.js': [
            'dist/extras/esri-basemaps-src.js'
          ]
        }
      }
    },
    karma: {
      single: {
        configFile: 'karma.conf.js',
      },
      watch: {
        configFile: 'karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
      coverage: {
        configFile: 'karma.conf.js',
        preprocessors:{
          'src/**/*.js': 'coverage'
        },
        coverageReporter: {
          type : 'html',
          dir : './coverage/'
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['karma:coverage', 'default', 'uglify']);
  grunt.registerTask('test', ['karma:single']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-karma');

};