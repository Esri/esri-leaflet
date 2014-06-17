---
title: L.esri.Services.MapService
layout: documentation.hbs
---

# {{page.data.title}}

Inherits from [`L.esri.Service`]({{assets}}/api-reference/services/service.html)

`L.esri.Services.MapService` is an abstraction interacting with Map Services running on ArcGIS Online and ArcGIS server that allows you to make requests to the API, as well as query and identify features on the service.

### Constructor

<table>
    <thead>
        <tr>
            <th>Constructor</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code class="nobr">new L.esri.Services.MapService({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.Services.mapService({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code></td>
            <td>The `url` parameter is the URL to the ArcGIS Server or ArcGIS Online map service you would like to consume.</td>
        </tr>
    </tbody>
</table>

### Options

`L.esri.Services.MapService` accepts all [`L.esri.Services.Service`]({{assets}}/api-reference/services/service.html) options.

### Events

`L.esri.Services.MapService` fires all  [`L.esri.Services.service`]({{assets}}/api-reference/services/service.html) events.

### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `identify()` | `this` | Returns a new [`L.esri.Tasks.Identify()`]({{assets}}/api-reference/tasks/query.html) object bound to this service. |

### Example

```js
var map = new L.Map('map').setView([ 45.543, -122.621 ], 5);

var service = L.esri.Services.MapService('http://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer');

service.identify()
    .on(map)
    .at([45.543, -122.621])
    .layers('visible:1')
    .run(function(error, featureCollection, response){
        console.log("UTC Offset: " + featureCollection.features[0].properties.ZONE);
    });
```
