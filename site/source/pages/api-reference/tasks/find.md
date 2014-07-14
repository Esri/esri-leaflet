---
title: L.esri.Tasks.Find
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Tasks.Find` is an abstraction for the query API that exists on Map Services. It provides a chainable API for building request parameters and executing queries.

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
            <td><code class='nobr'>new L.esri.Tasks.Find({{{param 'MapLayer' 'endpoint' '../../api-reference/services/feature-layer.html'}}})</code><br><br>
            <code>L.esri.Tasks.find({{{param 'MapLayer' 'endpoint' '../../api-reference/services/feature-layer.html'}}})</code><br><br>
            <code>new L.esri.Tasks.Find({{{param 'String' 'endpoint'}}})</code><br><br>
            <code>L.esri.Tasks.find({{{param 'String' 'endpoint'}}})</code></td>
            <td>The `endpoint` parameter is the service that you want to find either an  ArcGIS Server or ArcGIS Online service. You can also pass the URL to a service directly as a string. See [service URLs](#service-urls) for more information on how to find these URLs.</td>
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
            <td><code>featureIds({{{param 'Array' 'ids'}}})</code></td>
            <td><code>this</code></td>
            <td>Return only specific feature IDs if they match other query parameters.</td>
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
    </tbody>
</table>

### Example

```js
var map = new L.Map('map').setView([ 45.543, -122.621 ], 5);

L.esri.Tasks.find('http://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer')
            .on(map)
            .at([45.543, -122.621])
            .layers('visible:1')
            .run(function(error, featureCollection, response){
                console.log("UTC Offset: " + featureCollection.features[0].properties.ZONE);
            });
```
