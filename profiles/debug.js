import pkg from '../package.json';
import config from './base.js';

config.output.file = pkg.main;

export default config;
