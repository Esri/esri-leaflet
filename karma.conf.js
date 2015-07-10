// Karma configuration
// Generated on Fri May 30 2014 15:44:45 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-sinon'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/leaflet/dist/leaflet.css',
      'node_modules/leaflet/dist/leaflet-src.js',
      'src/EsriLeaflet.js',
      'src/Util.js',
      'src/Layers/BasemapLayer.js',
      'src/Layers/RasterLayer.js',
      'src/Layers/TiledMapLayer.js',
      'src/Layers/DynamicMapLayer.js',
      'src/Layers/ImageMapLayer.js',
      'src/Layers/FeatureLayer/FeatureGrid.js',
      'src/Layers/FeatureLayer/FeatureManager.js',
      'src/Layers/FeatureLayer/FeatureLayer.js',
      'src/Request.js',
      'src/Services/Service.js',
      'src/Services/FeatureLayerService.js',
      'src/Services/MapService.js',
      'src/Services/ImageService.js',
      'src/Tasks/Task.js',
      'src/Tasks/Query.js',
      'src/Tasks/Identify.js',
      'src/Tasks/IdentifyFeatures.js',
      'src/Tasks/IdentifyImage.js',
      'src/Tasks/Find.js',
      'src/Controls/Logo.js',
      'spec/**/*Spec.js'
      // 'spec/UtilSpec.js',
      // 'spec/RequestSpec.js',
      // 'spec/Tasks/*Spec.js',
      // 'spec/Services/*Spec.js',
      // 'spec/Layers/**/*Spec.js',

      // 'spec/Layers/ImageMapLayerSpec.js',
      // 'spec/**/QuerySpec.js',
      // 'spec/**/FeatureManagerSpec.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome',
      // 'ChromeCanary',
      // 'Firefox',
      // 'Safari',
      // 'PhantomJS'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Configure the coverage reporters
    coverageReporter: {
      reporters:[
        {type: 'html', dir:'coverage/'},
        {type: 'text'}
      ]
    }
  });
};
