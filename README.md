# Esri Leaflet

Leaflet plugin for [Esri ArcGIS Online Services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/The_ArcGIS_REST_API/02r300000054000000/). Currently only supports loading Esri [basemaps](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Basemaps/02r3000001mt000000/) and [feature services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_Service/02r3000000z2000000/), as well as [map services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Map_Service/02r3000000w2000000/).

The goal of Esri Leaflet is not to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/), but rather to provide small components to allow developers to build simple lightweight mapping applications. It pairs well with [Terraformer](https://github.com/Esri/Terraformer) for converting data and [geoservices-js](https://github.com/Esri/geoservices-js) for making advanced request to [ArcGIS REST services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/The_ArcGIS_REST_API/02r300000054000000/), for example place finding and reverse geocoding.

**Currently Esri Leaflet is in development but is open to contributions. It should be thought of as a beta or preview.**

### Demos
There are [loads of demos](http://esri.github.io/esri-leaflet/) showing the features of Esri Leaflet as well as how it might integrate with [geoservices-js](https://github.com/Esri/geoservices-js) and [Terraformer](https://github.com/esri/Terraformer) libraries. [Check out the demos.](http://esri.github.io/esri-leaflet/)

### Example
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


## Documentation

### Basemaps

**Extends** `L.TileLayer`

You can quickly access ArcGIS base maps with the `L.esri.BasemapLayer(key, options)` layer. The `key` parameter should be one of the following keys.

* `Streets`
* `Topographic`
* `Oceans`
* `NationalGeographic`
* `Gray`
* `GrayLabels` - Labels to pair with the `Gray` base map
* `Imagery`
* `ImageryLabels` - Labels and political boundaries to pair with the `Imagery` basemap
* `ImageryTransportation` - A street map for pairing with the `Imagery` base map
* `ShadedRelief`
* `ShadedReliefLabels` - Labels for pairing with the `ShadedRelief` base map

The `options` parameter can accept the same [options as](http://leafletjs.com/reference.html#tilelayer) `L.TileLayer`.

```js
var map = L.map('map').setView([37.75,-122.45], 12);
L.esri.basemapLayer("Topographic").addTo(map);
```

### FeatureLayer

**Extends** `L.GeoJSON`

Esri Leaflet has support for FeatureLayers via `L.esri.FeatureLayer(url, options)`. The `url` parameter is the url to the FeatureLayer you should like to display.

```js
var map = L.map('map').setView([45.52963623111275,-122.67389774322508], 12);
L.esri.basemapLayer("Topographic").addTo(map);
L.esri.featureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/');
```

The options parameter can accept anything that `L.GeoJSON` can accept. This means you can apply popups, custom styles and filters. See [Leaflet GeoJSON](http://leafletjs.com/reference.html#geojson) for more information.

### DynamicMapLayer

**Extends** `L.ImageOverlay`

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

**Extends** `L.TileLayer`

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

**Extends** `L.Class`

`L.esri.ClusteredFeatureLayer` provides integration for Feature Layers with the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster). Because of the extra Dependency on Leaflet.markercluster we do not include `L.esri.ClusteredFeatureLayer` in the default build of Esri Leaflet. It lives in /dist/extras/clustered-feature-layer.js. You will also need to include your own copy of the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster).

##### Constructor
Constructor | Description
--- | ---
`new L.esri.ClusteredFeatureLayer(url, options)`<br>`L.esri.clusteredFeatureLayer(url, options)` | `url` should be the URL of the feature layer to consume.

##### Options

Option | Type | Default | Description
--- | --- | --- | ---
`cluster` | `L.MarkerClusterGroup` | new L.MarkerClusterGroup()  | The instance of `L.MarkerClusterGroup` that points will be added to.
`createMarker` | `Function` | `null` | A function that will be called with a `GeoJSON representation of the point its latitude and longitude. Should return a `L.Marker` object.
`onEachMarker` | Function | `null` | This function will be called for every marker before it is added to the cluster. It is called with the GeoJSON representation of the point and the marker 

###### Events
Event | Data | | Description
--- | --- | ---
`loading` | `[FeatureLayerLoading]()` | Fires when new features start loading.
`load` | `[FeatureLayerLoad]()` | Fires when all features in the current bounds of the map have loaded.
`metadata` | `[Metadata]()` | After creating a new `L.esri.ClusteredFeatureLayer` a request for data describing the service will be made and passed to the metadata event.

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
  onEachMarker: function(geojson, marker){}
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

### Events

#### Metadata
The data included in the `metadata` event will vary depending on type of layer you are adding to the map.

* `DymanicMapLayer` and `TiledMapLayer` will return the [JSON Definition of a Map Service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Map_Service/02r3000000w2000000/)
* `FeatureLayer` and `ClusteredFeatureLayer` will return the [JSON Definition of a Feature Layer](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Layer/02r3000000w6000000/)

#### FeatureLayerLoading
Property | Value | Description
--- | --- | ---
`bounds` | [`LatLngBounds`]() | The bounds that features are currently being loaded.

#### FeatureLayerLoad
Property | Value | Description
--- | --- | ---
`bounds` | [`LatLngBounds`]() | The bounds that features where loaded.

### Service URLs

## Development Instructions

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
4. Run `git submodule init` and `git submodule update`
5. Instal the dependancies with `npm install`
5. The examples in the `/examples` folder should work
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

## Requirements


### Dependencies
* [Leaflet](http://leaflet.com) - the core Leaflet library
* [Leaflet.markercluster](http://leaflet.com) - If you want to use `L.esri.ClusteredFeatureLayer` you will need the Leaflet markercluster plugin
* [Terraformer](https://github.com/esri/Terraformer) - base library for other dependencies
* [Terraformer ArcGIS](https://github.com/esri/Terraformer) - for converting geometries
* [Terraformer RTree](https://github.com/esri/Terraformer) - client side RTree index for optimizations

These are currently included in `/vendor` as submodules and are built into the `dist/esri-leaflet.js` file.

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
