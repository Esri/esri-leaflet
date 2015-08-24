---
title: L.esri.GP.Task
layout: documentation.hbs
---

# L.esri.GP.Task

An abstraction to simplify making calls to ArcGIS Online and ArcGIS Server Geoprocessing services.

### Constructor

This object is typically instantiated by calling L.esri.[GP.Service.createTask()](.././services/gp-service.html#methods)

### Events

By default, the plugin assumes services are synchronous and that 'execute' is the appropriate path.

If you are working with an asynchronous service or one with a custom operation name and don't indicate corresponding information in the constructor, you'll have to leave the plugin enough time to make a roundtrip to the server to inquire before calling `run()`.

The GP.task 'initialized' event is intended to help with this timing.

```js
var myService = L.esri.GP.service({
    url: "http://elevation.arcgis.com/arcgis/rest/services/Tools/ElevationAsync/GPServer/Profile"
  });
var myTask = myService.createTask();

myTask.on('initialized', function(){
  myTask.setParam("inputFeature", polyline.toGeoJSON());
  myTask.run(function(error, geojson, response){
    ...
  });
});
```

### Methods

<table>
    <thead>
        <tr>
            <th>Method</th>
            <td>Returns</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>setParam({{{param 'String' 'inputParamName'}}}, {{{param 'String||Boolean||Geometry' 'value'}}})</code></td>
            <td><code>`this`</code></td>
            <td>Sets an input parameter named by the service itself. [L.LatLng](http://leafletjs.com/reference.html#latlng), [L.Marker](http://leafletjs.com/reference.html#marker), [L.LatLngBounds](http://leafletjs.com/reference.html#latlngbounds), and [L.GeoJSON](http://leafletjs.com/reference.html#geojson) (both Features and Geometries) will be converted to GeoServices JSON to be passed in the request automatically.</td>
        </tr>
        <tr>
            <td><code>run({{{param 'Function' 'callback'}}})</code></td>
            <td><code>`this`</code></td>
            <td>Calls the corresponding Geoprocessing service, passing the previously supplied input parameters. For synchronous services, **all** result parameters are parsed and returned.</td>
        </tr>
        <tr>
            <td><code>setOutputParam({{{param 'String' 'outputParamName'}}})</code></td>
            <td><code>`this`</code></td>
            <td>(Optional) Only applicable for asynchronous services. Notifies the plugin of the parameter name to retrieve output for.</td>
        </tr>
        <tr>
            <td><code>gpAsyncResultParam({{{param 'String' 'resultParamName'}}}, {{{param 'Object' 'value'}}})</code></td>
            <td><code>`this`</code></td>
            <td>(Optional) Sets a result parameter for Asynchronous geoprocessing services that require it.</td>
        </tr>
    </tbody>
</table>

### Results

The response from synchronous services will be a JSON object composed of name value pairs of output parameter names and their associated values. GPFeatureRecordSet layer output will converted to GeoJSON.

A single result from the geoprocessing service. Do not rely on all these properties being present in every result object.

| Property | Type | Description |
| --- | --- | --- |
| `jobId` | `<String>`| ID of processed job (only applicable for asynchronous services). |
| `outputMapService` | `<String>`| Url of temporary map service created by geoprocessing service, if its been designed to create one. |

GP results conform to the following format

```js
[
  {
    // actual parameter name and data type are dependent on the service itself
    outputParamName: <L.GeoJSON> || <string> || <boolean>,
    outputGPFileParamName: {
        url: "http://server/arcgis/rest/directories/arcgisoutput/./_ags_856aed6eb_.png"
      }
    },
    jobId: "j7123be34ccfe45b4b47a51e867e0084b",
    mapService: "http://server/arcgis/rest/services/GPServiceName/MapServer/jobs/j7123be34ccfe45b4b47a51e867e0084b/"
  }
]
```
