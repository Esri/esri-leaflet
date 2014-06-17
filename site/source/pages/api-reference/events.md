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