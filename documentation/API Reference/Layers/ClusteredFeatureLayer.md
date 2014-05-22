## ClusteredFeatureLayer

**Extends** `L.Class`

`L.esri.ClusteredFeatureLayer` provides integration for Feature Layers with the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster). Because of the extra Dependency on Leaflet.markercluster we do not include `L.esri.ClusteredFeatureLayer` in the default build of Esri Leaflet. It lives in /dist/extras/clustered-feature-layer.js. You will also need to include your own copy of the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster).

### Constructor

Constructor | Description
--- | ---
`new L.esri.ClusteredFeatureLayer(url, options)`<br>`L.esri.clusteredFeatureLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

### Options

`ClusteredFeatureLayer` will also accept any options that can be passed to [Leaflet.heat](https://github.com/Leaflet/Leaflet.markercluster#all-options) to customize the behavior and appearance of the clustering.

Option | Type | Default | Description
--- | --- | --- | ---
`createMarker` | `Function` | `null` | A function that will be called with a  GeoJSON representation of the point its latitude and longitude. Should return a `L.Marker` object.
`onEachMarker` | Function | `null` | This function will be called for every marker before it is added to the cluster. It is called with the GeoJSON representation of the point and the marker 
`where` | `String` | `"1=1"` | A server side expression that will be evaluated to filter features. By default this will include all features in a service.
`fields` | `Array` | `["*"]` | An array of metadata names to pull from the service. Includes all fields by default.
`token` | `String` | `null` | If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.

### Events

Event | Data | Description
--- | --- | ---
`loading` | [`Loading`](#loading-event) | Fires when new features start loading.
`load` | [`Load`](#load-event) | Fires when all features in the current bounds of the map have loaded.
`authenticationrequired` | [`Authentication`](#authentication-event) | This will be fired when a request to a service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information.

### Example

```js
var map = L.map('map').setView([45.53,-122.64], 16);

L.esri.basemapLayer("Streets").addTo(map);

var busStops = new L.esri.ClusteredFeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0", {
  // Cluster Options
  disableClusteringAtZoom: 16,
  polygonOptions: {
    color: "#2d84c8"
  },

  // Feature Layer Options
  createMarker: function (geojson, latlng) {
    return L.circleMarker(latlng, 10, {
      color: "#2D84C8"
    });
  },
  onEachMarker: function(geojson, marker) {
    marker.bindPopup("<h3>"+geojson.properties.stop_name+"</h3><p>Stop ID: "+geojson.properties.stop_id+"</p><p>"+geojson.properties.stop_desc+"</p>")
  }
}).addTo(map);
```