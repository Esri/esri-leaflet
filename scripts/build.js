#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var rollup = require('rollup').rollup;
var minifyer = require('./minify.js');
var pkg = require('../package.json');

var entryFile = 'src/EsriLeaflet.js';

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

  var compressed = minifyer(transpiled.code, JSON.parse(transpiled.map));

  fs.writeFileSync(path.join('dist', pkg.name + '.js'), compressed.code + '\n//# sourceMappingURL=./' + pkg.name + '.js.map');
  fs.writeFileSync(path.join('dist', pkg.name + '.js.map'), compressed.map);
  process.exit(0);
}).catch(function (error) {
  console.log(error);
  process.exit(1);
});
