---
title: L.esri.Tasks.IdentifyImage
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Tasks.IdentifyImage` is an abstraction for the Identify API found in Image Services. It provides a chainable API for building request parameters and executing the request.

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
            <code>L.esri.Tasks.identifyImage({{{param 'ImageService' 'endpoint' '../../api-reference/services/map-service.html'}}})</code><br><br>
            <code>L.esri.Tasks.identifyImage({{{param 'Object' 'options'}}})</code><br></td>
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
            <td><code>at({{{param 'LatLng' 'latlng' 'http://leafletjs.com/reference.html#latlng'}}})</code></td>
            <td><code>this</code></td>
            <td>Identifie the pixel value at a given [LatLng](http://leafletjs.com/reference.html#latlng)</td>
        </tr>
        <tr>
            <td><code>between({{{param 'Date' 'from'}}}, {{{param 'Date' 'to'}}})</code></td>
            <td><code>this</code></td>
            <td>Identifies pixel values within a given time range.</td>
        </tr>
        <tr>
            <td><code>getRenderingRule()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current rendering rule of the task.</td>
        </tr>
        <tr>
            <td><code>setRenderingRule({{{param 'Object' 'renderingRule'}}})</code></td>
            <td><code>this</code></td>
            <td>Sets the rendering rule to apply when getting a pixel value.</td>
        </tr>
        <tr>
            <td><code>getMosaicRule()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current mosaic rule of the task.</td>
        </tr>
        <tr>
            <td><code>setMosaicRule({{{param 'Object' 'mosaicRule'}}})</code></td>
            <td><code>this</code></td>
            <td>Sets the mosaic rule to apply when getting a pixel value.</td>
        </tr>
        <tr>
            <td><code>setPixelSize({{{param 'Array' 'pixelSize'}}} or {{{param 'String' 'pixelSize'}}})</code></td>
            <td><code>this</code></td>
            <td>Sets the pixel size to use when getting a pixel value. Either an array (<code>[x,y]</code>) or string (<code>'x,y'</code>). If not set, it will use the pixel size defined by the service.</td>
        </tr>
        <tr>
            <td><code>getPixelSize()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current pixel size of the task.</td>
        </tr>
        <tr>
            <td><code>returnCatalogItems({{{param 'Boolean' 'returnCatalogItems'}}})</code></td>
            <td><code>this</code></td>
            <td>Indicates whether or not to return raster catalog items. Set it to `false` when catalog items are not needed to improve the identify operation's performance significantly. When set to `false`, neither the geometry nor attributes of catalog items will be returned. Default is `false`.</td>
        </tr>
        <tr>
            <td><code>returnGeometry({{{param 'Boolean' 'returnGeometry'}}})</code></td>
            <td><code>this</code></td>
            <td>Return catalog footprints (geometry) with catalog item results. Default is `false`.</td>
        </tr>
        <tr>
            <td><code>token({{{param 'String' 'token'}}})</code></td>
            <td><code>this</code></td>
            <td>Adds a token to this request if the service requires authentication. Will be added automatically if used with a service.</td>
        </tr>
        <tr>
            <td><code>run({{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>Executes the identify request with the current parameters, identified pixel value will be passed to <code>callback</code> as a <a href="http://wiki.geojson.org/GeoJSON_draft_version_5#Point">GeoJSON Point</a>. Accepts an optional function context</td>
        </tr>
    </tbody>
</table>

### Example

```js
var map = L.map('map').setView([36.230577, -118.253147], 10);

L.esri.Tasks.identifyImage({
    url: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Earthquakes/CaliforniaDEM/ImageServer'
})
.at([36.230577, -118.253147])
.pixelSize([30,30])
.run(function(error, identifyImageResponse, rawResponse){
    console.log(identifyImageResponse.pixel.properties.value);
});
```
