# BasemapLayer

**Extends** [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer)

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Layers.BasemapLayer(key, options)`<br>`L.esri.Layers.basemapLayer(key, options)` | `key` type of base map you want to add. The `options` parameter can accept the same [options](http://leafletjs.com/reference.html#tilelayer) as `L.TileLayer`. |

You can also initalize `L.esri.Layers.BasemapLayer` with the aliases `new L.esri.BasemapLayer(key, options)` and `L.esri.basemapLayer(key, options)`.

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

### Options

`L.esri.TiledMapLayer` accepts all [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer-options) options.

### Methods

`L.esri.BasemapLayer` inherits all methods from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer).

### Events

`L.esri.TiledMapLayer` fires all  [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) events.

### Example

```js
var map = L.map('map').setView([37.75,-122.45], 12);

L.esri.basemapLayer("Topographic").addTo(map);
```