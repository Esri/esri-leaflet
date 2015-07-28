var UglifyJS = require('uglify-js');
var path = require('path');
var pkg = require('../package.json');

var copyright = '/* ' + pkg.name + ' - v' + pkg.version + ' - ' + new Date().toString() + '\n' +
                ' * Copyright (c) ' + new Date().getFullYear() + ' Environmental Systems Research Institute, Inc.\n' +
                ' * ' + pkg.license + ' */';

module.export = function (uncompressedCode, inputSourceMap) {
  var sourceMap = UglifyJS.SourceMap({
    file: pkg.name + '.js',
    root: process.cwd(),
    orig: inputSourceMap
  });

  var stream = UglifyJS.OutputStream({
    preamble: copyright,
    source_map: sourceMap
  });

  UglifyJS.parse(uncompressedCode).print(stream);

  var code = stream.toString();
  var map = sourceMap.toString().replace(new RegExp(path.join(process.cwd(), 'src'), 'g'), '../src');

  return {
    code: code,
    map: map
  };
};
