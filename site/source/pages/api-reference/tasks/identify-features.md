---
title: L.esri.Tasks.IdentifyFeatures
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Tasks.IdentifyFeatures` is an abstraction for the Identify API found in Map Services. It provides a chainable API for building request parameters and executing the request.

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
            <code>L.esri.Tasks.identifyFeatures({{{param 'ImageService' 'endpoint' '../../api-reference/services/map-service.html'}}})</code><br><br>
            <code>L.esri.Tasks.identifyFeatures({{{param 'Object' 'options'}}})</code><br></td>
            <td>Accepts either an `options` object or an instance of <a href="{{assets}}/api-reference/services/image-service.html"></a>.</td>
        </tr>
    </tbody>
</table>

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `String` | `''` | URL of the ArcGIS service you would like to consume. |
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
            <td><code>on({{{param 'Map' 'map' 'http://leafletjs.com/reference.html#map'}}})</code></td>
            <td><code>this</code></td>
            <td>The map to identify features on.</td>
        </tr>
        <tr>
            <td><code>at({{{param 'LatLng' 'latlng' 'http://leafletjs.com/reference.html#latlng'}}})</code></td>
            <td><code>this</code></td>
            <td>Identifies feautres at a given [LatLng](http://leafletjs.com/reference.html#latlng)</td>
        </tr>
        <tr>
            <td><code>layerDef({{{param 'Integer' 'id'}}}, {{{param 'String' 'where'}}})</code></td>
            <td><code>this</code></td>
            <td>Add a layer definition to the query.</td>
        </tr>
        <tr>
            <td><code>between({{{param 'Date' 'from'}}}, {{{param 'Date' 'to'}}})</code></td>
            <td><code>this</code></td>
            <td>Identifies features within a given time range.</td>
        </tr>
        <tr>
            <td><code>layers({{{param 'String' 'layers'}}})</code></td>
            <td><code>this</code></td>
            <td>The string representing which layers should be identified.</td>
        </tr>
        <tr>
            <td><code>precision({{{param 'Integer' 'precision'}}})</code></td>
            <td><code>this</code></td>
            <td>Return only this many decimal points of precision in the output geometries.</td>
        </tr>
        <tr>
            <td><code>tolerance({{{param 'Integer' 'precision'}}})</code></td>
            <td><code>this</code></td>
            <td>Buffer the identify area by a given number of screen pixels.</td>
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
            <td><code>token({{{param 'String' 'token'}}})</code></td>
            <td><code>this</code></td>
            <td>Adds a token to this request if the service requires authentication. Will be added automatically if used with a service.</td>
        </tr>
        <tr>
            <td><code>run({{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>Executes the identify request with the current parameters, identified features will be passed to <code>callback</code> as a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a>. Accepts an optional function context</td>
        </tr>
    </tbody>
</table>

### Example

```js
var map = new L.Map('map').setView([ 45.543, -122.621 ], 5);

L.esri.Tasks.identifyFeatures({
    url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer'
})
.on(map)
.at([45.543, -122.621])
.layers('visible:1')
.run(function(error, featureCollection, response){
    console.log("UTC Offset: " + featureCollection.features[0].properties.ZONE);
});
```
