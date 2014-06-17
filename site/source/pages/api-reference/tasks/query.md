---
title: L.esri.Tasks.Query
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Tasks.Query` is an abstraction for the query API that exists on Feature Layers and Map Services. It provides a chainable API for building request parameters and executing queries.

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
            <td><code class='nobr'>new L.esri.Tasks.Query({{{param 'FeatureLayer' 'endpoint' '../../api-reference/services/feature-layer.html'}}})</code><br><br>
            <code>L.esri.Tasks.query({{{param 'FeatureLayer' 'endpoint' '../../api-reference/services/feature-layer.html'}}})</code><br><br>
            <code>new L.esri.Tasks.Query({{{param 'String' 'endpoint'}}})</code><br><br>
            <code>L.esri.Tasks.query({{{param 'String' 'endpoint'}}})</code></td>
            <td>The `endpoint` parameter is the service that you want to query either an  ArcGIS Server or ArcGIS Online service. You can also pass the URL to a service directly as a string. See [service URLs](#service-urls) for more information on how to find these URLs.</td>
        </tr>
    </tbody>
</table>

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
            <td><code>within({{{param 'LatLngBounds' 'bounds' 'http://leafletjs.com/reference.html#latlngbounds'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features with the given <a href="http://leafletjs.com/reference.html#latlngbounds">LatLngBounds</a> object.</td>
        </tr>
        <tr>
            <td><code>nearby({{{param 'LatLng' 'latlng' 'http://leafletjs.com/reference.html#latlng'}}}, {{{param 'Integer' 'distance'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features a given distance in meters around a <a href="http://leafletjs.com/reference.html#latlng">LatLng</a>.</td>
        </tr>
        <tr>
            <td><code>where({{{param 'String' 'where'}}})</code></td>
            <td><code>this</code></td>
            <td>Adds a `where` paramter to the query.</td>
        </tr>
        <tr>
            <td><code>offset({{{param 'Integer' 'offset'}}})</code></td>
            <td><code>this</code></td>
            <td>Define the offset of the results, when combined with `limit` can be used for paging. Available only for Feature Services hosted on ArcGIS Online.</td>
        </tr>
        <tr>
            <td><code>limit({{{param 'Integer' 'limit'}}})</code></td>
            <td><code>this</code></td>
            <td>Limit the number of results returned by this query, when combined with `offset` can be used for paging. Available only for Feature Services hosted on ArcGIS Online.</td>
        </tr>
        <tr>
            <td><code>between({{{param 'Date' 'from'}}}, {{{param 'Date' 'to'}}})</code></td>
            <td><code>this</code></td>
            <td>Queries features within a given time range.</td>
        </tr>
        <tr>
            <td><code>fields({{{param 'Array' 'fields'}}})</code></td>
            <td><code>this</code></td>
            <td>An array of associated fields to request for each feature.</td>
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
            <td>Exectues the query request with the current parameters, passing only the <a href="http://leafletjs.com/reference.html#latlngbounds"><code>LatLngBounds</code></a> of all features the query to callback<code>callback</code>. Accepts an optional function context.</td>
        </tr>
    </tbody>
</table>

### Examples

##### Finding features with map bounds

```js
var southWest = L.latLng(45.51, -122.70);
var northEast = L.latLng(45.52, -122.64);
var bounds = L.latLngBounds(southWest, northEast);

var query = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0');

query.within(bounds);

query.run(function(error, featureCollection, response){
    console.log('Found ' + featureCollection.features.length + ' features');
});
```

##### Finding the bounds of all features

```js
var map = L.map('map').setView([41.64, -53.70], 3);
L.esri.basemapLayer('Gray').addTo(map);

var query = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0');

query.bounds(function(error, latLngBounds, response){
    map.fitBounds(latLngBounds);
});
```

##### Querying features near a latlng

```js
var latlng = L.latLng(45.51, -122.70);

var query = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0');

query.nearby(latlng, 500);

query.run(function(error, featureCollection, response){
    console.log('Found ' + featureCollection.features.length + ' features');
});
```

##### Combining multiple options

```js
var latlng = L.latLng(45.51, -122.70);

var query = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0');

query.nearby(latlng, 2000).where("direction='East'").orderBy('stop_id', 'ASC');

query.count(function(error, count, response){
    console.log('Found ' + count + ' features');
});

query.ids(function(error, ids, response){
  console.log(arguments);
    console.log(ids.join(', ') + 'match the provided parameters');
});
```

##### Getting the bounds of the query result

```js
var map = L.map('map').setView([41.64, -53.70], 3);
L.esri.basemapLayer('Gray').addTo(map);


var query = L.esri.Tasks.query('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0');

query.where("zone_id='B'").bounds(function(error, latLngBounds, response){
    map.fitBounds(latLngBounds);
});
```
