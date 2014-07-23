---
title: Events
layout: documentation.hbs
---

# Events

Event types common across components of Esri Leaflet are documented here.

### Loading Event

| Data | Value | Description |
| --- | --- | --- |
| `bounds` | [`LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds) | The  bounds that are currently being loaded. |

### Load Event

| Data | Value | Description |
| --- | --- | --- |
| `bounds` | [`LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds) | The bounds that were loaded. |

**NOTE**: The `load` event will not fire if you add the layer to the map before adding the event listener. You must add the listener first and then add the layer to the map as follows.

```js
var layer = new L.esri.FeatureLayer(url, options);

layer.on('load', function(e){
  // do something on load
});

layer.addTo(map);
```

### Feature Create

`createfeature` is fired when a feature from the Feature Layer is loaded for the first time.

| Data | Value | Description |
| --- | --- | --- |
| `feature` | [`GeoJSON Feature`](http://geojson.org/geojson-spec.html#feature-objects) | GeoJSON respresentation of the feature that was created. |

### Feature Remove

`removefeature` is fired when a feature is removed from the map, either as the result of a filter operation or because it was deleted from the service.

| Data | Value | Description |
| --- | --- | --- |
| `feature` | [`GeoJSON Feature`](http://geojson.org/geojson-spec.html#feature-objects) | GeoJSON respresentation of the feature that was created. |
| `permanent` | `Boolean` | `true` if the feature was permanently deleted from the service or `false` if the feature was removed as the result of a filter operation.

### Feature Add

`addfeature` is fired when a feature that has already been created is added to the map again, usually the result of a filtering operation.

| Data | Value | Description |
| --- | --- | --- |
| `feature` | [`GeoJSON Feature`](http://geojson.org/geojson-spec.html#feature-objects) | GeoJSON respresentation of the feature that was added. |

### Request Event

| Data | Value | Description |
| --- | --- | --- |
| `url` | `String` | The url the request was made to. |
| `params` | `Object` | The parameters that were passed to the request. |
| `method` | `String` | The HTTP method that was used for the request. |

### Request Success Event

| Data | Value | Description |
| --- | --- | --- |
| `url` | `String` | The url the request was made to. |
| `params` | `Object` | The parameters that were passed to the request. |
| `method` | `String` | The HTTP method that was used for the request. |
| `response` | `Object` | The JSON returned from the request. |

### Request Error Event

| Data | Value | Description |
| --- | --- | --- |
| `url` | `String` | The url the request was made to. |
| `params` | `Object` | The parameters that were passed to the request. |
| `method` | `String` | The HTTP method that was used for the request. |
| `code` | `Integer`| The error code that was returned. |
| `message` | `String`| The error message that was returned. |

### Authentication Event

| Data | Value | Description |
| --- | --- | --- |
| `authenticate` | `Function` | Pass a new access token to this method to retry the failed request(s).