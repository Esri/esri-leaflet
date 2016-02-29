import uglify from 'rollup-plugin-uglify';
import config from './base.js'

config.dest = 'dist/esri-leaflet-debug.js';
config.sourceMap = 'inline';

export default config;