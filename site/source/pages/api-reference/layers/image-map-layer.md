---
title: L.esri.Layers.ImageMapLayer
layout: documentation.hbs
---

# {{page.data.title}}

<!-- Inherits from [`L.esri.Layers.RasterLayer`]({{assets}}api-reference/layers/raster-layer.html) -->

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
`proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resource Proxies](https://github.com/Esri/resource-proxy) to use for proxying POST requests.
`bandIds` | `String` | `undefined` | If there are multiple bands, you can specify a single band to export.
`pixelType` | `String` | `undefined` | Leave `pixelType` as unspecified, or `UNKNOWN`, in most exportImage use cases, unless such `pixelType` is desired. Possible values: `C128`, `C64`, `F32`, `F64`, `S16`, `S32`, `S8`, `U1`, `U16`, `U2`, `U32`, `U4`, `U8`, `UNKNOWN`.
`useCors` | `Boolean` | `true` | If this service should use CORS when making GET requests.
`renderingRule` | `Object` | `undefined` | A JSON representation of a [raster function](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Raster_function_objects/02r3000000rv000000/)

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
            <td>Redraws the layer with the passed time range.</td>
        </tr>
        <tr>
            <td><code>getBandIds()</code></td>
            <td><code>String</code></td>
            <td>Returns the current band value(s).</td>
        </tr>
        <tr>
            <td><code>setBandIds({{{param 'Array' 'bandIds'}}} or {{{param 'String' 'bandIds'}}})</code></td>
            <td><code>this</code></td>
            <td>Specify a single band to export, or you can change the band combination (red, green, blue) by specifying the band number.</td>
        </tr>
        <tr>
            <td><code>getPixelType()</code></td>
            <td><code>String</code></td>
            <td>Returns the current pixel type.</td>
        </tr>
        <tr>
            <td><code>setPixelType({{{param 'String' 'pixelType'}}})</code></td>
            <td><code>this</code></td>
            <td>The pixel type, also known as data type, pertains to the type of values stored in the raster, such as signed integer, unsigned integer, or floating point. Possible values: `C128`, `C64`, `F32`, `F64`, `S16`, `S32`, `S8`, `U1`, `U16`, `U2`, `U32`, `U4`, `U8`, `UNKNOWN`.</td>
        </tr>
        <tr>
            <td><code>authenticate({{{param 'String' 'token'}}})</code></td>
            <td><code>this</code></td>
            <td>Authenticates this service with a new token and runs any pending requests that required a token.</td>
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
        <tr>
            <td><code>query()</code></td>
            <td><code>this</code></td>
            <td>
                Returns a new <a href="{{assets}}api-reference/tasks/query.html"><code>L.esri.Tasks.Query</code></a> object that can be used to query this service.
<pre class="js"><code>imageService.query()
            .within(latlngbounds)
            .run(function(error, featureCollection, response){
              console.log(featureCollection);
            });</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>getRenderingRule()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current rendering rule of the layer.</td>
        </tr>
        <tr>
            <td><code>setRenderingRule({{{param 'Object' 'renderingRule'}}})</code></td>
            <td><code>this</code></td>
            <td>Redraws the layer with the passed rendering rule.</td>
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

#### Simple Image Layer

```js
var map = L.map('map').setView([ 38.83,-98.5], 7);

L.esri.basemapLayer('Gray').addTo(map);

var url = "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/World/MODIS/ImageServer";

L.esri.imageMapLayer(url, {
  opacity : 0.25
}).addTo(map);

```

#### Infrared image layer using bandIds property

```js
var map = L.map('map').setView([43.50, -120.23], 7);

L.esri.basemapLayer('Imagery').addTo(map);

L.esri.imageMapLayer('http://imagery.oregonexplorer.info/arcgis/rest/services/NAIP_2011/NAIP_2011_Dynamic/ImageServer')
      .setBandIds('3,0,1')
      .addTo(map);
```
