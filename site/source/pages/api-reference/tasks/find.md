---
title: L.esri.Tasks.Find
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Tasks.Find` is an abstraction for the find API included in Map Services. It provides a chainable API for building request parameters and executing find tasks.

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
                <code>L.esri.Tasks.find({{{param 'MapService' 'endpoint' '../../api-reference/services/service.html'}}})</code><br><br>
                <code>L.esri.Tasks.find({{{param 'Object' 'options'}}})</code>
            </td>
            <td>Accepts either an <code>options</code> object or an instance of <a href="{{assets}}/api-reference/services/map-service.html">MapService</a>.</td>
        </tr>
    </tbody>
</table>

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `String` | `''` | URL of the ArcGIS service you would like to consume. |
| `proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxy](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resource Proxy](https://github.com/Esri/resource-proxy) to use for proxying POST requests. |
| `useCors` | `Boolean` | `true` | If this service should use CORS when making GET requests. |

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
            <td><code>text({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>Text that is searched across the layers and fields the user specifies.</td>
        </tr>
        <tr>
            <td><code>contains({{{param 'Boolean' 'contains'}}})</code></td>
            <td><code>this</code></td>
            <td>When `true` find task will search for a value that contains the `searchText`. When `false` it will do an exact match on the `searchText` string. Default is `true`.</td>
        </tr>
        <tr>
            <td><code>fields({{{param 'Array' 'fields'}}} or {{{param 'String' 'fields'}}})</code></td>
            <td><code>this</code></td>
            <td>An array or comma-separated list of field names to search. If not specified, all fields are searched.</td>
        </tr>
        <tr>
            <td><code>spatialReference({{{param 'Integer' 'sr'}}})</code></td>
            <td><code>this</code></td>
            <td>The well known ID (ex. 4326) for the results.</td>
        </tr>
        <tr>
            <td><code>layerDef({{{param 'Integer' 'id'}}}, {{{param 'String' 'where'}}})</code></td>
            <td><code>this</code></td>
            <td>Add a layer definition to the find task.</td>
        </tr>
        <tr>
            <td><code>layers({{{param 'Array' 'layers'}}} or {{{param 'String' 'layers'}}})</code></td>
            <td><code>this</code></td>
            <td>Layers to perform find task on. Accepts an array of layer IDs or comma-separated list.</td>
        </tr>
        <tr>
            <td><code>returnGeometry({{{param 'Boolean' 'returnGeometry'}}})</code></td>
            <td><code>this</code></td>
            <td>Return geometry with results. Default is `true`.</td>
        </tr>
        <tr>
            <td><code>maxAllowableOffset({{{param 'Integer' 'maxAllowableOffset'}}})</code></td>
            <td><code>this</code></td>
            <td>Specifies the maximum allowable offset to be used for generalizing geometries returned by the `find` task.</td>
        </tr>
        <tr>
            <td><code>precision({{{param 'Integer' 'precision'}}})</code></td>
            <td><code>this</code></td>
            <td>Specifies the number of decimal places in returned geometries.</td>
        </tr>
        <tr>
            <td><code>returnZ({{{param 'Boolean' 'returnZ'}}})</code></td>
            <td><code>this</code></td>
            <td>Include Z values in the results. Default value is `true`. This parameter only applies if `returnGeometry=true`.</td>
        </tr>
        <tr>
            <td><code>returnM({{{param 'Boolean' 'returnM'}}})</code></td>
            <td><code>this</code></td>
            <td>Includes M values if the features have them. Default value is `false`. This parameter only applies if `returnGeometry=true`.</td>
        </tr>
        <tr>
            <td><code>dynamicLayers({{{param 'Object' 'dynamicLayers'}}})</code></td>
            <td><code>this</code></td>
            <td>Property used for adding new layers or modifying the data source of existing ones in the current map service.</td>
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
            <td>Exectues the find request with the current parameters, features will be passed to <code>callback</code> as a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a>. Accepts an optional function context.</td>
        </tr>
    </tbody>
</table>

### Example

##### Finding features

```js
var find = L.esri.Tasks.find('http://services.nationalmap.gov/arcgis/rest/services/govunits/MapServer');

find.layers('18')
    .text('Colorado');

find.run(function(error, featureCollection, response){
    console.log('GNIS Name: ' + featureCollection.features[0].properties.GNIS_NAME);
});
```

##### Finding features by specified search field name

```js
var find = L.esri.Tasks.find({
    url: 'http://services.nationalmap.gov/arcgis/rest/services/govunits/MapServer'
});

find.layers('13')
    .text('198133')
    .fields('GNIS_ID');

find.run(function(error, featureCollection, response){
    console.log('Found ' + featureCollection.features.length + ' feature(s)');
    console.log('Found ' + featureCollection.features[0].properties.GNIS_NAME + ' in ' + featureCollection.features[0].properties.STATE_NAME);
});
```
