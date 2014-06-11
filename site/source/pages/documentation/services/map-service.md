---
layout: documentation.hbs
---

# MapService

**Extends** `L.esri.Service`

`L.esri.Services.MapService` is an abstaction interacting with Map Services running on ArcGIS Online and ArcGIS server that allows you to make requests to the API, as well as query and identify features on the service.

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Services.MapService(url, options)`<br>`L.esri.Services.mapService(url, options)` | The `url` parameter is the url to the ArcGIS Server or ArcGIS Online map service you should like to consume. See [service URLs](#service-urls) for more information on how to find these urls. |

### Options

`L.esri.Services.MapService` accepts all [`L.esri.Service`]() options.

### Events

`L.esri.Services.MapService` fires all  [`L.esri.Service`]() events.

### Methods

| Method | Returns | Description | 
| --- | --- | --- |
| `query()` | `this` | Returns a new [`L.esri.Tasks.Query()`]() object bound to this service. |
| `identify()` | `this` | Returns a new [`L.esri.Tasks.Identify()`]() object bound to this service. |

### Example