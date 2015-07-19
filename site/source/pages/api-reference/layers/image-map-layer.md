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
            <td><code class="nobr">L.esri.imageMapLayer({{{param 'Object' 'options'}}})</code></td>
            <td>The <code>options</code> parameter can accept the same options as <a href="http://leafletjs.com/reference.html#imageoverlay"><code>L.ImageOverlay</code></a>. You also must pass a <code>url</code> key in your <code>options</code>.</td>
        </tr>
    </tbody>
</table>

### Options

`L.esri.ImageMapLayer` also accepts all the options you can pass to [`L.ImageOverlay`](http://leafletjs.com/reference.html#imageoverlay).

Option | Type | Default | Description
--- | --- | --- | ---
`url` | `String` | | *Required* URL of the [Image Service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Image_Service/02r3000000q8000000/).
`format` | `String` | `'jpegpng'` | Output format of the image.
`f` | `String` | `'image'` | Server response content type.
`opacity` | `Number` | `1` | Opacity of the layer. Should be a value between 0 and 1.
`position` | `String` | `'front'` | Position of the layer relative to other overlays.
`proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resource Proxies](https://github.com/Esri/resource-proxy) to use for proxying POST requests.
`bandIds` | `String` | `undefined` | If there are multiple bands, you can specify which bands to export.
`noData` | `Number` | `undefined` | The pixel value representing no information.
`noDataInterpretation` | `String` | `undefined` | Interpretation of the `noData` setting.
`pixelType` | `String` | `undefined` | Leave `pixelType` as unspecified, or `UNKNOWN`, in most exportImage use cases, unless such `pixelType` is desired. Possible values: `C128`, `C64`, `F32`, `F64`, `S16`, `S32`, `S8`, `U1`, `U16`, `U2`, `U32`, `U4`, `U8`, `UNKNOWN`.
`useCors` | `Boolean` | `true` | If this service should use CORS when making GET requests.
`renderingRule` | `Object` | `undefined` | A JSON representation of a [raster function](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Raster_function_objects/02r3000000rv000000/)
`mosaicRule` | `Object` | `undefined` | A JSON representation of a [mosaic rule](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Mosaic_rule_objects/02r3000000s4000000/)

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
            <td><code>bindPopup({{{param 'Function' 'fn'}}}, {{{param 'PopupOptions' 'popupOptions' 'http://leafletjs.com/reference.html#popup-options'}}})</code></td>
            <td><code>this</code></td>
            <td>
                Uses the provided function to create a popup that will identify pixel value(s) whenever the map is clicked. Your function will be passed an object with a `pixel` property that is a <a href="http://geojson.org/geojson-spec.html#point">GeoJSON Point</a> with the pixel value(s) at the clicked location and should return the appropriate HTML. If you do not want to open the popup when there are no results, return <code>false</code>.

<pre class="js"><code>
imageMapLayer.bindPopup(
  function(err, identifyResults, response){
    var value = results.pixel.properties.value;
    return (value) ? 'Pixel value: ' + value : false;
  });</code></pre>

                NOTE: by default, if the layer has a mosaic rule applied, then the same rule will be applied to the identify request. Conversely, if the layer has a rendering rule applied, that rule is **NOT** applied to the layer so that that the raw pixel value can be returned. If you need specific control over how these rules (and/or other identify parameters) are passed to the identify service, use <a href="{{assets}}api-reference/tasks/identify-image.html"><code>L.esri.Tasks.IdentifyImage</code></a>.
            </td>
        </tr>
        <tr>
            <td><code>unbindPopup()</code></td>
            <td><code>this</code></td>
            <td>Removes a popup previously bound with <code>bindPopup</code>.</td>
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
            <td><code>getNoData()</code></td>
            <td><code>String</code></td>
            <td>Returns the current no data value.</td>
        </tr>
        <tr>
            <td><code>setNoData({{{param 'Array' 'noData'}}} or {{{param 'Number' 'noData'}}}, {{{param 'String' 'noDataInterpretation'}}})</code></td>
            <td><code>this</code></td>
            <td>Specify a single value, or an array of values to treat as no data. No data will values will be rendered transparent.<br />The optional `noDataInterpretation` can be either `esriNoDataMatchAny` | `esriNoDataMatchAll`. The default is `esriNoDataMatchAny` when `noData` is a number, and `esriNoDataMatchAll` when noData is an array. See <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Export_Image/02r3000000wm000000/">Image Service Export Image documentation</a> for more details</td>
        </tr>
        <tr>
            <td><code>getNoDataInterpretation()</code></td>
            <td><code>String</code></td>
            <td>Returns the current no data interpretation value.</td>
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
<pre class="js"><code>
imageService.query()
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
        <tr>
            <td><code>getMosaicRule()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current mosaic rule of the layer.</td>
        </tr>
        <tr>
            <td><code>setMosaicRule({{{param 'Object' 'mosaicRule'}}})</code></td>
            <td><code>this</code></td>
            <td>Redraws the layer with the passed mosaic rule.</td>
        </tr>
    </tbody>
</table>

### Events

| Event | Data | Description |
| --- | --- | --- |
| `loading` | [<`LoadingEvent`>]({{assets}}api-reference/events.html#loading-event) | Fires when new features start loading. |
| `load` | [<`LoadEvent`>]({{assets}}api-reference/events.html#load-event) | Fires when all features in the current bounds of the map have loaded. |

`L.esri.Layers.ImageMapLayer` also fires all  [`L.esri.Services.ImageService`]({{assets}}api-reference/services/image-service.html) events.

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
