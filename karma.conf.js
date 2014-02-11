// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],

    basePath: './',

    files: [
      'node_modules/expect.js/expect.js',
      'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js',
      'src/EsriLeaflet.js',
      'src/Util.js',
      'src/RBush.js',
      'src/Layers/*.js',
      'spec/**/*.js'
    ],

    reporters: [
      'progress',
      'coverage'
    ],

    exclude: [
      'karma.conf.js'
    ],

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    singleRun: true,
    autoWatch: false
  });
};