import pkg from '../package.json';
import config from './base.js';

config.output.file = pkg.module;
config.output.format = 'es';

export default config;
