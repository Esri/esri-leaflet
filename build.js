var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var exorcist = require('exorcist');

var libPath = path.join(__dirname, 'dist', 'esri-leaflet-src.js');
var mapPath = path.join(__dirname, 'dist', 'esri-leaflet-src.js.map');

browserify('./src/EsriLeaflet.js', {
  debug: true,
  standalone: 'L.esri'
})
.transform('babelify')
.transform('exposify', { expose: { leaflet: 'L' } })
.bundle()
// .pipe(exorcist(mapPath))
.pipe(process.stdout);
