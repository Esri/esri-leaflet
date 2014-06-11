# DynamicMapLayer

If you have a MapService you and use `L.esri.DynamicMapLayer(url, options)` to render it on a map.

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Layers.DynamicMapLayer(url, options)`<br>`L.esri.Layers.dynamicMapLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

You can also initalize `L.esri.Layers.DynamicMapLayer` with the aliases `new L.esri.DynamicMapLayer(url, options)` and `L.esri.dynamicMapLayer(url, options)`.

### Options

`L.esri.DynamicMapLayer` also accepts all the options you can pass to [`L.ImageOverlay`](http://leafletjs.com/reference.html#imageoverlay).

Option | Type | Default | Description
--- | --- | --- | ---
`format` | `String` | `'png24'` | Output format of the image.
`transparent` | `Boolean` | `true` | Allow the server to produce transparent images.
`f` | `String` | `'image'` | Output type
`bboxSR` | `Integer` | `4326` | Spatial reference of the bounding box to generate the image with. If you don't know what this is don't change it.
`imageSR` | | `3857` | Spatial reference of the output image. If you don't know what this is don't change it.
`layers` | `Array` | `''` | An array of Layer IDs like `[3,4,5]` to show from the service.
`layerDefs` | `String` `Object` | `''` | A string representing a query to run against the service before the image is rendered. This can be a string like `"STATE_NAME='Kansas' and POP2007>25000"` or an object mapping different queries to specific layers `{5:"STATE_NAME='Kansas'", 4:"STATE_NAME='Kansas'}`.
`opacity` | `Integer` | `1` | Opacity of the layer. Should be a value between 0 and 1.
`position` | `String` | '"front"` | position of the layer relative to other overlays
`token` | `String` | `null` | If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.
`proxy` | `String` | `false` | URL of an [ArcGIS API for JavaScript proxies](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html) or [ArcGIS Resoruce Proxies](https://github.com/Esri/resource-proxy) to use for proxying POST requests.
`useCORS` | `Boolean` | `true` | If this service should use CORS when making GET requests.

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
            <td><code>bindPopup()</code></td>
            <td><code>this</code></td>
            <td>
                Uses the provided function to create a popup that will identify features whenever the map is clicked. Your function will be passed a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a> of teh features at the clicked location and should return the appropriate HTML. If you do not want to open the popup when there are no results, return <code>false</code>.
<pre class="js"><code>dynamicMapLayer.bindPopup(function(featureCollection){
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
            <td><code>setOpacity(&lt;Float&gt; opacity)</code></td>
            <td><code>this</code></td>
            <td>Sets the opacity of the layer.</td>
        </tr>
        <tr>
            <td><code>getLayers()</code></td>
            <td><code>Array</code></td>
            <td>Returns the array of layers on the MapService that are being shown.</td>
        </tr>
        <tr>
            <td><code>setLayers(&lt;Array&gt; layers)</code></td>
            <td><code>this</code></td>
            <td>Redraws the layer to show the passed array of layer ids.</td>
        </tr>
        <tr>
            <td><code>getLayerDefs()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current layer definition(s) being used for rendering.</td>
        </tr>
        <tr>
            <td><code>setLayerDefs(&lt;Object&gt; layerDefs)</code></td>
            <td><code>this</code></td>
            <td>Sets the current layer definitions being used to render the layer. Corresponds to the <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Export_Map/02r3000000v7000000/">layerDefs</a> option on the export API.</td>
        </tr>
        <tr>
            <td><code>getTimeRange()</code></td>
            <td><code>Array</code></td>
            <td>Returns the current time range being used for rendering.</td>
        </tr>
        <tr>
            <td><code>setTimeRange(&lt;Date&gt; from, &lt;Date&gt;, to)</code></td>
            <td><code>this</code></td>
            <td>Sets the current time range displayed.</td>
        </tr>
        <tr>
            <td><code>getTimeOptions()</code></td>
            <td><code>Object</code></td>
            <td>Returns the current time options being used for rendering.</td>
        </tr>
        <tr>
            <td><code>setTimeOptions(&lt;Object&gt; timeOptions)</code></td>
            <td><code>this</code></td>
            <td>Sets the current time options being used to render the layer. Corresponds to the <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Export_Map/02r3000000v7000000/">layerTimeOptions</a> option on the export API.</td>
        </tr>
        <tr>
            <td><code>metadata(&lt;Function&gt; callback, &lt;Object&gt; context)</code></td>
            <td><code>this</code></td>
            <td>
                Requests metadata about this Feature Layer. Callback will be called with `error` and `metadata`.
<pre class="js"><code>featureLayer.metadata(function(error, metadata){
  console.log(metadata);
});</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>authenticate(&lt;String&gt; token)</code></td>
            <td><code>this</code></td>
            <td>Authenticates this service with a new token and runs any pending requests that required a token.</td>
        </tr>
        <tr>
            <td><code>identify()</code></td>
            <td><code>this</code></td>
            <td>
                Returns a new <a href=""><code>L.esri.services.Identify</code></a> object that can be used to identify features on this layer. Your callback function will be passed a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a> with the results or an error.
<pre class="js"><code>featureLayer.identify()
            .at(latlng, latlngbounds, 5)
            .run(function(error, featureCollection){
              console.log(featureCollection);
            });</code></pre>
            </td>
        </tr>
    </tbody>
</table>

### Events

`L.esri.DynamicMapLayer` also fires all the same events as [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) in addition to these events.

Event | Data | Description
--- | --- | ---
`metadata` | [`Metadata`](#metadata-event) | After creating a new `L.esri.DynamicMapLayer` a request for data describing the service will be made and passed to the metadata event.
`authenticationrequired` | [`Authentication`](#authentication-event) | This will be fired when a request to a service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information.

### Example

```js
var map = L.map('map').setView([ 38.24788726821097,-85.71807861328125], 13 );

var url = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyHazardsandRisks/MapServer";

L.esri.dynamicMapLayer(url, {
  opacity : 0.25
}).addTo(map);
```