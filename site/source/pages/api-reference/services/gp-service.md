---
title: L.esri.GP.Service
layout: documentation.hbs
---

# L.esri.GP.Service

A basic wrapper for speaking to ArcGIS Online and ArcGIS Server Geoprocessing services.  You can find more information and the source code for this plugin [here](https://github.com/jgravois/esri-leaflet-gp).

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
            <td><code class="nobr">L.esri.GP.service({{{param 'Object' 'options'}}})</code></td>
            <td>Creates a new Geoprocessing service.</td>
        </tr>
    </tbody>
</table>

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `String` | `null` | The url of the gp service you'd like to leverage. |
| `path` | `String` | `'execute'` | (Optional) The class is able to sniff out execute/submitJob operations from typical [geoprocessing services](http://server.arcgis.com/en/server/latest/publish-services/windows/a-quick-tour-of-authoring-geoprocessing-services.htm), but setting 'path' can be helpful for [SOEs](http://resources.arcgis.com/en/help/main/10.2/index.html#//0154000004s5000000) and Network Analyst Services with custom operation names. |
| `async` | `Boolean` | `false` | (Optional) Set 'async' to indicate whether a GP service with a custom operation name is synchronous or asynchronous. |
| `asyncInterval` | `Integer` | `1` | (Optional) Determines how often the application should check on jobs in progress. |

### Events

Fires all [L.esri.Service](service.html) events.  By default, the plugin assumes services are synchronous and that 'execute' is the appropriate path.

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
            <td><code>createTask()</code></td>
            <td><code>`L.esri.GP.Task`</code></td>
            <td>Returns a Geoprocessing task.</td>
        </tr>
    </tbody>
</table>
