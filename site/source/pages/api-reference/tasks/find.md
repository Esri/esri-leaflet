---
title: L.esri.Tasks.Find
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Tasks.Find` is an abstraction for the find API that exists on Map Services. It provides a chainable API for building request parameters and executing find tasks.

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
                <code class='nobr'>new L.esri.Tasks.Find({{{param 'MapService' 'endpoint' '../../api-reference/services/service.html'}}})</code><br><br>
                <code>L.esri.Tasks.find({{{param 'MapService' 'endpoint' '../../api-reference/services/service.html'}}})</code><br><br>
                <code>new L.esri.Tasks.Find({{{param 'String' 'endpoint'}}})</code><br><br>
                <code>L.esri.Tasks.find({{{param 'String' 'endpoint'}}})</code>
            </td>
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
            <td><code>searchText({{{param 'String' 'searchText'}}})</code></td>
            <td><code>this</code></td>
            <td>Text that is searched across the layers and fields the user specifies.</td>
        </tr>
        <tr>
            <td><code>contains({{{param 'Boolean' 'contains'}}})</code></td>
            <td><code>this</code></td>
            <td>When `true` find task will search for a value that contains the `searchText`. When `false` it will do an exact match on the `searchText` string. Default is `true`.</td>
        </tr>
        <tr>
            <td><code>searchFields({{{param 'Array' 'searchFields'}}} or {{{param 'String' 'searchFields'}}})</code></td>
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
            <td><code>geometry({{{param 'Boolean' 'returnGeometry'}}})</code></td>
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
    .searchText('Colorado');
           
find.run(function(error, featureCollection, response){
    console.log('GNIS Name: ' + featureCollection.features[0].properties.GNIS_NAME);
});
```

##### Finding features by specified search field name

```js
var find = L.esri.Tasks.find('http://services.nationalmap.gov/arcgis/rest/services/govunits/MapServer');

find.layers('13')
    .searchText('198133')
    .searchFields('GNIS_ID');

find.run(function(error, featureCollection, response){
    console.log('Found ' + featureCollection.features.length + ' feature(s)');
    console.log('Found ' + featureCollection.features[0].properties.GNIS_NAME + ' in ' + featureCollection.features[0].properties.STATE_NAME);
});
```