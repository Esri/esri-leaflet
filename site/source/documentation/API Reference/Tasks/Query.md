# Query

`L.esri.Tasks.Query` is an abstaction for the query API that exists on Feature Layers and Map Services. It provides a chainable API for building request parameters and executing queries.

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Tasks.Query(&lt;[Service]()|String&gt;, service)`<br>`L.esri.Tasks.query(&lt;[Service]()|String&gt;, service)` | The `service` parameter is the service that you want to query either an  ArcGIS Server or ArcGIS Online service. You can also pass the URL to a service directly as a string. See [service URLs](#service-urls) for more information on how to find these urls. |

### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `within(&lt;[LatLngBounds](http://leafletjs.com/reference.html#latlngbounds)&gt; bounds)` | `this` | Queryies feautres with the given [LatLngBounds](http://leafletjs.com/reference.html#latlngbounds)&gt; bounds) object. |
| `nearby(&lt;[LatLng](http://leafletjs.com/reference.html#latlng)&gt; latlng, &lt;Integer&gt; distance)` | `this` | Queries features a given distance around a [LatLng](http://leafletjs.com/reference.html#latlng). |
| `layerDef(&lt;id&gt; id, &lt;String&gt; where)` | `this` | Add a layer definition to the query. Can only be used on Map Services or `L.esri.Services.MapService`. |
| `where(&lt;String&gt; where)` | `this` | Adds a `where` paramter to the query. |
| `offset(&lt;Integer&gt; offset)` | `this` | Define the offest of the results, when combined with `limit` can be used for paging. Available only for Feature Services hosted on ArcGIS Online |
| `limit(&lt;Integer&gt; limit)` | `this` | Limit the number of results returned by this query, when combined with `offset` can be used for paging. Available only for Feature Services hosted on ArcGIS Online |
| `between(&lt;Date&gt; from, &lt;Date&gt; to)` | `this` | Queries features within a given time range. |
| `fields(&lt;Array&gt; feilds)` | `this` | An array of associated fields to request for each feature. |
| `simplify(&lt;[Map](http://leafletjs.com/reference.html#map)&gt; map, &lt;Integer&gt; factor)` | `this` | Simplify the geometries of the output features for the current map view. |
| `orderBy(&lt;String&gt;fieldName, &lt;Boolean&gt; asc)` | `this` | Order the output features on certain field either ascending or descending. This can be called multiple times to define a very detailed sort order. |
| `featureIds(&lt;Array&gt; ids)` | `this` | Query only specific feature IDs if they match other query parameters. |
| `precision(&lt;Integer&gt; precision)` | `this` | Return only this many decimal points of precision in the output geometries. |
| `token(&lt;String&gt; token)` | `this` | Adds a token to this request if the service requires authentication. Will be added automatically if used with a service. |
| `run(&lt;Function&gt; callback, &lt;Object&gt; context)` | `this` | Runs the query with the current parameters. Your callback will recive `error` and `featureCollection` objects. |
| `count(&lt;Function&gt; callback, &lt;Object&gt; context)` | `this` | Runs the query but only returns the number of features matching the query. Your callback will recive a `error` and `count` objects. |
| `ids(&lt;Function&gt; callback, &lt;Object&gt; context)` | `this` | Runs the query but only returns the IDs of features matching the query. Your callback will recive a `error` and `ids` objects. |
| `bounds(&lt;Function&gt; callback, &lt;Object&gt; context)` | `this` | Runs the query but only returns the bounding box of features matching the query. Your callback will recive a `error` and `bounds` objects. |

### Example