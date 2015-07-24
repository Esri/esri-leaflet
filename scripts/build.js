#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var rollup = require('rollup').rollup;
var UglifyJS = require('uglify-js');
var pkg = require('../package.json');
var entryFile = 'src/EsriLeaflet.js';

var copyright = '/* ' + pkg.name + ' - v' + pkg.version + ' - ' + new Date().toString() + '\n' +
                ' * Copyright (c) ' + new Date().getFullYear() + ' Environmental Systems Research Institute, Inc.\n' +
                ' * ' + pkg.license + ' */';

rollup({
  entry: path.resolve(entryFile),
  external: ['leaflet']
}).then(function (bundle) {
  var transpiled = bundle.generate({
    format: 'umd',
    sourceMap: true,
    sourceMapFile: pkg.name + '.js',
    moduleName: 'L.esri'
  });

  var sourceMap = UglifyJS.SourceMap({
    file: pkg.name + '.js',
    root: process.cwd(),
    orig: JSON.parse(transpiled.map)
  });

  var stream = UglifyJS.OutputStream({
    preamble: copyright,
    source_map: sourceMap
  });

  UglifyJS.parse(transpiled.code).print(stream);

  var code = stream.toString();
  var map = sourceMap.toString().replace(new RegExp(path.join(process.cwd(), 'src'), 'g'), '../src');

  fs.writeFileSync(path.join('dist', pkg.name + '.js'), code + '\n//# sourceMappingURL=./' + pkg.name + '.js.map');
  fs.writeFileSync(path.join('dist', pkg.name + '.js.map'), map);
  process.exit(0);
}).catch(function (error) {
  console.log(error);
  process.exit(1);
});
