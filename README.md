# Esri Leaflet

Leaflet plugin for [ArcGIS Services](http://developers.arcgis.com). Currently Esri Leaflet supports loading Esri [basemaps](#basemaplayer) and [feature services](#featurelayer), as well as [tiled](#tiledmaplayer) and [dynamic](#dynamicmaplayer) map services.

The goal of Esri Leaflet is **not** to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/), but rather to provide small components to allow developers to build mapping applications with Leaflet.

**Currently Esri Leaflet is in development and should be thought of as a beta or preview.**

### Demos
There are [loads of demos](http://esri.github.io/esri-leaflet/) showing the features of Esri Leaflet, as well as how it might integrate with [geoservices-js](https://github.com/Esri/geoservices-js) and [Terraformer](https://github.com/esri/Terraformer) libraries. [Check out the demos.](http://esri.github.io/esri-leaflet/)

### Example
Here is a quick example to get you started. Just change the paths to point to the proper libraries and go.

![App](https://raw.github.com/Esri/esri-leaflet/master/esri-leaflet.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Esri Leaflet Demo</title>
    <link rel="stylesheet" href="/the/path/to/leaflet.css">
    <!--[if lte IE 8]><link rel="stylesheet" href="/the/path/to/leaflet.ie.css"><![endif]-->
    <style>
      html, body,  #map {
        width : 100%;
        height : 100%;
      }
    </style>
    <script src="/the/path/to/leaflet.js"></script>
    <script src="/the/path/to/esri-leaflet.js"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var template = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>"

      var map = L.map('map').setView([45.528, -122.680], 13);
      
      L.esri.basemapLayer("Gray").addTo(map);

      L.esri.featureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Parks_pdx/FeatureServer/0", {
       style: function (feature) {
          return { color: "#70ca49", weight: 2 };
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(L.Util.template(template, feature.properties));
        }
      }).addTo(map);
    </script>
  </body>
</html>
```

## Documentation

### BasemapLayer

**Extends** [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer)

#### Constructor

Constructor | Description
--- | ---
`new L.esri.BasemapLayer(key, options)`<br>`L.esri.BasemapLayer(key, options)` | `key` type of base map you want to add. The `options` parameter can accept the same [options](http://leafletjs.com/reference.html#tilelayer) as `L.TileLayer`.

**Valid Keys**

* `Streets`
* `Topographic`
* `Oceans`
* `NationalGeographic`
* `Gray`
* `GrayLabels` - Labels to pair with the `Gray` base map
* `DarkGray`
* `DarkGrayLabels` - Labels to pair with the `DarkGray` base map
* `Imagery`
* `ImageryLabels` - Labels and political boundaries to pair with the `Imagery` basemap
* `ImageryTransportation` - A street map for pairing with the `Imagery` base map
* `ShadedRelief`
* `ShadedReliefLabels` - Labels for pairing with the `ShadedRelief` base map

#### Methods

`L.esri.BasemapLayer` inherits all methods from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer).

#### Events

`L.esri.BasemapLayer`inherits all events from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer).

Event | Data | Description
--- | --- | ---
`metadata` | [`Metadata`](#metadata-event) | After creating a new `L.esri.ClusteredFeatureLayer` a request for data describing the service will be made and passed to the metadata event.

#### Example

```js
var map = L.map('map').setView([37.75,-122.45], 12);

L.esri.basemapLayer("Topographic").addTo(map);
```

### FeatureLayer

**Extends** [`L.GeoJSON`](http://leafletjs.com/reference.html#geojson)

#### Constructor

Constructor | Description
--- | ---
`new L.esri.FeatureLayer(url, options)`<br>`L.esri.FeatureLayer(url, options)` | The `url` parameter is the url to the FeatureLayer you should like to display. See [service URLs](#service-urls) for more information on how to find these urls.

#### Options

`L.esri.FeatureLayer` also accepts all the options you can pass to [`L.GeoJSON`](http://leafletjs.com/reference.html#geojson).

Option | Type | Default | Description
--- | --- | --- | ---
`where` | `String` | `"1=1"` | A server side expression that will be evaluated to filter features. By default this will include all features in a service.
`fields` | `Array` | `["*"]` | An array of metadata names to pull from the service. Includes all fields by default.
`token` | `String` | `null` | If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.

#### Events

`L.esri.FeatureLayer` also fires all the same events as [`L.GeoJSON`](http://leafletjs.com/reference.html#geojson) in addition to these events.

Event | Data | Description
--- | --- | ---
`loading` | [`Loading`](#loading-event) | Fires when new features start loading.
`load` | [`Load`](#load-event) | Fires when all features in the current bounds of the map have loaded.
`metadata` | [`Metadata`](#metadata-event) | After creating a new `L.esri.ClusteredFeatureLayer` a request for data describing the service will be made and passed to the metadata event.
`authenticationrequired` | [`Authentication`](#authentication-event) | This will be fired when a request to a service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information.

#### Example

```js
var map = L.map('map').setView([45.53,-122.64], 16);

