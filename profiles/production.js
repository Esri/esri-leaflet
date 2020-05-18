import uglify from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';
import config from './base.js';

config.output.file = 'dist/esri-leaflet.js';

// use a Regex to preserve copyright text
config.plugins.push(uglify({ output: {comments: /Institute, Inc/} }));
// transform with babel
config.plugins.push(babel({ babelHelpers: 'bundled' }));

export default config;
