#!/usr/bin/env node

var rollup = require('rollup');
var path = require('path');

var argv = require('yargs')
  .usage('Usage: $0 <input> [options]')
  .example('$0 custom-profile.js -o esri-leaflet.js --sourcemap esri-leaflet.map.js', 'build with a sourcemap')
  .default('format', 'umd')
  .default('id', 'esri-leaflet')
  .alias('i', 'id')
  .alias('m', 'sourcemap')
  .alias('o', 'output')
  .alias('f', 'format')
  .help('h')
  .help('help')
  .argv;

rollup.rollup({
	entry: path.join(process.cwd(), argv._[0]),
	external: ['leaflet']
}).then( function (bundle) {
	var generateOptions = {
		dest: argv.output,
		format: argv.format || 'umd',
		moduleId: argv.id || "esri-leaflet",
		moduleName: 'L.esri',
		sourceMap: argv.sourcemap
	};

	if (argv.output) {
		return bundle.write(generateOptions);
	}

	if (argv.sourcemap && argv.sourcemap !== 'inline') {
    process.stdout.write('named sourcemaps require the output argv')
		process.exit(1);
	}

	var result = bundle.generate(generateOptions);

	var code = result.code;

	if (argv.sourcemap === 'inline') {
		code += '\n//# sourceMappingURL=' + map.toUrl();
	}

	process.stdout.write(code);
}).catch(function(error){
  console.log(error);
});
