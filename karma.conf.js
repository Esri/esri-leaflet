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
      'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css',
      'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js',
      'http://cdn-geoweb.s3.amazonaws.com/Leaflet.heat/0.1.1/leaflet-heat.js',
      'http://cdn-geoweb.s3.amazonaws.com/Leaflet.markercluster/0.4.0/leaflet.markercluster-src.js',
      'spec/**/*Spec.js',
      'src/EsriLeaflet.js',
      'src/Util.js',
      'src/Layers/BasemapLayer.js',
      'src/Layers/TiledMapLayer.js',
      'src/Layers/DynamicMapLayer.js',
      'src/Layers/FeatureLayer/FeatureGrid.js',
      'src/Layers/FeatureLayer/FeatureManager.js',
      'src/Layers/FeatureLayer/FeatureLayer.js',
      'src/Layers/ClusteredFeatureLayer/ClusteredFeatureLayer.js',
      'src/Layers/HeatMapFeatureLayer/HeatMapFeatureLayer.js',
      'src/Request.js',
      'src/Services/Service.js',
      'src/Services/FeatureLayer.js',
      'src/Services/MapService.js',
      'src/Tasks/Query.js',
      'src/Tasks/Identify.js',
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
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      // 'Chrome',
      // 'ChromeCanary',
      // 'Firefox',
      // 'Safari',
      'PhantomJS'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Configure the coverage reporters
    coverageReporter: {
      reporters:[
        {type: 'html', dir:'coverage/'},
        {type: 'text'}
      ],
    }
  });
};
