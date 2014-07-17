---
title: L.esri.Layers.ImageMapLayer
layout: documentation.hbs
---

# {{page.data.title}}

Render and visualize Image Services from ArcGIS Online and ArcGIS Server.

Image Services provide access to raster data through a web service.

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
            <td><code class="nobr">new L.esri.Layers.ImageMapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.Layers.imageMapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">new L.esri.ImageMapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.dimageMapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code></td>
            <td><code>url</code> should be the URL to the Image Service hosted the tiles. The <code>options</code> parameter can accept the same options as <a href="http://leafletjs.com/reference.html#tilelayer"><code>L.TileLayer</code></a></td>
        </tr>
    </tbody>
</table>

### Options

`L.esri.ImageMapLayer` also accepts all the options you can pass to [`L.ImageOverlay`](http://leafletjs.com/reference.html#imageoverlay).

Option | Type | Default | Description
--- | --- | --- | ---
`format` | `String` | `'jpegpng'` | Output format of the image.
`f` | `String` | `'image'` | Server response content type.
`opacity` | `Number` | `1` | Opacity of the layer. Should be a value between 0 and 1.
`position` | `String` | `'front'` | Position of the layer relative to other overlays.
`useCors` | `Boolean` | `true` | If this service should use CORS when making GET requests.

### Methods

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Returns</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>bringToBack()</code></td>
            <td><code>this</code></td>
            <td>Redraws this layer below all other overlay layers.</td>
        </tr>
        <tr>
            <td><code>bringToFront()</code></td>
            <td><code>this</code></td>
            <td>Redraws this layer above all other overlay layers.</td>
        </tr>
        <tr>
            <td><code>getOpacity()</code></td>
            <td><code>Float</code></td>
            <td>Returns the current opacity of the layer.</td>
        </tr>
        <tr>
            <td><code>setOpacity({{{param 'Float' 'opacity'}}})</code></td>
            <td><code>this</code></td>
            <td>Sets the opacity of the layer.</td>
        </tr>
        <tr>
            <td><code>getTimeRange()</code></td>
            <td><code>Array</code></td>
            <td>Returns the current time range being used for rendering.</td>
        </tr>
        <tr>
            <td><code>setTimeRange({{{param 'Date' 'from'}}}, {{{param 'Date' 'to'}}})</code></td>
            <td><code>this</code></td>
            <td>Redraws the layer with he passed time range.</td>
        </tr>
        <tr>
            <td><code>metadata({{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>
                Requests metadata about this Feature Layer. Callback will be called with `error` and `metadata`.
<pre class="js"><code>featureLayer.metadata(function(error, metadata){
  console.log(metadata);
});</code></pre>
            </td>
        </tr>
    </tbody>
</table>

### Events

| Event | Data | Description |
| --- | --- | --- |
| `loading` | [<`LoadingEvent`>]({{assets}}api-reference/events.html#loading-event) | Fires when new features start loading. |
| `load` | [<`LoadEvent`>]({{assets}}api-reference/events.html#load-event) | Fires when all features in the current bounds of the map have loaded. |

`L.esri.Layer.ImageMapLayer` also fires all  [`L.esri.Service.ImageService`]({{assets}}api-reference/services/image-service.html) events.

### Example

```js
var map = L.map('map').setView([ 38.83,-98.5], 7);

L.esri.basemapLayer('Gray').addTo(map);

var url = "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/World/MODIS/ImageServer";

L.esri.imageMapLayer(url, {
  opacity : 0.25
}).addTo(map);

```
