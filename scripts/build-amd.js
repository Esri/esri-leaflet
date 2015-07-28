#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var glob = require('glob');
var babel = require('babel');
var async = require('async');
var mkdirp = require('mkdirp');

var minifyer = require('./minify.js');

function handleError (e) {
  console.log(e);
  process.exit(1);
}

function processFile (file, callback) {
  fs.readFile(file, function (error, content) {
    if (error) { return handleError(error); }

    var transpiled = babel.transform(content, {
      whitelist: ['es6.modules'],
      loose: ['es6.modules'],
      modules: 'amd',
      sourceMaps: true
    });

    var compressed = minifyer(transpiled.code, JSON.parse(transpiled.map));

    var codename = file.replace('src' + path.sep, '');
    var codepath = path.join('dist', 'amd', codename);
    var mapname = codename + '.map';
    var mappath = path.join('dist', 'amd', mapname);

    mkdirp.sync(path.dirname(codepath));
    fs.writeFileSync(codepath, compressed.code + '\n//# sourceMappingURL=./' + path.basename(mapname));
    fs.writeFileSync(mappath, compressed.map);

    callback(null);
  });
}

glob('src/**/*.js', function (error, files) {
  if (error) { return handleError(error); }

  async.each(files, processFile, function (error) {
    if (error) { return handleError(error); }

    process.exit(0);
  });
});
