# BasemapLayer

**Extends** [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer)

### Constructor

Constructor | Description
--- | ---
`new L.esri.BasemapLayer(key, options)`<br>`L.esri.BasemapLayer(key, options)` | `key` type of base map you want to add. The `options` parameter can accept the same [options](http://leafletjs.com/reference.html#tilelayer) as `L.TileLayer`.

**Valid Keys**

* `Streets`
* `Topographic`
* `NationalGeographic`
* `Oceans`
* `OceansLabels`
* `Gray`
* `GrayLabels` - Labels to pair with the `Gray` base map
* `DarkGray`
* `DarkGrayLabels` - Labels to pair with the `DarkGray` base map
* `Imagery`
* `ImageryLabels` - Labels and political boundaries to pair with the `Imagery` basemap
* `ImageryTransportation` - A street map for pairing with the `Imagery` base map
* `ShadedRelief`
* `ShadedReliefLabels` - Labels for pairing with the `ShadedRelief` base map

### Methods

`L.esri.BasemapLayer` inherits all methods from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer).

### Events

`L.esri.BasemapLayer`inherits all events from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer).

### Example

```js
var map = L.map('map').setView([37.75,-122.45], 12);

L.esri.basemapLayer("Topographic").addTo(map);
```