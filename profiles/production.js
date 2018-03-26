import config from './base.js';
import uglify from 'rollup-plugin-uglify';

config.output.file = 'dist/esri-leaflet.js';
config.plugins.push(uglify());

export default config;
