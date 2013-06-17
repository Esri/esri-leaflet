**WORK IN PROGRESS**

# Esri Leaflet

Leaflet plugin for Esri ArcGIS Online Services. Currenly only supports loading Esri basemaps and feature services.

### Try it live [here](http://esri.github.com/esri-leaflet/demo/index.html)

```js
map = L.map("map").setView([37.8065289741725, -122.3631477355957], 12);
L.esri.tileLayer("Topographic").addTo(map);
L.esri.featureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/',{}).addTo(map);
```

### TileLayer

`L.esri.TileLayer(tileSet, options)` accepts a string representing an Esri tile set. Valid tile sets are `Streets`, `Topographic`, `Oceans`, `NationalGeographic`, `Gray`, `GrayLabels`, `Imagery` or `ImageryLabels`. The options parameter can be any options that you could normally pass to [L.TileLayer](http://leafletjs.com/reference.html#tilelayer).

### FeatureLayer

`L.esri.featureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/',{})` accepts url endpoint to your ArcGIS Online feature service.

### Goal

The goal of Esri Leaflet is not to replace the ArcGIS Javascript SDK, but rather to provide small components to allow developers to build simple lightweight mapping applicaitons.

### Dependencies

* [Terraformer](https://github.com/esri/Terraformer) - base library for other dependancies
* [Terraformer ArcGIS](https://github.com/esri/Terraformer) - for converting geometries
* [Terraformer RTree](https://github.com/esri/Terraformer) - client side RTree index for optimizations
* [ArcGIS Node](https://github.com/ArcGIS/arcgis-node) (browser build) - for making API requests

These are currently included in `/vendor` as submodules.