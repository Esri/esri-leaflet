import uglify from 'rollup-plugin-uglify';
import config from './base.js';

config.output.file = 'dist/esri-leaflet.js';
config.output.sourcemap = 'dist/esri-leaflet.js.map';

// use a Regex to preserve copyright text
config.plugins.push(uglify({ output: {comments: /Institute, Inc/} }));

export default config;
