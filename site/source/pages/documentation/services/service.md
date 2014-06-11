---
layout: documentation.hbs
---

# Service

`L.esri.Service`

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Service(url, options)`<br>`L.esri.service(url, options)` | The `url` parameter is the url to the ArcGIS Server or ArcGIS Online service you should like to consume. See [service URLs](#service-urls) for more information on how to find these urls. |

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resoruce Proxies](https://github.com/Esri/resource-proxy) to use for proxying POST requests. |
| `useCORS` | `Boolean` | `true` | If this service should use CORS when making GET requests. |

### Events

| Event | Type | Description | 
| --- | --- | --- |
| `requeststart` | `[&lt;RequestEvent&gt;]()` | Fired when a request to the service begins. |
| `requestend` | `[&lt;RequestEvent&gt;]()` | Fired when a request to the service ends. |
| `authenticationrequired` | `[&lt;AuthenticationEvent&gt;]()` | This will be fired when a request to the service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information. |

### Methods

| Method | Returns | Description | 
| --- | --- | --- |
| `get({{{param 'String' 'url'}}})` | `this` | Makes a GET request to the service. The services URL will be combined with the `path` option and parameters will be serialized to a query string. Accepts an optional function context for the callback. |
| `post(&lt;String&gt; url, &lt;Object&gt; params, &lt;Function&gt; callback, &lt;Object&gt; context)` | `this` | Makes a POST request to the service. The services URL will be combined with the `path` option and parameters will be serialized. Accepts an optional function context for the callback. |
| `metadata(&lt;Function&gt; callback, &lt;Object&gt; context)` | `this` | Requests the metadata about the service. This is an alias for get("/", {}, callback, context). |
| `authenticate(&lt;String&gt; token)` | `this` | Authenticates this service with a new token and runs any pending requests that required a token. |

### Example