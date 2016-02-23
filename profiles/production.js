import uglify from 'rollup-plugin-uglify';
import config from './base.js'

config.dest = 'dist/esri-leaflet.js';
config.sourceMap = 'dist/esri-leaflet.js.map';
config.plugins.push(uglify());

export default config;