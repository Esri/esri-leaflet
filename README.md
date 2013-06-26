# Esri Leaflet

Leaflet plugin for [Esri ArcGIS Online Services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/The_ArcGIS_REST_API/02r300000054000000/). Currenly only supports loading Esri [basemaps](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Basemaps/02r3000001mt000000/) and [feature services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_Service/02r3000000z2000000/) as well as [map services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Map_Service/02r3000000w2000000/).

The goal of Esri Leaflet is not to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/), but rather to provide small components to allow developers to build simple lightweight mapping applications. It pairs well with [Terraformer]() for converting data and [geoservices-js](https://github.com/Esri/geoservices-js) for making advanced request to [ArcGIS REST services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/The_ArcGIS_REST_API/02r300000054000000/), for example place finding and reverse geocoding.

**Currently Esri Leaflet is in development but is open to contributions. IT should be thought of a beta or preview.**

There are [loads of demos](http://esri.github.io/esri-leaflet/demo/) showing the features of Esri Leaflet as well as how it might integrate with [geoservices-js](https://github.com/Esri/geoservices-js) and [Terraformer](https://github.com/esri/Terraformer) libraries. [Check out the demos.](http://esri.github.io/esri-leaflet/demo/)

### Basemaps
You can quickly access ArcGIS basemaps with the `L.esri.BasemapLayer(key, options)` layer. The `key` parameter should be one of the following keys.

* Streets
* Topographic
* Oceans
* NationalGeographic
* Gray
* GrayLabels
* Imagery
* ImageryLabels

The `options` parameter can accept the same [options as](http://leafletjs.com/reference.html#tilelayer) `L.TileLayer`.

```js
var map = L.map('map').setView([37.75,-122.45], 12);
L.esri.basemapLayer("Topographic").addTo(map);
```

### FeatureLayer
Esri Leaflet has support for FeatureLayers via `L.esri.FeatureLayer(url, options)`. The `url` parameter is the url to the FeatureLayer you should like to display.

```js
var map = L.map('map').setView([45.52963623111275,-122.67389774322508], 12);
L.esri.basemapLayer("Topographic").addTo(map);
L.esri.featureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/');
```

The options parameter can accept anything that `L.GeoJSON` can accept. This means you can apply popups, custom styles and filters. See [Leaflet GeoJSON](http://leafletjs.com/reference.html#geojson) for more information.

### DynamicMapLayer
If you have a MapService you and use `L.esri.DynamicMapLayer(url, options)` to render it over a map. It takes a `url` to a MapService and options.

```js
var map = L.map('map').setView([ 38.24788726821097,-85.71807861328125], 13 );
L.esri.basemapLayer("Gray").addTo(map);

L.esri.dynamicMapLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyHazardsandRisks/MapServer", {
  opacity : 0.25
}).addTo(map);

L.esri.basemapLayer("GrayLabels").addTo(map);
```

It is possible to show/hide specific layers and set layer definitions within `options` like so...

```js
L.esri.dynamicMapLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer", {
  opacity : 0.5,
  layers:[5,4,3],
  layerDefs: {
    5: "STATE_NAME='Kansas'",
    4: "STATE_NAME='Kansas' and POP2007>25000",
    3: "STATE_NAME='Kansas' and POP2007>25000"
  }
}).addTo(map);
```

### TiledMapLayer
Esri Leaflet can also work with tiled map services as well. You can use `L.esri.TiledMapLayer(url, options)` to use tiled map services. The `url` parameter is the url to the MapServer and options is identical to the [options you can pass](http://leafletjs.com/reference.html#tilelayer) to `L.TileLayer`.

```js
var map = L.map('map').setView([ 37.761487048570935, -122.39112854003905], 12 );

L.esri.basemapLayer("Gray", {
  zIndex:1
}).addTo(map);

L.esri.tiledMapLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Median_Household_Income/MapServer", {
  opacity: 0.25,
  zIndex:2
}).addTo(map);

L.esri.basemapLayer("GrayLabels", {
  zIndex:3
}).addTo(map);
```

### Limitations
* All services that esri leaflet access must be publically accessible. Support for private services will be included in a future release.
* MapServices that you wish to use for `L.esri.TiledMapLayer` must be published in [Web Mercator](http://spatialreference.org/ref/sr-org/6928/).
* MapServices that you wish to use for `L.esri.DynamicMapLayer` must be published in [Web Mercator](http://spatialreference.org/ref/sr-org/6928/).
* FeatureServices must be published in [Web Mercator](http://spatialreference.org/ref/sr-org/6928/) or [Geographic](http://spatialreference.org/ref/epsg/4326/) spatial references

### Dependencies
* [Terraformer](https://github.com/esri/Terraformer) - base library for other dependancies
* [Terraformer ArcGIS](https://github.com/esri/Terraformer) - for converting geometries
* [Terraformer RTree](https://github.com/esri/Terraformer) - client side RTree index for optimizations

These are currently included in `/vendor` as submodules.
