**WORK IN PROGRESS**

# Esri Leaflet

Leaflet wrappers for Esri Services. Currenly only supports loading Esri map tiles.

```js
map = L.map("map").setView([37.8065289741725, -122.3631477355957], 12);
L.esri.tileLayer("Topographic").addTo(map);
```

### TileLayer

`L.esri.TileLayer(tileSet, options)` accepts a string representing an Esri tile set. Valid tile sets are `Streets`, `Topographic`, `Oceans`, `NationalGeographic`, `Gray`, `GrayLabels`, `Imagery` or `ImageryLabels`. The options parameter can be any options that you could normally pass to [L.TileLayer](http://leafletjs.com/reference.html#tilelayer).

# Goal

The goal of Esri Leaflet is not to replace the ArcGIS Javascript SDK, but rather to provide small components to allow developers to build simple lightweight mapping applicaitons.

# Dependencies

* [Terraformer](https://github.com/esri/Terraformer) - for converting geometries
* [ArcGIS Node](https://github.com/ArcGIS/arcgis-node) (browser build) - for making API requests

These are currently included in `/vendor` as submodules. They will probably be used once work on things like `L.esri.FeatureLayer` starts.

# The Future!
* FeatureLayer
