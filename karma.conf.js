// Karma configuration
// Generated on Fri May 30 2014 15:44:45 GMT-0400 (EDT)

module.exports = function (config) {
  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-sinon'],

    // list of files / patterns to load in the browser
    // not sure why tests are failing when files are loaded in bulk
    files: [
      'node_modules/leaflet/dist/leaflet.css',
      'node_modules/leaflet/dist/leaflet-src.js',
      'dist/esri-leaflet-debug.js',
      // these two are the tempermental ones
      'spec/Layers/ImageMapLayerSpec.js',
      'spec/Layers/DynamicMapLayerSpec.js',
      'spec/Layers/BasemapLayerSpec.js',
      'spec/Layers/TiledMapLayerSpec.js',
      'spec/Layers/RasterLayerSpec.js',
      'spec/Layers/FeatureLayer/*Spec.js',
      // 'spec/Layers/*Spec.js',
      'spec/Tasks/*Spec.js',
      'spec/Services/*Spec.js',
      'spec/*Spec.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'dist/**/*.js': ['sourcemap', 'coverage']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome'
      // 'ChromeCanary',
      // 'Firefox',
      // 'Safari',
      // 'PhantomJS'
    ],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Configure the coverage reporters
    coverageReporter: {
      instrumenters: {
        isparta: require('isparta')
      },
      instrumenter: {
        'src/**/*.js': 'isparta'
      },
      reporters: [
        {
          type: 'html',
          dir: 'coverage/'
        }, {
          type: 'text'
        }
      ]
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
