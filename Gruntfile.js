var fs = require('fs');

module.exports = function(grunt) {
  var browsers = grunt.option('browser') ? grunt.option('browser').split(',') : ['PhantomJS'];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
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
      },
      'docs-sass': {
        files: ['site/source/scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          nospawn: true
        }
      },
      'docs-js': {
        files: ['site/source/**/*.js'],
        tasks: ['copy:assemble'],
        options: {
          nospawn: true
        }
      },
      'docs-img': {
        files: ['site/source/img/**/*'],
        tasks: ['newer:imagemin'],
        options: {
          nospawn: true
        }
      },
      'docs-assemble': {
        files: ['site/source/**/*.md', 'site/source/**/*.hbs'],
        tasks: ['assemble:dev'],
        options: {
          nospawn: true
        }
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: ['watch:scripts', 'karma:watch', 'docs']
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
          'src/Layers/BasemapLayer.js',
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
        dest: 'dist/builds/core/esri-leaflet-core-src.js'
      },
      basemaps: {
        src: [
          'src/EsriLeaflet.js',
          'src/Request.js',
          'src/Layers/BasemapLayer.js'
        ],
        dest: 'dist/builds/basemaps/esri-leaflet-basemaps-src.js'
      },
      mapservice: {
        src: [
          'src/EsriLeaflet.js',
          'src/Util.js',
          'src/Request.js',
          'src/Services/Service.js',
          'src/Services/MapService.js',
          'src/Tasks/Identify.js',
          'src/Tasks/Query.js',
          'src/Layers/DynamicMapLayer',
          'src/Layers/TiledMapLayer'
        ],
        dest: 'dist/builds/map-service/esri-leaflet-map-service-src.js'
      },
      featureservice: {
        src: [
          'src/EsriLeaflet.js',
          'src/Util.js',
          'src/Request.js',
          'src/Services/Service.js',
          'src/Services/FeatureLayer.js',
          'src/Tasks/Query.js',
          'src/Layers/FeatureLayer/FeatureGrid.js',
          'src/Layers/FeatureLayer/FeatureManager.js',
          'src/Layers/FeatureLayer/FeatureLayer.js'
        ],
        dest: 'dist/builds/feature-layer/esri-leaflet-feature-layer-src.js'
      },
      cluster: {
        src: ['src/Layers/ClusteredFeatureLayer/ClusteredFeatureLayer.js'],
        dest: 'dist/builds/clustered-feature-layer/esri-leaflet-clustered-feature-layer-src.js'
      },
      heat: {
        src: ['src/Layers/HeatMapFeatureLayer/HeatMapFeatureLayer.js'],
        dest: 'dist/builds/heatmap-feature-layer/esri-leafelt-heatmap-feature-layer-src.js'
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
          'dist/builds/core/esri-leaflet-core.js': [
            'dist/builds/core/esri-leaflet-core-src.js'
          ],
          'dist/builds/basemaps/esri-leaflet-basemaps.js': [
            'dist/builds/basemaps/esri-leaflet-basemaps-src.js'
          ],
          'dist/builds/clustered-feature-layer/esri-leaflet-clustered-feature-layer.js': [
            'dist/builds/clustered-feature-layer/esri-leaflet-clustered-feature-layer-src.js'
          ],
          'dist/builds/heatmap-feature-layer/esri-leafelt-heatmap-feature-layer.js': [
            'dist/builds/heatmap-feature-layer/esri-leafelt-heatmap-feature-layer-src.js'
          ],
          'dist/builds/map-service/esri-leaflet-map-service.js': [
            'dist/builds/map-service/esri-leaflet-map-service-src.js'
          ],
          'dist/builds/feature-layer/esri-leaflet-feature-layer.js': [
            'dist/builds/feature-layer/esri-leaflet-feature-layer-src.js'
          ]
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      run: {
        reporters: ['progress'],
        browsers: browsers
      },
      coverage: {
        reporters: ['progress', 'coverage'],
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
      },
      docs: {
        options: {
          port: 8001,
          hostname: '0.0.0.0',
          base: './site/build/'
        }
      }
    },

    assemble: {
      options: {
        layout: 'layout.hbs',
        layoutdir: 'site/source/layouts/',
        partials: 'site/source/partials/**/*.hbs',
        helpers: ['site/source/helpers/**/*.js' ]
      },
      dev: {
        options: {
          assets: 'site/build/'
        },
        files: [{
          cwd: 'site/source/pages',
          dest: 'site/build',
          expand: true,
          src: ['**/*.hbs', '**/*.md']
        }]
      },
      build: {
        options: {
          assets: 'esri-leaflet/'
        },
        files: [{
          cwd: 'site/source/pages',
          dest: 'site/build',
          expand: true,
          src: ['**/*.hbs', '**/*.md']
        }]
      }
    },

    copy: {
      assemble: {
        files: [
          { src: 'dist/esri-leaflet.js', dest: 'site/build/js/esri-leaflet.js'},
          { src: 'dist/esri-leaflet-src.js', dest: 'site/build/js/esri-leaflet-src.js'},
          { src: 'dist/builds/heatmap-feature-layer/esri-leaflet-heatmap-feature-layer-src.js', dest: 'site/build/js/heatmap-feature-layer-src.js'},
          { src: 'dist/builds/clustered-feature-layer/esri-leaflet-clustered-feature-layer-src.js', dest: 'site/build/js/clustered-feature-layer-src.js'},
          { src: 'site/source/js/script.js', dest: 'site/build/js/script.js'}
        ]
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'site/source/img',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'site/build/img'
        }]
      }
    },

    sass: {
      site: {
        files: {
          'site/build/css/style.css': 'site/source/scss/style.scss'
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'site/build',
        repo: grunt.option('repo')
      },
      src: ['**']
    },

    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          // 1 Year cache policy (1000 * 60 * 60 * 24 * 365)
          'Cache-Control': 'max-age=630720000, public',
          'Expires': new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      upload: {
        upload: [
          {
            src: 'dist/**/*',
            dest: 'esri-leaflet/<%= pkg.version %>/'
          }
        ]
      }
    }
  });

  var awsExists = fs.existsSync(process.env.HOME + '/esri-leaflet-s3.json');

  if (awsExists) {
    grunt.config.set('aws', grunt.file.readJSON(process.env.HOME + '/esri-leaflet-s3.json'));
  }

  // Development Tasks
  grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('build', ['jshint', 'karma:coverage','concat', 'uglify']);
  grunt.registerTask('test', ['karma:run']);

  // Documentation Site Tasks
  grunt.registerTask('docs', ['assemble:dev', 'sass', 'copy', 'connect:docs', 'watch']);

  // Documentation Site Tasks
  grunt.registerTask('docs:build', ['assemble:build', 'sass', 'gh-pages']);

  // Require all grunt modules
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

};