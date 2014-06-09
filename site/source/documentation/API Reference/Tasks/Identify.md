# Identify

`L.esri.Tasks.Identify` is an abstaction for the Identify API that exists on Map Services. It provides a chainable API for building request parameters and executing the request.

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Tasks.Identify(&lt;[Service]()|String&gt;, service)`<br>`L.esri.Tasks.identify(&lt;[Service]()|String&gt;, service)` | The `service` parameter is the service that you want to ientify either an  ArcGIS Server or ArcGIS Online service. You can also pass the URL to a service directly as a string. See [service URLs](#service-urls) for more information on how to find these urls. |

### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `on(&lt;[Map](http://leafletjs.com/reference.html#map)&gt; map)` | `this` | The map to identify features on. |
| `at(&lt;[LatLng](http://leafletjs.com/reference.html#latlng)&gt; latlng, &lt;[Map](http://leafletjs.com/reference.html#map)&gt; map)` | `this` | Identifies feautres at a given [LatLng](http://leafletjs.com/reference.html#latlng) |
| `layerDef(&lt;id&gt; id, &lt;String&gt; where)` | `this` | Add a layer definition to the query. Can only be used on Map Services or `L.esri.Services.MapService`. |
| `between(&lt;Date&gt; from, &lt;Date&gt; to)` | `this` | Queries features within a given time range. |
| `layers(&lt;String&gt; layers)` | `this` | The string representing which layers should be identified. |
| `precision(&lt;Integer&gt; precision)` | `this` | Return only this many decimal points of precision in the output geometries. |
| `tolerance(&lt;Integer&gt; tolerance)` | `this` | Buffer the identify area by a given number of screen pixels. |
| `simplify(&lt;[Map](http://leafletjs.com/reference.html#map)&gt; map, &lt;Integer&gt; factor)` | `this` | Simplify the geometries of the output features for the current map view. |
| `size(&lt;Integer&gt; x, &lt;Integer&gt; y, &lt;Boolean&gt; detectRetina)` | `this` | Defines the size fo the map being identified in pixels. Optional support for retina displays. |
| `token(&lt;String&gt; token)` | `this` | Adds a token to this request if the service requires authentication. Will be added automatically if used with a service. |
| `run(&lt;Function&gt; callback, &lt;Object&gt; context)` | `this` | Desc |

### Example