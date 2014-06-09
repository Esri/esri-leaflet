module.exports = function(grunt) {
  var browsers = grunt.option('browser') ? grunt.option('browser').split(',') : ['PhantomJS'];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: {
        src: [
          'Gruntfile.js',
          'src/**/*.js'
        ]
      }
    },
    watch: {
      scripts: {
        files: [
          'src/**/*.js',
          'spec/**/*.js'
        ],
        tasks: ['jshint'],
        options: {
          spawn: false
        }
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: ['connect', 'watch:scripts', 'karma:watch']
    },
    concat: {
      options: {
        separator: '\n',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache License' +
        '*/\n'
      },
      complete: {
        src: [
          'src/EsriLeaflet.js',
          'src/Util.js',
          'src/Request.js',
          'src/Services/Service.js',
          'src/Services/FeatureLayer.js',
          'src/Services/MapService.js',
          'src/Tasks/**/*.js',
          'src/Layers/DynamicMapLayer.js',
          'src/Layers/TiledMapLayer.js',
          'src/Layers/FeatureLayer/FeatureGrid.js',
          'src/Layers/FeatureLayer/FeatureManager.js',
          'src/Layers/FeatureLayer/FeatureLayer.js'
        ],
        dest: 'dist/esri-leaflet-src.js'
      },
      core: {
        src: [
          'src/EsriLeaflet.js',
          'src/Util.js',
          'src/Request.js',
          'src/Services/Service.js'
        ],
        dest: 'dist/esri-leaflet-core-src.js'
      },
      basemaps: {
        src: [
          'src/EsriLeaflet.js',
          'src/Util.js',
          'src/Request.js',
          'src/Layers/BasemapLayer.js'
        ],
        dest: 'dist/extras/esri-basemaps-src.js'
      },
      mapservice: {
        src: [
          'src/EsriLeaflet.js',
          'src/Util.js',
          'src/Request.js',
          'src/Services/MapService.js',
          'src/Tasks/Identify.js',
          'src/Tasks/Query.js',
          'src/Layers/DynamicMapLayer',
          'src/Layers/TiledMapLayer'
        ],
        dest: 'dist/compact/esri-map-service-src.js'
      },
      featureservice: {
        src: [
          'src/EsriLeaflet.js',
          'src/Util.js',
          'src/Request.js',
          'src/Services/FeatureLayer.js',
          'src/Tasks/Query.js',
          'src/Layers/FeatureLayer/FeatureGrid.js',
          'src/Layers/FeatureLayer/FeatureManager.js',
          'src/Layers/FeatureLayer/FeatureLayer.js'
        ],
        dest: 'dist/compact/esri-feature-service-src.js'
      },
      cluster: {
        src: ['src/Layers/ClusteredFeatureLayer/ClusteredFeatureLayer.js'],
        dest: 'dist/extras/clustered-feature-layer-src.js'
      },
      heat: {
        src: ['src/Layers/HeatMapFeatureLayer/HeatMapFeatureLayer.js'],
        dest: 'dist/extras/heatmap-feature-layer-src.js'
      }
    },
    uglify: {
      options: {
        wrap: false,
        mangle: {
          except: ['L']
        },
        preserveComments: 'some',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/esri-leaflet.js': [
            'dist/esri-leaflet-src.js'
          ],
          'dist/esri-leaflet-core.js': [
            'dist/esri-leaflet-core-src.js'
          ],
          'dist/extras/esri-basemaps.js': [
            'dist/extras/esri-basemaps-src.js'
          ],
          'dist/extras/clustered-feature-layer.js': [
            'dist/extras/clustered-feature-layer-src.js'
          ],
          'dist/compact/esri-map-service.js': [
            'dist/compact/esri-map-service-src.js'
          ],
          'dist/compact/esri-feature-service.js': [
            'dist/compact/esri-feature-service-src.js'
          ]
        }
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      run: {
        reporters: ['mocha'],
        browsers: browsers
      },
      coverage: {
        reporters: ['mocha', 'coverage'],
        browsers: browsers,
        preprocessors: {
          'src/**/*.js': 'coverage'
        }
      },
      watch: {
        singleRun: false,
        autoWatch: true,
        browsers: browsers
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.',
          keepalive: true
        }
      }
    },
    'gh-pages': {
      options: {
        base: 'examples',
        repo: 'git@github.com:Esri/esri-leaflet.git'
      },
      src: ['**']
    }
  });

  grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('build', ['jshint', 'karma:coverage','concat', 'uglify']);
  grunt.registerTask('test', ['karma:run']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-gh-pages');
};