import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

var pkg = require('../package.json');
var copyright = '/* ' + pkg.name + ' - v' + pkg.version + ' - ' + new Date().toString() + '\n' +
                ' * Copyright (c) ' + new Date().getFullYear() + ' Environmental Systems Research Institute, Inc.\n' +
                ' * ' + pkg.license + ' */';

export default {
  input: 'src/EsriLeaflet.js',

  external: ['leaflet', 'esri-leaflet'],
  plugins: [
    nodeResolve({
      jsnext: true,
      main: false,
      browser: false,
      extensions: ['.js', '.json']
    }),
    json()
  ],

  output: {
    banner: copyright,
    format: 'umd',
    name: 'L.esri',
    globals: {
      leaflet: 'L',
      'esri-leaflet': 'L.esri',
      '@terraformer/arcgis': 'Terraformer'
    },
    sourcemap: true
  }
};
