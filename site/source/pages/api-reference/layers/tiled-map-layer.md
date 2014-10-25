---
title: L.esri.Layers.TiledMapLayer
layout: documentation.hbs
---

# {{page.data.title}}

Inherits from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer)

Access tiles from ArcGIS Online and ArcGIS Server as well as visualize and identify features on them.

Is you have Feature Services published on ArcGIS online you can create a static set of tiles using your Feature Service. You can find details on that process on the [ArcGIS Online Help](http://doc.arcgis.com/en/arcgis-online/share-maps/publish-tiles.htm#ESRI_SECTION1_F68FCBD33BD54117B23232D41A762E89)

**Your map service must be published using the Web Mercator Auxiliary Sphere tiling scheme (WKID 102100/3857) and the default scale option used by Google Maps, Bing Maps and [ArcGIS Online](http://resources.arcgis.com/en/help/arcgisonline-content/index.html#//011q00000002000000). Esri Leaflet will not support any other spatial reference for tile layers.**

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
            <td><code class="nobr">new L.esri.Layers.TiledMapLayer({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.Layers.tiledMapLayer({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">new L.esri.TiledMapLayer({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.tiledMapLayer({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code></td>
            <td><code>url</code> should be the URL to the Map Service hosted the tiles. The <code>options</code> parameter can accept the same options as <a href="http://leafletjs.com/reference.html#tilelayer"><code>L.TileLayer</code></a></td>
        </tr>
    </tbody>
</table>

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resource Proxies](https://github.com/Esri/resource-proxy) to use for proxying POST requests. |
| `useCors` | `Boolean` | `true` | If this service should use CORS when making GET requests. |
| `token` | | `String` | `null` | Will use this tokent to authenticate all calls to the service.

`L.esri.TiledMapLayer` also accepts all [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer-options) options.

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

`L.esri.BasemapLayer` inherits all methods from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer).

### Events

`L.esri.TiledMapLayer` fires all  [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) events.

### Example

```js
var map = L.map('map').setView([37.7614, -122.3911], 12);

L.esri.tiledMapLayer("http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer", {
  maxZoom: 15
}).addTo(map);
```
