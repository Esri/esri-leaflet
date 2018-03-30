import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import pkg from '../package.json';

const copyright = `/* @preserve
 * ${pkg.name} - v${pkg.version} - ${new Date().toString()}
 * Copyright (c) ${new Date().getFullYear()} Environmental Systems Research Institute, Inc.
 * ${pkg.license}
 */
`;

export default {
  input: 'src/EsriLeaflet.js',
  external: ['leaflet', 'esri-leaflet'],
  plugins: [
    resolve(),
    json()
  ],
  output: {
    banner: copyright,
    format: 'umd',
    name: 'L.esri',
    sourcemap: true,
    globals: {
      'leaflet': 'L',
      'esri-leaflet': 'L.esri'
    }
  }
};
