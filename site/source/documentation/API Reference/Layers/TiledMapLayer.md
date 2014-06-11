# TiledMapLayer

**Extends** `L.TileLayer`

Esri Leaflet can work with tiled map services as well. You can use `L.esri.TiledMapLayer(url, options)` to use tiled map services. The `url` parameter is the url to the MapServer and options are identical to the [options you can pass](http://leafletjs.com/reference.html#tilelayer) to `L.TileLayer`.

**Your map service must be published using the Web Mercator Auxiliary Sphere tiling scheme (WKID 102100/3857) used by Google Maps, Bing Maps and [ArcGIS Online](http://resources.arcgis.com/en/help/arcgisonline-content/index.html#//011q00000002000000). Esri Leaflet will not support any other spatial reference for tile layers.**

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Layers.TiledMapLayer(url, options)`<br>`L.esri.Layers.tiledMapLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls. |

You can also initalize `L.esri.Layers.TiledMapLayer` with the aliases `new L.esri.TiledMapLayer(url, options)` and `L.esri.tiledMapLayer(url, options)`.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resoruce Proxies](https://github.com/Esri/resource-proxy) to use for proxying POST requests. |
| `useCORS` | `Boolean` | `true` | If this service should use CORS when making GET requests. |

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
                Returns a new <a href=""><code>L.esri.services.Identify</code></a> object that can be used to identify features on this layer. Your callback function will be passed a GeoJSON FeatureCollection with the results or an error.
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
var map = L.map('map').setView([37.761487048570935, -122.39112854003905], 12);

L.esri.tiledMapLayer("http://services.portlandmaps.com/ags/rest/services/Public/Basemap_Color/MapServer/", {
  minZoom: 9,
  maxZoom: 20
}).addTo(map);
```