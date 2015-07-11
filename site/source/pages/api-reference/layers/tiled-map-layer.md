---
title: L.esri.Layers.TiledMapLayer
layout: documentation.hbs
---

# {{page.data.title}}

Inherits from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer)

Access tiles from ArcGIS Online and ArcGIS Server as well as visualize and identify features.

Is you have Feature Services published in ArcGIS Online you can create a static set of tiles using your Feature Service. You can find details about that process in the [ArcGIS Online Help](http://doc.arcgis.com/en/arcgis-online/share-maps/publish-tiles.htm#ESRI_SECTION1_F68FCBD33BD54117B23232D41A762E89)

**Your map service must be published using the Web Mercator Auxiliary Sphere tiling scheme (WKID 102100/3857) and the default scale options used by Google Maps, Bing Maps and [ArcGIS Online](http://resources.arcgis.com/en/help/arcgisonline-content/index.html#//011q00000002000000). Esri Leaflet will not support any other spatial reference for tile layers.**

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
            <td><code class="nobr">L.esri.tiledMapLayer({{{param 'Object' 'options'}}})</code></td>
            <td>The <code>options</code> parameter can accept the same options as <a href="http://leafletjs.com/reference.html#tilelayer"><code>L.ImageOverlay</code></a>. You also must pass a <code>url</code> key in your <code>options</code>.</td>
        </tr>
    </tbody>
</table>

### Options

`L.esri.TiledMapLayer` also accepts all [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer-options) options.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
`url` | `String` | | *Required* URL of the [Map Service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Map_Service/02r3000000w2000000) with a tile cache.
| `correctZoomLevels` | `Boolean` | `true` | If your tiles were generated in web mercator but at non-standard zoom levels this will remap then to the standard zoom levels.
| `zoomOffsetAllowance` | `Number` | `0.1` | If `correctZoomLevels` is enabled this controls the amount of tolerance if the difference at each scale level for remapping tile levels.
| `proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxy](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resource Proxy](https://github.com/Esri/resource-proxy) to use for proxying POST requests. |
| `useCors` | `Boolean` | `true` | Dictates if the service should use CORS when making GET requests. |
| `token` | `String` | `null` | Will use this token to authenticate all calls to the service.

### Methods

`L.esri.BasemapLayer` inherits all methods from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer).

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
            <td><code>authenticate(&lt;String&gt; token)</code></td>
            <td><code>this</code></td>
            <td>Authenticates this service with a new token and runs any pending requests that required a token.</td>
        </tr>
        <tr>
            <td><code>metadata(&lt;Function&gt; callback, &lt;Object&gt; context)</code></td>
            <td><code>this</code></td>
            <td>
                Requests metadata about this Feature Layer. Callback will be called with `error` and `metadata`.
<pre class="js"><code>featureLayer.metadata(function(error, metadata){
  console.log(metadata);
});</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>identify()</code></td>
            <td><code>this</code></td>
            <td>
                Returns a new <a href="/api-reference/tasks/identify-features.html"><code>L.esri.services.IdentifyFeatures</code></a> object that can be used to identify features on this layer. Your callback function will be passed a GeoJSON FeatureCollection with the results or an error.
<pre class="js"><code>featureLayer.identify()
  .at(latlng, latlngbounds, 5)
  .run(function(error, featureCollection){
    console.log(featureCollection);
  });</code></pre>
            </td>
        </tr>
    </tbody>
</table>

### Events

`L.esri.TiledMapLayer` fires all  [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) events.

### Example

```js
var map = L.map('map').setView([37.7614, -122.3911], 12);

L.esri.tiledMapLayer("http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer", {
  maxZoom: 15
}).addTo(map);
```
