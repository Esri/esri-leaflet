---
title: L.esri.Layers.DynamicMapLayer
layout: documentation.hbs
---

# {{page.data.title}}

<!-- Inherits from [`L.esri.Layers.RasterLayer`]({{assets}}api-reference/layers/raster-layer.html) -->

Render and visualize Map Services from ArcGIS Online and ArcGIS Server. L.esri.Layers.DynamicMapLayer also supports custom popups and identification of features.

Map Services are a way to expose the contents of a map as a web service and expose capabilities for exporting tile images, querying and identifying features and more.

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
            <td>L.esri.dynamicMapLayer({{{param 'Object' 'options'}}})</code></td>
            <td>The <code>options</code> parameter can accept the same options as <a href="http://leafletjs.com/reference.html#imageoverlay"><code>L.ImageOverlay</code></a>. You also must pass a <code>url</code> key in your <code>options</code>.</td>
        </tr>
    </tbody>
</table>

### Options

`L.esri.DynamicMapLayer` also accepts all the options you can pass to [`L.ImageOverlay`](http://leafletjs.com/reference.html#imageoverlay).

Option | Type | Default | Description
--- | --- | --- | ---
`url` | `String` | | *Required* URL of the [Map Service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Map_Service/02r3000000w2000000/).
`format` | `String` | `'png24'` | Output format of the image.
`transparent` | `Boolean` | `true` | Allow the server to produce transparent images.
`f` | `String` | `'json'` |  Server response content type.
`bboxSR` | `Integer` | `4326` | Spatial reference of the bounding box to generate the image with. If you don't know what this is don't change it.
`imageSR` | `Integer` | `3857` | Spatial reference of the output image. If you don't know what this is don't change it.
`layers` | `Array` | `''` | An array of Layer IDs like `[3,4,5]` to show from the service.
`layerDefs` | `String` `Object` | `''` | A string representing a query to run against the service before the image is rendered. This can be a string like `"STATE_NAME='Kansas' and POP2007>25000"` or an object mapping different queries to specific layers `{5:"STATE_NAME='Kansas'", 4:"STATE_NAME='Kansas'}`.
`opacity` | `Number` | `1` | Opacity of the layer. Should be a value between 0 (completely transparent) and 1 (completely opaque).
`position` | `String` | `'front'` | Position of the layer relative to other overlays.
`dynamicLayers` | `Object` | `null` | JSON object literal used to manipulate the layer symbology defined in the service itself.  Requires a 10.1 (or above) map service which supports [dynamicLayers](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Export_Map/02r3000000v7000000/) requests.
`token` | `String` | `null` | If you pass a token in your options it will be included in all requests to the service.
`proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxy](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resource Proxy](https://github.com/Esri/resource-proxy) to use for proxying POST requests.
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
            <td><code>bindPopup({{{param 'Function' 'fn'}}}, {{{param 'PopupOptions' 'popupOptions' 'http://leafletjs.com/reference.html#popup-options'}}})</code></td>
            <td><code>this</code></td>
            <td>
                Uses the provided function to create a popup that will identify features whenever the map is clicked. Your function will be passed a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a> of the features at the clicked location and should return the appropriate HTML. If you do not want to open the popup when there are no results, return <code>false</code>.
<pre class="js"><code>
dynamicMapLayer.bindPopup(
  function(err, featureCollection, response){
    var count = featureCollection.features.length;
    return (count) ? count + ' features' : false;
});</code></pre>
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
            <td><code>getLayers()</code></td>
            <td><code>Array</code></td>
            <td>Returns the array of layers on the MapService that are being shown.</td>
        </tr>
        <tr>
            <td><code>setLayers({{{param 'Array' 'layers'}}})</code></td>
            <td><code>this</code></td>
            <td>Redraws the layer to show the passed array of layer ids.</td>
        </tr>
        <tr>
            <td><code>getLayerDefs()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current layer definition(s) being used for rendering.</td>
        </tr>
        <tr>
            <td><code>setLayerDefs({{{param 'Object' 'layerDefs' 'http://resources.arcgis.com/en/help/arcgis-rest-api/#/Export_Map/02r3000000v7000000/'}}})</code></td>
            <td><code>this</code></td>
            <td>Redraws the layer with the new layer definitions. Corresponds to the <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Export_Map/02r3000000v7000000/">layerDefs</a> option on the export API.</td>
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
            <td><code>getTimeOptions()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current time options being used for rendering.</td>
        </tr>
        <tr>
            <td><code>setTimeOptions({{{param 'Object' 'timeOptions' 'http://resources.arcgis.com/en/help/arcgis-rest-api/#/Export_Map/02r3000000v7000000/'}}})</code></td>
            <td><code>this</code></td>
            <td>Sets the current time options being used to render the layer. Corresponds to the <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Export_Map/02r3000000v7000000/">layerTimeOptions</a> option on the export API.</td>
        </tr>
        <tr>
            <td><code>getDynamicLayers()</code></td>
            <td><code>Object</code></td>
            <td>Returns a JSON object representing the modified layer symbology being requested from the map service.</td>
        </tr>
        <tr>
            <td><code>setDynamicLayers({{{param 'Object' 'layers'}}})</code></td>
            <td><code>Object</code></td>
            <td>Used to insert raw dynamicLayers JSON in situations where you'd like to modify layer symbology defined in the service itself.
<pre class="js"><code>dynamicMapLayer.setDynamicLayers([{
  ...
  "drawingInfo": { ... }
}]);
</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>metadata({{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>
                Requests metadata about this Feature Layer. Callback will be called with `error` and `metadata`.
<pre class="js"><code>dynamicMapLayer.metadata(function(error, metadata){
  console.log(metadata);
});</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>authenticate({{{param 'String' 'token'}}})</code></td>
            <td><code>this</code></td>
            <td>Authenticates this service with a new token and runs any pending requests that required a token.</td>
        </tr>
        <tr>
            <td><code>identify()</code></td>
            <td><code>this</code></td>
            <td>
                Returns a new <a href="{{assets}}/api-reference/tasks/identify-features.html"><code>L.esri.services.IdentifyFeatures</code></a> object that can be used to identify features on this layer. Your callback function will be passed a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a> with the results or an error.
<pre class="js"><code>dynamicMapLayer.identify()
  .at(latlng, latlngbounds, 5)
  .run(function(error, featureCollection){
    console.log(featureCollection);
  });</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>find()</code></td>
            <td><code>this</code></td>
            <td>
                Returns a new <a href="{{assets}}/api-reference/tasks/find.html"><code>L.esri.services.Find</code></a> object that can be used to find features. Your callback function will be passed a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a> with the results or an error.
<pre class="js"><code>dynamicMapLayer.find()
  .layers('18')
  .searchText('Colorado')
  .run(function(error, featureCollection){
    console.log(featureCollection);
  });</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>query()</code></td>
            <td><code>this</code></td>
            <td>
                Returns a new <a href="{{assets}}api-reference/tasks/query.html"><code>L.esri.Tasks.Query</code></a> object that can be used to query this service.
<pre class="js"><code>mapService.query()
  .layer(0)
  .within(latlngbounds)
  .run(function(error, featureCollection, response){
    console.log(featureCollection);
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

`L.esri.Layers.DynamicMapLayer` also fires all  [`L.esri.Services.MapService`]({{assets}}api-reference/services/map-service.html) events.

### Example

```js
var map = L.map('map').setView([ 38.83,-98.5], 7);

L.esri.basemapLayer('Gray').addTo(map);

var url = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Petroleum/KGS_OilGasFields_Kansas/MapServer";

L.esri.dynamicMapLayer(url, {
  opacity : 0.25
}).addTo(map);

```
