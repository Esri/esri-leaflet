# FeatureLayer

### Constructor

Constructor | Description
--- | ---
`new L.esri.FeatureLayer(url, options)`<br>`L.esri.FeatureLayer(url, options)` | The `url` parameter is the url to the FeatureLayer you should like to display. See [service URLs](#service-urls) for more information on how to find these urls.

### Options

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
`authenticationrequired` | [`Authentication`](#authentication-event) | This will be fired when a request to a service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information.

### Example

```js
var map = L.map('map').setView([45.53,-122.64], 16);

L.esri.basemapLayer("Streets").addTo(map);

var busStops = L.esri.featureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/').addTo(map);
```