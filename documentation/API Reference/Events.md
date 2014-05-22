# Events

Event types common across multupile components of Esri Leaflet are documented here.

### `loading` Event

Data | Value | Description
--- | --- | ---
`bounds` | [`LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds) | The bounds that are currently being loaded.

### `load` Event

Data | Value | Description
--- | --- | ---
`bounds` | [`LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds) | The bounds that were loaded.

**NOTE**: The `load` event will not fire if you add the layer to the map before adding the event listener. You must add the listener first and then add the layer to the map as follows.

```js
var layer = new L.esri.FeatureLayer(url, options);

layer.on('load', function(e){
  // do something on load
});

layer.addTo(map);
```

### `authenticationrequired` Event

Data | Value | Description
--- | --- | ---
`authenticate` | `Function` | Pass an access token to this method to retry the failed request and update the `token` parameter for the layer. See [working with authenticated services](#working-with-authenticated-services) for more information.