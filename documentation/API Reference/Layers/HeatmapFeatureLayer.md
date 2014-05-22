## HeatMapFeatureLayer

**Extends** `L.Class`

`L.esri.HeatMapFeatureLayer` provides integration for Feature Layers with the [Leaflet.heat plugin](https://github.com/Leaflet/Leaflet.heat). Because of the extra Dependency on Leaflet.heat we do not include `L.esri.HeatMapFeatureLayer` in the default build of Esri Leaflet. It lives in /dist/extras/heatmap-feature-layer.js. You will also need to include your own copy of the [Leaflet.heat plugin](https://github.com/Leaflet/Leaflet.heat).

### Constructor

Constructor | Description
--- | ---
`new L.esri.HeatMapFeatureLayer(url, options)`<br>`L.esri.heatMapFeatureLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

### Options

`HeatMapFeatureLayer` will also accept any options that can be passed to [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat#lheatlayerlatlngs-options) to customize the appearance of the heatmap.

Option | Type | Default | Description
--- | --- | --- | ---
`where` | `String` | `"1=1"` | A server side expression that will be evaluated to filter features. By default this will include all features in a service.
`fields` | `Array` | `["*"]` | An array of metadata names to pull from the service. Includes all fields by default.
`token` | `String` | `null` | If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.

### Events

Event | Data | Description
--- | --- | ---
`loading` | [`Loading`](#loading-event) | Fires when new features start loading.
`load` | [`Load`](#load-event) | Fires when all features in the current bounds of the map have loaded.

### Example

```js
var map = new L.Map('map').setView([40.722868115037,-73.92142295837404], 14);

var heatmap = new L.esri.HeatMapFeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Graffiti_Locations3/FeatureServer/0", {
  radius: 12,
  gradient: {
    0.4: "#ffeda0",
    0.65: "#feb24c",
    1: "#f03b20"
  }
}).addTo(map);
```