# TiledMapLayer

**Extends** `L.TileLayer`

Esri Leaflet can work with tiled map services as well. You can use `L.esri.TiledMapLayer(url, options)` to use tiled map services. The `url` parameter is the url to the MapServer and options are identical to the [options you can pass](http://leafletjs.com/reference.html#tilelayer) to `L.TileLayer`.

**Your map service must be published using the Web Mercator Auxiliary Sphere tiling scheme (WKID 102100/3857) used by Google Maps, Bing Maps and [ArcGIS Online](http://resources.arcgis.com/en/help/arcgisonline-content/index.html#//011q00000002000000). Esri Leaflet will not support any other spatial reference for tile layers.**

### Constructor

Constructor | Description
--- | ---
`new L.esri.TiledMapLayer(url, options)`<br>`L.esri.TiledMapLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

### Options

`L.esri.TiledMapLayer` also accepts all the options you can pass to [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer-options).

### Events

`L.esri.TiledMapLayer` also fires all the same events as [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) in addition to these events.

### Example

```js
var map = L.map('map').setView([37.761487048570935, -122.39112854003905], 12);

L.esri.tiledMapLayer("http://services.portlandmaps.com/ags/rest/services/Public/Basemap_Color/MapServer/", {
  minZoom: 9,
  maxZoom: 20
}).addTo(map);
```