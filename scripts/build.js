#!/usr/bin/env node

var esperanto = require('esperanto');
var path = require('path');
var minify = require('uglify-js').minify;
var fs = require('fs');
var pkg = require('../package.json');

var copyright = '/*! ' + pkg.name + ' - v' + pkg.version + ' - ' + new Date().toDateString() + '\n' +
                '*   Copyright (c) ' + new Date().getFullYear() + ' Environmental Systems Research Institute, Inc.\n' +
                '*   ' + pkg.license + ' ' +
                '*/\n';

esperanto.bundle({
  entry: path.resolve('src/EsriLeaflet.js'),
  skip: ['leaflet']
}).then(function (bundle) {
  var transpiled = bundle.toUmd({
    strict: true,
    sourceMap: true,
    sourceMapFile: './esri-leaflet-src.js',
    name: 'L.esri'
  });

  var compressed = minify(transpiled.code, {
    fromString: true,
    inSourceMap: JSON.parse(transpiled.map),
    outSourceMap: './esri-leaflet.js.map'
  });

  fs.writeFileSync(path.join('dist', 'esri-leaflet.js'), copyright + compressed.code);
  fs.writeFileSync(path.join('dist', 'esri-leaflet.js.map'), compressed.map);
  process.exit(0);

}).catch(function (error) {
  console.log(error);
  process.exit(1);
});