L.esri.basemapLayer("Streets").addTo(map);

L.esri.featureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/').addTo(map);
```

The options parameter can accept anything that `L.GeoJSON` can accept. This means you can apply popups, custom styles and filters. See [Leaflet GeoJSON](http://leafletjs.com/reference.html#geojson) for more information.

### DynamicMapLayer

**Extends** `L.ImageOverlay`

If you have a MapService you and use `L.esri.DynamicMapLayer(url, options)` to render it on a map

#### Constructor
Constructor | Description
--- | ---
`new L.esri.DynamicMapLayer(url, options)`<br>`L.esri.DynamicMapLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

#### Options

`L.esri.DynamicMapLayer` also accepts all the options you can pass to [`L.ImageOverlay`](http://leafletjs.com/reference.html#imageoverlay).

Option | Type | Default | Description
--- | --- | --- | ---
`format` | `String` | `'png24'` | Output format of the image.
`transparent` | `Boolean` | `true` | Allow the server to produce transparent images.
`f` | `String` | `'image'` | Output type
`bboxSR` | `Integer` | `4326` | Spatial reference of the bounding box to generate the image with. If you don't know what this is don't change it.
`imageSR` | | `3857` | Spatial reference of the output image. If you don't know what this is don't change it.
`layers` | `String` or `Array` | `''` | An array of Layer IDs like `[3,4,5]` to show from the service or a string in the format like `[show | hide | include | exclude]:layerId1,layerId2` like `exclude:3,5`.
`layerDefs` | `String` `Object` | `''` | A string representing a query to run against the service before the image is rendered. This can be a string like `"STATE_NAME='Kansas' and POP2007>25000"` or an object mapping different queries to specific layers `{5:"STATE_NAME='Kansas'", 4:"STATE_NAME='Kansas'}`.
`opacity` | `Integer` | `1` | Opacity of the layer. Should be a value between 0 and 1.
`position` | `String` | '"front"` | position of the layer relative to other overlays
`token` | `String` | `null` | If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.

#### Methods

Method | Returns |  Description
--- | --- | ---
`identify(latlng, [options](#identify-options), callback)` | `null` | Used to identify what features exist in a particular location on a `L.esri.DynamicMapLayer`. The first parameter is a [`L.LatLng`](http://leafletjs.com/reference.html#latlng) object. the second if an object setting various options, and finally a callback that will be called with `error` and `response`.
 
#### Events

`L.esri.DynamicMapLayer` also fires all the same events as [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) in addition to these events.

Event | Data | Description
--- | --- | ---
`metadata` | [`Metadata`](#metadata-event) | After creating a new `L.esri.DynamicMapLayer` a request for data describing the service will be made and passed to the metadata event.
`authenticationrequired` | [`Authentication`](#authentication-event) | This will be fired when a request to a service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information.

##### Example

```js
var map = L.map('map').setView([ 38.24788726821097,-85.71807861328125], 13 );

L.esri.dynamicMapLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyHazardsandRisks/MapServer", {
  opacity : 0.25
}).addTo(map);
```

### TiledMapLayer

**Extends** `L.TileLayer`

Esri Leaflet can work with tiled map services as well. You can use `L.esri.TiledMapLayer(url, options)` to use tiled map services. The `url` parameter is the url to the MapServer and options are identical to the [options you can pass](http://leafletjs.com/reference.html#tilelayer) to `L.TileLayer`.

**Your map service must be published using the Web Mercator Auxiliary Sphere tiling scheme (WKID 102100/3857) used by Google Maps, Bing Maps and [ArcGIS Online](http://resources.arcgis.com/en/help/arcgisonline-content/index.html#//011q00000002000000). Esri Leaflet will not support any other spatial reference for tile layers.**

#### Constructor

Constructor | Description
--- | ---
`new L.esri.TiledMapLayer(url, options)`<br>`L.esri.TiledMapLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

#### Options

`L.esri.TiledMapLayer` also accepts all the options you can pass to [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer-options).

#### Events

`L.esri.TiledMapLayer` also fires all the same events as [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) in addition to these events.

Event | Data | Description
--- | --- | ---
`metadata` | [`Metadata`](#metadata-event) | After creating a new `L.esri.TiledMapLayer` a request for data describing the service will be made and passed to the metadata event.

#### Example

```js
var map = L.map('map').setView([37.761487048570935, -122.39112854003905], 12);

L.esri.tiledMapLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Median_Household_Income/MapServer", {
  opacity: 0.25,
  zIndex:2
}).addTo(map);
```

### ClusteredFeatureLayer

**Extends** `L.Class`

`L.esri.ClusteredFeatureLayer` provides integration for Feature Layers with the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster). Because of the extra Dependency on Leaflet.markercluster we do not include `L.esri.ClusteredFeatureLayer` in the default build of Esri Leaflet. It lives in /dist/extras/clustered-feature-layer.js. You will also need to include your own copy of the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster).

#### Constructor

Constructor | Description
--- | ---
`new L.esri.ClusteredFeatureLayer(url, options)`<br>`L.esri.clusteredFeatureLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
`cluster` | `L.MarkerClusterGroup` | `new L.MarkerClusterGroup()`  | The instance of `L.MarkerClusterGroup` that points will be added to.
`createMarker` | `Function` | `null` | A function that will be called with a  GeoJSON representation of the point its latitude and longitude. Should return a `L.Marker` object.
`onEachMarker` | Function | `null` | This function will be called for every marker before it is added to the cluster. It is called with the GeoJSON representation of the point and the marker 
`where` | `String` | `"1=1"` | A server side expression that will be evaluated to filter features. By default this will include all features in a service.
`fields` | `Array` | `["*"]` | An array of metadata names to pull from the service. Includes all fields by default.
`token` | `String` | `null` | If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.

#### Events

Event | Data | Description
--- | --- | ---
`loading` | [`Loading`](#loading-event) | Fires when new features start loading.
`load` | [`Load`](#load-event) | Fires when all features in the current bounds of the map have loaded.
`metadata` | [`Metadata`](#metadata-event) | After creating a new `L.esri.ClusteredFeatureLayer` a request for data describing the service will be made and passed to the metadata event.
`authenticationrequired` | [`Authentication`](#authentication-event) | This will be fired when a request to a service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information.

#### Example

```js
L.esri.clusteredFeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0", {
  cluster: new L.MarkerClusterGroup({
    disableClusteringAtZoom: 16,
    polygonOptions: {
      color: "#2d84c8"
    },
    iconCreateFunction: function(cluster) {
      var count = cluster.getChildCount();
      var digits = (count+"").length;
      return new L.DivIcon({
        html: count,
        iconSize: null
      });
    }
  }),
  createMarker: function (geojson, latlng) {
    return L.marker(latlng, {
      icon: icons[geojson.properties.direction.toLowerCase()]
    });
  },
  onEachMarker: function(geojson, marker) {
    marker.bindPopup("<h3>"+geojson.properties.stop_name+"</h3><p>Stop ID: "+geojson.properties.stop_id+"</p><p>"+geojson.properties.stop_desc+"</p>")
  }
}).addTo(map);
```

### HeatMapFeatureLayer

**Extends** `L.Class`

`L.esri.HeatMapFeatureLayer` provides integration for Feature Layers with the [Leaflet.heat plugin](https://github.com/Leaflet/Leaflet.heat). Because of the extra Dependency on Leaflet.heat we do not include `L.esri.HeatMapFeatureLayer` in the default build of Esri Leaflet. It lives in /dist/extras/heatmap-feature-layer.js. You will also need to include your own copy of the [Leaflet.heat plugin](https://github.com/Leaflet/Leaflet.heat).

#### Constructor

Constructor | Description
--- | ---
`new L.esri.HeatMapFeatureLayer(url, options)`<br>`L.esri.heatMapFeatureLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

#### Options

`HeatMapFeatureLayer` will also accept any options that can be passed to [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat#lheatlayerlatlngs-options) to customize the appearance of the heatmap.

Option | Type | Default | Description
--- | --- | --- | ---
`where` | `String` | `"1=1"` | A server side expression that will be evaluated to filter features. By default this will include all features in a service.
`fields` | `Array` | `["*"]` | An array of metadata names to pull from the service. Includes all fields by default.
`token` | `String` | `null` | If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.

#### Events

Event | Data | Description
--- | --- | ---
`loading` | [`Loading`](#loading-event) | Fires when new features start loading.
`load` | [`Load`](#load-event) | Fires when all features in the current bounds of the map have loaded.
`metadata` | [`Metadata`](#metadata-event) | After creating a new `L.esri.ClusteredFeatureLayer` a request for data describing the service will be made and passed to the metadata event.
`authenticationrequired` | [`Authentication`](#authentication-event) | This will be fired when a request to a service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information.

#### Example

```js
var heat = new L.esri.HeatMapFeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Graffiti_Locations3/FeatureServer/0", {
  radius: 12,
  gradient: {
    0.4: "#ffeda0",
    0.65: "#feb24c",
    1: "#f03b20"
  }
}).addTo(map);
```

### Event Objects

#### Metadata Event

The data included in the `metadata` event will vary depending on type of layer you are adding to the map.

Data | Value | Description
--- | --- | ---
`bounds` | [`LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds) | The bounds that features are currently being loaded.
`metadata` | `Object` | The JSON metadata for the service. See below.

* `DynamicMapLayer` and `TiledMapLayer` will return the [JSON Definition of a Map Service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Map_Service/02r3000000w2000000/)
* `FeatureLayer`, `ClusteredFeatureLayer` and `HeatMapFeatureLayer` will return the [JSON Definition of a Feature Layer](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Layer/02r3000000w6000000/)

**Note**: the bounds property will be `false` if the service in a spatial reference other then 4326, 3857 or 102100.

#### Loading Event

Data | Value | Description
--- | --- | ---
`bounds` | [`LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds) | The bounds that features are currently being loaded.

#### Load Event

Data | Value | Description
--- | --- | ---
`bounds` | [`LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds) | The bounds that features where loaded.


**NOTE**: The `load` event will not fire if you add the layer to the map before adding the event listener. You must add the listener first and then add the layer to the map as follows.

```js
var layer = new L.esri.FeatureLayer(url, options);

layer.on('load', function(e){
  // do something on load
});

layer.addTo(map);
```

#### Authentication Event

Data | Value | Description
--- | --- | ---
`retry` | `Function` | Pass an access token to this method to retry the failed request and update the `token` parameter for the layer. See [working with authenticated services](#working-with-authenticated-services) for more information.

### Options Objects

#### Identify Options

Option | Type | Default | Description
--- | --- | --- | ---
`layers` | `String` or `Array` | `''` | An array of Layer IDs like `[3,4,5]` to show from the service or a string in the format like `[show | hide | include | exclude]:layerId1,layerId2` like `exclude:3,5`.
`layerDefs` | `String` `Object` | `''` | A string representing a query to run against the service before the identify query is run. This can be a string like `"STATE_NAME='Kansas' and POP2007>25000"` or an object mapping different queries to specific layers `{5:"STATE_NAME='Kansas'", 4:"STATE_NAME='Kansas'}`.
`tolerance` | `Integer` | 5 | The pixel tolerance with which to buffer features for identifying.
`imageDisplay` | `String` | `{{mapWidth}},{{mapHeight}},96` |

### Service URLs

Coming Soon!

### Working With Authenticated Services

Esri Leaflet supports access private services on ArcGIS Online and ArcGIS Server services that require authentication.

Handing authentication in Esri Leaflet is flexible and lightweight but makes serveral assumptions.

1. You (the developer) will handle obtaining and persisting tokens.
2. Esri Leaflet will use your tokens to access services.
3. Esri Leaflet will notify you when it recives an error while using your token and prompt you for a new one.

An example of authenticating with a username/password to an ArcGIS Service instance can be found [here](http://esri.github.io/esri-leaflet/privatemapservice.html).

An example of using Oauth 2 to access a private feature service on ArcGIS Online can be found [here](http://esri.github.io/esri-leaflet/privatefeaturelayer.html).

## Development Instructions

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
5. Install the dependancies with `npm install`
5. The examples in the `/examples` folder should work
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Dependencies
* [Leaflet](http://leaflet.com) - the core Leaflet library
* [Leaflet.markercluster](http://leaflet.com) - If you want to use `L.esri.ClusteredFeatureLayer` you will need the Leaflet markercluster plugin

## Resources

* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
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
