# Request

Generic methods for GET and POST requests to ArcGIS Online or ArcGIS Server resources.

### `L.esri.get(&lt;String&gt; url, &lt;Object&gt; params, &lt;Function&gt; callback, &lt;Object&gt; context)`

#### Params

| Param | Description |
| --- | --- |
| `url` | The URL to request. |
| `params` | The parameters to send as a query string. |
| `callback` | Function to run when the request completes, will be passed `error` and `response`. |
| `context` | Optional function context for the callback. |

This function will execute the GET request via CORS or JSON depending on what is available in the browser.

**ArcGIS server before 10.1 does not have CORS support enabled by default. You can either enable CORS or run `L.esri.get = L.esri.Request.get.JSON;` in your script after loading Esri Leaflet**

### `L.esri.post(&lt;String&gt; url, &lt;Object&gt; params, &lt;Function&gt; callback, &lt;Object&gt; context)`

| Param | Description |
| --- | --- |
| `url` | The URL to request. |
| `params` | The parameters to send as a query string. |
| `callback` | Function to run when the request completes, will be passed `error` and `response`. |
| `context` | Optional function context for the callback. |

This request is made via `XMLHttpRequest` which cannot make cross domain requests in IE 8 and 9. Esri Leaflet supports both the [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) and the [ArcGIS Resoruce Proxies](https://github.com/Esri/resource-proxy) which can be hosted on your server and used with the `L.esri.Service` classes to work around this issue.