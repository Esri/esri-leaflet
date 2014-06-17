---
title: Request
layout: documentation.hbs
---

# L.esri.Request

Generic methods for GET and POST requests to ArcGIS Online or ArcGIS Server resources. These methods will handle serializing the input parameters and the parsing of the response into a response and error property similar to Node JS.

GET requests will be made with `XMLHttpRequest` (via CORS) if the browser supports it and will fallback to JSONP. POST requests will always me made with `XMLHttpRequest` (via CORS) but the [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) and the [ArcGIS Resource Proxies](https://github.com/Esri/resource-proxy) are support via [`L.esri.Services.Service`]({{assets}}api-reference/services/service.html).

### L.esri.get(url, params, callback)

Execute a GET request via `XMLHttpRequest' (via CORS) or JSON depending on what is available in the browser.

**Note**: ArcGIS server before 10.1 does not have CORS support enabled by default. You can either enable CORSon your server or tell Esri Leaflet to always use JSONP requests with `L.esri.get = L.esri.Request.get.JSONP;` After you load Esri leaflet but before your own scripts.

#### Params

| Param | Value | Description |
| --- | --- | --- |
| `url` | `String`| The URL to request. |
| `params` | `Object` | The parameters to send as a query string. |
| `callback` | `Function` | Function to run when the request completes, will be passed `error` and `response`. |
| `context` | `Object` | Optional function context for the callback. |

#### Example

```js
L.esri.get('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0', {}, function(error, response){
  if(error){
    console.log(error);
  } else {
    console.log(response.name);
  }
});
```

### L.esri.post(url, params, callback)

Execute a POST request via `XMLHttpRequest' (via CORS).

This request is made via `XMLHttpRequest` which cannot make cross domain requests in IE 8 and 9. Esri Leaflet supports both the [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) and the [ArcGIS Resource Proxies](https://github.com/Esri/resource-proxy) which can be hosted on your server and used with the [`L.esri.Services.Service`]({{assets}}api-reference/services/service.html) classes to work around this issue.

| Param | Value | Description |
| --- | --- | --- |
| `url` | `String`| The URL to request. |
| `params` | `Object` | The parameters to send as a query string. |
| `callback` | `Function` | Function to run when the request completes, will be passed `error` and `response`. |
| `context` | `Object` | Optional function context for the callback. |

#### Example

```js
L.esri.post('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0', {}, function(error, response){
  if(error){
    console.log(error);
  } else {
    console.log(response.name);
  }
});
```
