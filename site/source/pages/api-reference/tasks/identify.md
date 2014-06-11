---
layout: documentation.hbs
---

# Identify

`L.esri.Tasks.Identify` is an abstaction for the Identify API that exists on Map Services. It provides a chainable API for building request parameters and executing the request.

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Tasks.Identify(<Service> or <String>, endpoint)`<br>`L.esri.Tasks.identify(<Service> or <String>, endpoint)` | The `endpoints` parameter is the service that you want to ientify either an  ArcGIS Server or ArcGIS Online service. You can also pass the URL to a service directly as a string. See [service URLs](#service-urls) for more information on how to find these urls. |

### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `on(<[Map](http://leafletjs.com/reference.html#map)>; map)` | `this` | The map to identify features on. |
| `at(<[LatLng](http://leafletjs.com/reference.html#latlng)>; latlng, <[Map](http://leafletjs.com/reference.html#map)>; map)` | `this` | Identifies feautres at a given [LatLng](http://leafletjs.com/reference.html#latlng) |
| `layerDef(<id>; id, <String>; where)` | `this` | Add a layer definition to the query. Can only be used on Map Services or `L.esri.Services.MapService`. |
| `between(<Date>; from, <Date>; to)` | `this` | Queries features within a given time range. |
| `layers(<String>; layers)` | `this` | The string representing which layers should be identified. |
| `precision(<Integer>; precision)` | `this` | Return only this many decimal points of precision in the output geometries. |
| `tolerance(<Integer>; tolerance)` | `this` | Buffer the identify area by a given number of screen pixels. |
| `simplify(<[Map](http://leafletjs.com/reference.html#map)>; map, <Integer>; factor)` | `this` | Simplify the geometries of the output features for the current map view. |
| `size(<Integer>; x, <Integer>; y, <Boolean>; detectRetina)` | `this` | Defines the size fo the map being identified in pixels. Optional support for retina displays. |
| `token(<String>; token)` | `this` | Adds a token to this request if the service requires authentication. Will be added automatically if used with a service. |
| `run(<Function>; callback, <Object>; context)` | `this` | Desc |

### Example