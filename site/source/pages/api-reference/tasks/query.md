---
title: L.esri.Tasks.Query
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Tasks.Query` is an abstraction for the query API included in Feature Layers and Image Services. It provides a chainable API for building request parameters and executing queries.

**Note** Depending on the type of service you are querying (Feature Layer, Map Service, Image Service) and the version of ArcGIS Server that hosts the service some of these options may not be available.

### Constructor

<table>
    <thead>
        <tr>
            <th>Constructor</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
            <code>L.esri.Tasks.query({{{param 'Object' 'options'}}})</code><br><br>
            <code>L.esri.Tasks.query({{{param 'FeatureLayer' 'endpoint' '../../api-reference/services/feature-layer.html'}}})</code><br><br>
            <code>L.esri.Tasks.query({{{param 'MapService' 'endpoint' '../../api-reference/services/map-service.html'}}})</code><br><br>
            <code>L.esri.Tasks.query({{{param 'ImageService' 'endpoint' '../../api-reference/services/image-service.html'}}})</code>
            </td>
            <td>Accepts either an `options` object or an instance of <a href="{{assets}}/api-reference/services/map-service.html">MapService</a>, <a href="{{assets}}/api-reference/services/feature-layer-service.html">FeatureLayer</a> or <a href="{{assets}}/api-reference/service/image-service.html">ImageService</a>.</td>
        </tr>
    </tbody>
</table>

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `String` | `''` | URL of the ArcGIS Server or ArcGIS Online service you would like to consume. |
| `proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxy](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resource Proxy](https://github.com/Esri/resource-proxy) to use for proxying POST requests. |
| `useCors` | `Boolean` | `true` | If this task should use CORS when making GET requests. |

### Methods

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Returns</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>within({{{param 'Geometry' 'geometry'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features from the service within (fully contained by) the passed geometry object. `geometry` can be an instance of `L.Marker`, `L.Polygon`, `L.Polyline`, `L.LatLng`, `L.LatLngBounds` and `L.GeoJSON`. It can also accept valid GeoJSON Point, Polyline, Polygon objects and GeoJSON Feature objects containing Point, Polyline, Polygon.</td>
        </tr>
        <tr>
            <td><code>contains({{{param 'Geometry' 'geometry'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features from the service that fully contain the passed geometry object. `geometry` can be an instance of `L.Marker`, `L.Polygon`, `L.Polyline`, `L.LatLng`, `L.LatLngBounds` and `L.GeoJSON`. It can also accept valid GeoJSON Point, Polyline, Polygon objects and GeoJSON Feature objects containing Point, Polyline, Polygon.</td>
        </tr>
        <tr>
            <td><code>intersects({{{param 'Geometry' 'geometry'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features from the service that intersect (touch anywhere) the passed geometry object. `geometry` can be an instance of `L.Marker`, `L.Polygon`, `L.Polyline`, `L.LatLng`, `L.LatLngBounds` and `L.GeoJSON`. It can also accept valid GeoJSON Point, Polyline, Polygon objects and GeoJSON Feature objects containing Point, Polyline, Polygon.</td>
        </tr>
        <tr>
            <td><code>overlap({{{param 'Geometry' 'geometry'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features from the service that overlap (touch but are not fully contained by) the passed geometry object. `geometry` can be an instance of `L.Marker`, `L.Polygon`, `L.Polyline`, `L.LatLng`, `L.LatLngBounds` and `L.GeoJSON`. It can also accept valid GeoJSON Point, Polyline, Polygon objects and GeoJSON Feature objects containing Point, Polyline, Polygon.</td>
        </tr>
        <tr>
            <td><code>nearby({{{param 'LatLng' 'latlng' 'http://leafletjs.com/reference.html#latlng'}}}, {{{param 'Integer' 'distance'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features a given distance in meters around a <a href="http://leafletjs.com/reference.html#latlng">LatLng</a>. <small>Only available for Feature Layers hosted on ArcGIS Online or ArcGIS Server 10.3.</small></td>
        </tr>
        <tr>
            <td><code>where({{{param 'String' 'where'}}})</code></td>
            <td><code>this</code></td>
            <td>Adds a `where` clause to the query.  String values should be denoted using single quotes ie: `query.where("FIELDNAME = 'field value'");` More info about valid SQL can be found <a href="http://resources.arcgis.com/en/help/main/10.2/index.html#/SQL_reference_for_query_expressions_used_in_ArcGIS/00s500000033000000/">here</a>.</td>
        </tr>
        <tr>
            <td><code>offset({{{param 'Integer' 'offset'}}})</code></td>
            <td><code>this</code></td>
            <td>Define the offset of the results, when combined with `limit` can be used for paging. <small>Only available for Feature Layers hosted on ArcGIS Online or ArcGIS Server 10.3.</small></td>
        </tr>
        <tr>
            <td><code>limit({{{param 'Integer' 'limit'}}})</code></td>
            <td><code>this</code></td>
            <td>Limit the number of results returned by this query, when combined with `offset` can be used for paging. <small>Only available for Feature Layers hosted on ArcGIS Online or ArcGIS Server 10.3.</small></td>
        </tr>
        <tr>
            <td><code>between({{{param 'Date' 'from'}}}, {{{param 'Date' 'to'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features within a given time range. <small>Only available for Layers/Services with `timeInfo` in their metadata.</small></td>
        </tr>
        <tr>
            <td><code>fields({{{param 'Array' 'fields'}}} or {{{param 'String' 'fields'}}})</code></td>
            <td><code>this</code></td>
            <td>An array of associated fields to request for each feature.</td>
        </tr>
        <tr>
            <td><code>returnGeometry({{{param 'Boolean' 'returnGeometry'}}})</code></td>
            <td><code>this</code></td>
            <td>Return geometry with results. Default is `true`.</td>
        </tr>
        <tr>
            <td><code>simplify({{{param 'Map' 'map' 'http://leafletjs.com/reference.html#map'}}},  {{{param 'Integer' 'factor'}}})</code></td>
            <td><code>this</code></td>
            <td>Simplify the geometries of the output features for the current map view. the <code>factor</code> parameter controls the amount of simplification between 0 (no simplification) and 1 (simplify to the most basic shape possible).</td>
        </tr>
        <tr>
            <td><code>orderBy({{{param 'String' 'fieldName'}}}, {{{param 'String' 'order'}}})</code></td>
            <td><code>this</code></td>
            <td>Order the output features on certain field either ascending or descending. This can be called multiple times to define a very detailed sort order.</td>
        </tr>
        <tr>
            <td><code>featureIds({{{param 'Array' 'ids'}}})</code></td>
            <td><code>this</code></td>
            <td>Return only specific feature IDs if they match other query parameters.</td>
        </tr>
        <tr>
            <td><code>precision({{{param 'Integer' 'precision'}}})</code></td>
            <td><code>this</code></td>
            <td>Return only this many decimal points of precision in the output geometries.</td>
        </tr>
        <tr>
            <td><code>token({{{param 'String' 'token'}}})</code></td>
            <td><code>this</code></td>
            <td>Adds a token to this request if the service requires authentication. Will be added automatically if used with a service.</td>
        </tr>
        <tr>
            <td><code>layer({{{param 'String or Integer' 'layer'}}})</code></td>
            <td><code>this</code></td>
            <td>Used to select which layer inside a Map Service to perform the query on. <br><small>Only available for Map Services.</small></td>
        </tr>
        <tr>
            <td><code>pixelSize({{{param 'Point' 'point' 'http://leafletjs.com/reference.html#point'}}})</code></td>
            <td><code>this</code></td>
            <td>Override the default pixelSize when querying an Image Service. <br><small>Only available for Image Services.</small></td>
        </tr>
        <tr>
            <td><code>run({{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>Exectues the query request with the current parameters, features will be passed to <code>callback</code> as a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a>. Accepts an optional function context.</td>
        </tr>
        <tr>
            <td><code>count({{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>Exectues the query request with the current parameters, passing only the number of features matching the query to callback as an <code>Integer</code>. Accepts an optional function context.</td>
        </tr>
        <tr>
            <td><code>ids({{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>Exectues the query request with the current parameters, passing only an array of the feature ids matching the query to callback<code>callback</code>. Accepts an optional function context.</td>
        </tr>
        <tr>
            <td><code>bounds({{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>Executes the query request with the current parameters, passing only the <a href="http://leafletjs.com/reference.html#latlngbounds"><code>LatLngBounds</code></a> of all features matching the query in the <code>callback</code>. Accepts an optional function context.  <small>Only available for Feature Layers hosted on ArcGIS Online or ArcGIS Server 10.3.1.</small></td>
        </tr>
    </tbody>
</table>

### Examples

##### Finding features with map bounds

```js
var southWest = L.latLng(45.51, -122.70);
var northEast = L.latLng(45.52, -122.64);
var bounds = L.latLngBounds(southWest, northEast);

var query = L.esri.Tasks.query({
    url:'http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0'
});

query.within(bounds);

query.run(function(error, featureCollection, response){
    console.log('Found ' + featureCollection.features.length + ' features');
});
```

##### Finding the bounds of all features

```js
var map = L.map('map').setView([41.64, -53.70], 3);
L.esri.basemapLayer('Gray').addTo(map);

var query = L.esri.Tasks.query({
    url: 'http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0'
});

query.bounds(function(error, latLngBounds, response){
    map.fitBounds(latLngBounds);
});
```

##### Querying features near a latlng

```js
var latlng = L.latLng(45.51, -122.70);

var query = L.esri.Tasks.query({
    url:'http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0'
});

query.nearby(latlng, 500);

query.run(function(error, featureCollection, response){
    console.log('Found ' + featureCollection.features.length + ' features');
});
```

##### Combining multiple options

```js
var latlng = L.latLng(45.51, -122.70);

var query = L.esri.Tasks.query({
    url: 'http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0'
});

query.nearby(latlng, 2000).where("direction='East'").orderBy('stop_id', 'ASC');

query.count(function(error, count, response){
    console.log('Found ' + count + ' features');
});

query.ids(function(error, ids, response){
    console.log(ids.join(', ') + 'match the provided parameters');
});
```

##### Getting the bounds of the query result

```js
var map = L.map('map').setView([41.64, -53.70], 3);
L.esri.basemapLayer('Gray').addTo(map);


var query = L.esri.Tasks.query({
    url:'http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0'
});

query.where("zone_id='B'").bounds(function(error, latLngBounds, response){
    map.fitBounds(latLngBounds);
});
```
