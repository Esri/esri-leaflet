var fs = require('fs');

module.exports = function(grunt) {
  var browsers = grunt.option('browser') ? grunt.option('browser').split(',') : ['PhantomJS'];

  var copyright = '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd\') %>\n' +
                  '*   Copyright (c) <%= grunt.template.today(\'yyyy\') %> Environmental Systems Research Institute, Inc.\n' +
                  '*   Apache License' +
                  '*/\n';

  var umdHeader = '(function (factory) {\n' +
                  '  //define an AMD module that relies on \'leaflet\'\n' +
                  '  if (typeof define === \'function\' && define.amd) {\n' +
                  '    define([\'leaflet\'], function (L) {\n' +
                  '      return factory(L);\n' +
                  '    });\n' +
                  '  //define a common js module that relies on \'leaflet\'\n' +
                  '  } else if (typeof module === \'object\' && typeof module.exports === \'object\') {\n' +
                  '    module.exports = factory(require(\'leaflet\'));\n' +
                  '  }\n\n' +
                  '  if(typeof window !== \'undefined\' && window.L){\n' +
                  '    factory(window.L);\n' +
                  '  }\n' +
                  '}(function (L) {\n';

  var umdFooter = '\n\n  return EsriLeaflet;\n' +
                  '}));';

  var complete = [
    'src/EsriLeaflet.js',
    'src/Util.js',
    'src/Request.js',
    'src/Services/Service.js',
    'src/Services/FeatureLayerService.js',
    'src/Services/MapService.js',
    'src/Services/ImageService.js',
    'src/Tasks/Task.js',
    'src/Tasks/Query.js',
    'src/Tasks/Find.js',
    'src/Tasks/Identify.js',
    'src/Tasks/IdentifyImage.js',
    'src/Tasks/IdentifyFeatures.js',
    'src/Layers/BasemapLayer.js',
    'src/Layers/RasterLayer.js',
    'src/Layers/DynamicMapLayer.js',
    'src/Layers/ImageMapLayer.js',
    'src/Layers/TiledMapLayer.js',
    'src/Layers/FeatureLayer/FeatureGrid.js',
    'src/Layers/FeatureLayer/FeatureManager.js',
    'src/Layers/FeatureLayer/FeatureLayer.js',
    'src/Controls/Logo.js'
  ];

  var core = [
    'src/EsriLeaflet.js',
    'src/Util.js',
    'src/Request.js',
    'src/Tasks/Task.js',
    'src/Services/Service.js'
  ];

  var basemaps = [
    'src/EsriLeaflet.js',
    'src/Request.js',
    'src/Layers/BasemapLayer.js',
    'src/Controls/Logo.js'
  ];

  var mapservice = [
    'src/EsriLeaflet.js',
    'src/Util.js',
    'src/Request.js',
    'src/Services/Service.js',
    'src/Services/MapService.js',
    'src/Tasks/Task.js',
    'src/Tasks/Identify.js',
    'src/Tasks/IdentifyFeatures.js',
    'src/Tasks/Query.js',
    'src/Tasks/Find.js',
    'src/Layers/RasterLayer.js',
    'src/Layers/DynamicMapLayer.js',
    'src/Layers/TiledMapLayer.js'
  ];

  var imageservice = [
    'src/EsriLeaflet.js',
    'src/Util.js',
    'src/Request.js',
    'src/Services/Service.js',
    'src/Services/ImageService.js',
    'src/Tasks/Task.js',
    'src/Tasks/Query.js',
    'src/Tasks/Identify.js',
    'src/Tasks/Identify/IdentifyImage.js',
    'src/Layers/RasterLayer.js',
    'src/Layers/ImageMapLayer.js'
  ];

  var featureservice = [
    'src/EsriLeaflet.js',
    'src/Util.js',
    'src/Request.js',
    'src/Services/Service.js',
    'src/Services/FeatureLayerService.js',
    'src/Tasks/Task.js',
    'src/Tasks/Query.js',
    'src/Layers/FeatureLayer/FeatureGrid.js',
    'src/Layers/FeatureLayer/FeatureManager.js',
    'src/Layers/FeatureLayer/FeatureLayer.js'
  ];

  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '35'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: '30'
    },
    sl_ios_safari: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.9',
      version: '7.1'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: {
        src: [
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
        tasks: ['concat', 'uglify', 'copy:assemble'],
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
          nospawn: true,
          livereload: true
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
        sourceMap: true,
        separator: '\n\n',
        banner: copyright + umdHeader,
        footer: umdFooter,
      },
      complete: {
        src: complete,
        dest: 'dist/esri-leaflet-src.js'
      },
      core: {
        src: core,
        dest: 'dist/builds/core/esri-leaflet-core-src.js'
      },
      basemaps: {
        src: basemaps,
        dest: 'dist/builds/basemaps/esri-leaflet-basemaps-src.js'
      },
      mapservice: {
        src: mapservice,
        dest: 'dist/builds/map-service/esri-leaflet-map-service-src.js'
      },
      imageservice: {
        src: imageservice,
        dest: 'dist/builds/image-service/esri-leaflet-image-service-src.js'
      },
      featureservice: {
        src: featureservice,
        dest: 'dist/builds/feature-layer/esri-leaflet-feature-layer-src.js'
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        wrap: false,
        mangle: {
          except: ['L']
        },
        preserveComments: 'some',
        report: 'gzip',
        banner: copyright + umdHeader,
        footer: umdFooter,
      },
      dist: {
        files: {
          'dist/esri-leaflet.js': complete,
          'dist/builds/core/esri-leaflet-core.js': core,
          'dist/builds/basemaps/esri-leaflet-basemaps.js': basemaps,
          'dist/builds/map-service/esri-leaflet-map-service.js': mapservice,
          'dist/builds/image-service/esri-leaflet-image-service.js': imageservice,
          'dist/builds/feature-layer/esri-leaflet-feature-layer.js': featureservice
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      run: {
        reporters: ['progress'],
        browsers: browsers,
        logLevel: 'ERROR'
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
      },
      sauce: {
        sauceLabs: {
          testName: 'Esri Leaflet Unit Tests'
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['progress', 'saucelabs'],
        singleRun: true
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
          data: ['site/data/*.json', 'package.json'],
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
        repo: 'git@github.com:Esri/esri-leaflet.git'
      },
      src: ['**']
    },

    releaseable: {
      release: {
        options: {
          remote: 'upstream',
          dryRun: grunt.option('dryRun') ? grunt.option('dryRun') : false,
          silent: false
        },
        src: [ 'dist/**/*.js','dist/**/*.map' ]
      }
    }
  });

  // Development Tasks
  grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('build', ['jshint', 'karma:coverage', 'concat', 'uglify']);
  grunt.registerTask('test', ['jshint', 'karma:run']);
  grunt.registerTask('prepublish', ['concat', 'uglify']);
  grunt.registerTask('release', ['releaseable']);
  grunt.registerTask('test:sauce', ['karma:sauce']);

  // Documentation Site Tasks
  grunt.registerTask('docs', ['assemble:dev', 'concat', 'uglify', 'sass', 'copy', 'connect:docs', 'watch']);

  // Documentation Site Tasks
  grunt.registerTask('docs:build', ['assemble:build', 'copy', 'imagemin','sass', 'gh-pages']);

  // Require all grunt modules
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

};
