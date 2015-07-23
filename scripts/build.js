#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var rollup = require('rollup').rollup;
var UglifyJS = require('uglify-js');
var pkg = require('../package.json');

var copyright = '/* ' + pkg.name + ' - v' + pkg.version + ' - ' + new Date().toString() + '\n' +
                ' * Copyright (c) ' + new Date().getFullYear() + ' Environmental Systems Research Institute, Inc.\n' +
                ' * ' + pkg.license + ' */';

rollup({
  entry: path.resolve('src/EsriLeaflet.js'),
  external: ['leaflet']
}).then(function (bundle) {
  var transpiled = bundle.generate({
    format: 'umd',
    sourceMap: true,
    sourceMapFile: 'esri-leaflet.js',
    moduleName: 'L.esri'
  });

  var source_map = UglifyJS.SourceMap({
    file: 'esri-leaflet.js',
    root: process.cwd(),
    orig: JSON.parse(transpiled.map)
  });

  var stream = UglifyJS.OutputStream({
    preamble: copyright,
    source_map: source_map
  });

  UglifyJS.parse(transpiled.code).print(stream);

  var code = stream.toString();
  var map = source_map.toString().replace(new RegExp(path.join(process.cwd(), 'src'), 'g'), '../src');

  fs.writeFileSync(path.join('dist', 'esri-leaflet.js'), code + '\n//# sourceMappingURL=./esri-leaflet.js.map');
  fs.writeFileSync(path.join('dist', 'esri-leaflet.js.map'), map);
  process.exit(0);
}).catch(function (error) {
  console.log(error);
  process.exit(1);
});
