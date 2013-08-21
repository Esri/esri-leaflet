# Esri Leaflet

Leaflet plugin for [Esri ArcGIS Online Services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/The_ArcGIS_REST_API/02r300000054000000/). Currently only supports loading Esri [basemaps](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Basemaps/02r3000001mt000000/) and [feature services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_Service/02r3000000z2000000/), as well as [map services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Map_Service/02r3000000w2000000/).

The goal of Esri Leaflet is not to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/), but rather to provide small components to allow developers to build simple lightweight mapping applications. It pairs well with [Terraformer](https://github.com/Esri/Terraformer) for converting data and [geoservices-js](https://github.com/Esri/geoservices-js) for making advanced request to [ArcGIS REST services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/The_ArcGIS_REST_API/02r300000054000000/), for example place finding and reverse geocoding.

**Currently Esri Leaflet is in development but is open to contributions. It should be thought of as a beta or preview.**

### Demos
There are [loads of demos](http://esri.github.io/esri-leaflet/) showing the features of Esri Leaflet as well as how it might integrate with [geoservices-js](https://github.com/Esri/geoservices-js) and [Terraformer](https://github.com/esri/Terraformer) libraries. [Check out the demos.](http://esri.github.io/esri-leaflet/)

### Quick Example
Here is a quick example to get you started. Just change the paths to point to the proper libraries and go.

![App](https://raw.github.com/Esri/esri-leaflet/master/esri-leaflet.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Esri Leaflet</title>
    <link rel="stylesheet" href="/the/path/to/leaflet.css" />
    <style>
      html, body,  #map {
        width : 100%;
        height : 100%;
      }
    </style>
    <script src="/the/path/to.leaflet.js"></script>
    <script src="/the/path/to/esri-leaflet.min.js"></script>
    <!--[if lte IE 8]><link rel="stylesheet" href="/the/path/to/leaflet.ie.css" /><![endif]-->
    <script src="/the/path/to.leaflet.js"></script>
    <script src="/the/path/to/esri-leaflet.js"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map');
      
      // ArcGIS Online Basemaps - Streets, Topographic, Gray, GrayLabels, Oceans, NationalGeographic, Imagery, ImageryLabels
      L.esri.basemapLayer("Streets").addTo(map);

      function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(map);
      }

      function onLocationError(e) {
        alert(e.message);
      }

      map.on('locationfound', onLocationFound);
      map.on('locationerror', onLocationError);

      map.locate({setView: true, maxZoom: 16});
    </script>
  </body>
</html>
```

## Features

### Basemaps

You can quickly access ArcGIS base maps with the `L.esri.BasemapLayer(key, options)` layer. The `key` parameter should be one of the following keys.

* `Streets`
* `Topographic`
* `Oceans`
* `NationalGeographic`
* `Gray`
* `GrayLabels`
* `Imagery`
* `ImageryLabels`

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

You can identify features from MapService using `L.esri.DynamicMapLayer.identify(latLng, options, callback)`.

```js
dynLayer.identify(e.latlng, {
  sr: '4265', //default is '4326'
  tolerance: 5, //default is 3
  imageDisplay: '801,601,97', // default is '800,600,96' (height by width in pixels and DPI)
} , callback)

```
Take a look at [this](http://esri.github.io/esri-leaflet/dynamicmapservice.html) sample for a demonstration.

### TiledMapLayer

Esri Leaflet can work with tiled map services as well. You can use `L.esri.TiledMapLayer(url, options)` to use tiled map services. The `url` parameter is the url to the MapServer and options is identical to the [options you can pass](http://leafletjs.com/reference.html#tilelayer) to `L.TileLayer`.

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

### ClusteredFeatureLayer

`L.esri.ClusteredFeatureLayer` provides integration for Feature Layers with the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster). Because of the extra Dependency on Leaflet.markercluster we do not include `L.esri.ClusteredFeatureLayer` in the default build of Esri Leaflet. It lives in /dist/extras/clustered-feature-layer.js. You will also need to include your own copy of the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster).

##### Usage

```js
L.esri.clusteredFeatureLayer(featureLayerUrl, {

  // this should be an instance of L.MarkerClusterGroup
  // https://github.com/Leaflet/Leaflet.markercluster#usage
  cluster: new L.MarkerClusterGroup(),

  // this function should return a new L.Marker
  // that will be added to the cluster.
  createMarker: function(geojson, latlng){},

  // this optional function will be run against 
  // every marker before it is added to the cluster
  // this is a great place to define custom popups
  // or other behaviors.
  onEachMarker: function(geojson, marker){

  }
}).addTo(map);
```

#### Example

```js
L.esri.clusteredFeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0", {
  cluster: new L.MarkerClusterGroup({
    spiderfyOnMaxZoom:false,
    disableClusteringAtZoom: 16,
    polygonOptions: {
      color: "#2d84c8",
      weight: 4,
      opacity: 1,
      fillOpacity: 0.5
    },
    iconCreateFunction: function(cluster) {
      var count = cluster.getChildCount();
      var digits = (count+"").length;
      return new L.DivIcon({
        html: count,
        className:"cluster digits-"+digits,
        iconSize: null
      });
    }
  }),
  marker: function (geojson, latlng) {
    return L.marker(latlng, {
      icon: icons[geojson.properties.direction.toLowerCase()]
    });
  },
  eachMarker: function(geojson, marker) {
    marker.bindPopup("<h3>"+geojson.properties.stop_name+"</h3><p>Stop ID: "+geojson.properties.stop_id+"</p><p>"+geojson.properties.stop_desc+"</p>")
  }
}).addTo(map);
```

## Development Instructions

1. `git clone https://github.com/Esri/esri-leaflet`
2. `cd esri-leaflet`
3. `git submodule init`
4. `git submodule update`

## Requirements

* All services that Esri Leaflet accesses must be publicly available. Support for private services will be included in a future release.
* MapServices that you wish to use for `L.esri.TiledMapLayer` must be published in [Web Mercator](http://spatialreference.org/ref/sr-org/6928/).

### Dependencies

* [Terraformer](https://github.com/esri/Terraformer) - base library for other dependencies
* [Terraformer ArcGIS](https://github.com/esri/Terraformer) - for converting geometries
* [Terraformer RTree](https://github.com/esri/Terraformer) - client side RTree index for optimizations

These are currently included in `/vendor` as submodules and are built into the `dist/esri-leaflet.js` file.

### Custom Builds

It is possible to build a custom version of Esri Leaflet by customizing the Gruntfile. To do this add a new entry to the `concat` and the `uglify` configurations. More detailed directions will be added here later.

## Resources

* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Credit

Dymanic Map Layer code is based on code from https://github.com/sanborn/leaflet-ags/blob/master/src/AGS.Layer.Dynamic.js

## Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/esri-leaflet/master/license.txt) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet)
[](Esri Language: JavaScript)
