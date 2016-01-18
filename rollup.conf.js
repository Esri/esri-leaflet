import { rollup } from 'rollup';
import uglify from 'rollup-plugin-uglify';
import npm from 'rollup-plugin-npm';

export default {
  entry: 'src/EsriLeaflet.js',
  dest: 'dist/esri-leaflet.js',
  external: ['leaflet'],
  plugins: [
      // npm({
      //   jsnext: true
      // }),
      uglify()
  ],
  globals: {
    'leaflet': 'L'
  },
  format: 'umd',
  external: ['leaflet'],
  moduleName: 'L.esri',
  sourceMap: 'dist/esri-leaflet.js.map'
}