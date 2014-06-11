## ClusteredFeatureLayer

`L.esri.ClusteredFeatureLayer` provides integration for Feature Layers with the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster). Because of the extra Dependency on Leaflet.markercluster we do not include `L.esri.ClusteredFeatureLayer` in the default build of Esri Leaflet. It lives in /dist/extras/clustered-feature-layer.js. You will also need to include your own copy of the [Leaflet.markercluster plugin](https://github.com/Leaflet/Leaflet.markercluster).

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Layers.ClusteredFeatureLayer(url, options)`<br>`L.esri.Layers.clusteredFeatureLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls. |

You can also initalize `L.esri.Layers.ClusteredFeatureLayer` with the aliases `new L.esri.ClusteredFeatureLayer(url, options)` and `L.esri.clusteredFeatureLayer(url, options)`.

### Options

<table>
    <thead>
        <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>pointToLayer(&lt;GeoJSON&gt;<GeoJSON> featureData, &lt;LatLng&gt; latlng)</code></td>
            <td><code>function</code></td>
            <td>Function that will be used for creating layers for GeoJSON points (if not specified, simple markers will be created).</td>
        </tr>
        <tr>
            <td><code>style(&lt;GeoJSON&gt;<GeoJSON> featureData)</code></td>
            <td><code>Function</code></td>
            <td>Function that will be used to get style options for vector layers created for GeoJSON features.</td>
        </tr>
        <tr>
            <td><code>onEachFeature(&lt;GeoJSON&gt;<GeoJSON> featureData, &lt;iLayer&gt; layer)</code></td>
            <td><code>Function</code></td>
            <td></td>
        </tr>
        <tr>
            <td><code>where</code></td>
            <td><code>String</code></td
            <td>A server side expression that will be evaluated to filter features. By default this will include all features in a service.</td>
        </tr>
        <tr>
            <td><code>fields</code></td>
            <td><code>Array</code></td>
            <td>An array of metadata names to pull from the service. Includes all fields by default.</td>
        </tr>
        <tr>
            <td><code>from</code></td>
            <td><code>Date</code></td>
            <td>When paired with <code>to</code> defines the time range of features to display. Required the Feature Layer to be time enabled.</td>
        </tr>
        <tr>
            <td><code>to</code></td>
            <td><code>Date</code></td>
            <td>When paired with <code>from</code> defines the time range of features to display. Required the Feature Layer to be time enabled.</td>
        </tr>
        <tr>
            <td><code>timeField</code>| </code>String</code> or </code>Object</code></td>
            <td><code>false</code></td>
            <td>The name of the field to lookup the time of the feature. Can also be an object like <code>{start:'startTime', end:'endTime'}</code>.</td>
        </tr>
        <tr>
            <td><code>timeFilterMode</code></td>
            <td><code>'client'</code> or </code>'server'</code></td>
            <td>Determines where features are filtered by time. By default features will be filtered by the server. If set to <code>'client'</code> all features are loaded and filtered on the client before display.</td>
        </tr>
        <tr>
            <td><code>simplifyFactor</code></td>
            <td><code>Integer</code></td>
            <td>How much to simplify polygons and polylines. More means better performance, and less means more accurate representation.</td>
        </tr>
        <tr>
            <td><code>precision</code></td>
            <td><code>Integer</code></td>
            <td>How many digits of precision to request from the server. <a href="http://en.wikipedia.org/wiki/Decimal_degrees">Wikipedia</a> has a great referance of digit precision to meters.</td>
        </tr>
        <tr>
            <td><code>token</code></td>
            <td><code>String</code></td>
            <td>If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.</td>
        </tr>
        <tr>
            <td><code>proxy</code></td>
            <td><code>String</code></td>
            <td><code>false</code></td>
            <td>URL of an <a href="https://developers.arcgis.com/javascript/jshelp/ags_proxy.html">ArcGIS API for JavaScript proxies</a> or <a href="https://github.com/Esri/resource-proxy">ArcGIS Resoruce Proxies</a> to use for proxying POST requests.</td>
        </tr>
        <tr>
            <td><code>useCORS</code></td>
            <td><code>Boolean</code></td>
            <td><code>true</code></td>
            <td>If this service should use CORS when making GET requests.</td>
        </tr>
    </tbody>
</table>

`ClusteredFeatureLayer` will also accept any options that can be passed to [Leaflet.heat](https://github.com/Leaflet/Leaflet.markercluster#all-options) to customize the behavior and appearance of the clustering.

### Events

| Event | Type | Description |
| --- | --- | --- |
| `loading` | [&lt;LoadingEvent&gt;]() | Fires when new features start loading. |
| `load` | [&lt;Load&gt;]() | Fires when all features in the current bounds of the map have loaded. |
| `authenticationrequired` | `[&lt;AuthenticationEvent&gt;]()` | This will be fired when a request to the service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information. |

In additon to these events `L.esri.FeatureLayer` also fires the following [Mouse Events](http://leafletjs.com/reference.html#event-objects) `click`, `dblclick`, `mouseover`, `mouseout`, `mousemove`, and `contextmenu`, `clusterclick`, `clusterdblclick`, `clustermouseover`, `vmouseout`, `clustermousemove`, and `clustercontextmenu` as well as the following the [Popup Events](http://leafletjs.com/reference.html#event-objects) `popupopen` and `popupclose`.

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
            <td><code>setStyle(&lt;<a href="http://leafletjs.com/reference.html#path-options">Path options</a>&gt; style)</code></td>
            <td><code>this</code></td>
            <td>Sets the given path options to each layer that has a <code>setStyle</code> method.</td>
        </tr>
        <tr>
            <td><code>resetStyle(&lt;String|Integer&gt; id)</code></td>
            <td><code>this</code></td>
            <td>Given the ID of a feature, reset that feature to the original style, useful for resetting style after hover events.</td>

        </tr>
        <tr>
            <td><code>bindPopup(&lt;Function&gt; fn, &lt;<a href="http://leafletjs.com/reference.html#popup-options">Popup options</a>&gt; options)</code></td>
            <td><code>this</code></td>
            <td>
              Defines a function that will return HTML to be bound to a popup on each feature.
<pre class="js"><code>featureLayer.bindPopup(function(features){
  return "Name: " + features.properties.NAME;
});</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>unbindPopup</code></td>
            <td><code>this</code></td>
            <td>Removed a popup previously bound with `bindPopup`.</td>
        </tr>
        <tr>
            <td><code>eachFeature(&lt;Function&gt; fn, &lt;Object&gt; context)</code></td>
            <td><code>this</code></td>
            <td>
                Calls the passed function against every feature. The function will be passed the layer that represents the feature.
<pre class="js"><code>featureLayer.eachFeature(function(layer){
  console.log(layer.feature);
});</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>getFeature(&lt;String|Integer&gt; id)</code></td>
            <td><code>Layer</code></td>
            <td>Given the id of a Feature return the layer on the map that represents it. This will usually be a Leaflet vector layer like <a href="http://leafletjs.com/reference.html#polyline">Polygon</a> or <a href="http://leafletjs.com/reference.html#polyline">Polygon</a>, or a Leaflet <a href="http://leafletjs.com/reference.html#marker">Marker</a>.</td>
        </tr>
        <tr>
            <td><code>getWhere()</code></td>
            <td><code>String</code></td>
            <td>Returns the current `where` setting</td>
        </tr>
        <tr>
            <td><code>setWhere(&lt;String&gt; where, &lt;Function&gt; callback)</code></td>
            <td><code>this</code></td>
            <td>Sets the new `where` option and refreshes the layer to reflect the new <code>where</code> filter.</td>
        </tr>
        <tr>
            <td><code>getTimeRange()</code></td>
            <td><code>Array</code></td>
            <td>Returns the current time range as an array like <code>[from, to]</code></td>
        </tr>
        <tr>
            <td><code>setTimeRange(&lt;Date&gt; from, &lt;Date&gt; to, &lt;Function&gt; callback, &lt;Object&gt; context)</code></td>
            <td><code>this</code></td>
            <td>Sets the current time filter applied to features. An optional callback is run upon completion only if <code>timeFilterMode</code> is set to <code>'server'</code>.</td>
        </tr>
        <tr>
            <td><code>authenticate(&lt;String&gt; token)</code></td>
            <td><code>this</code></td>
            <td>Authenticates this service with a new token and runs any pending requests that required a token.</td>
        </tr>
        <tr>
            <td><code>query()</code></td>
            <td><code>this</code></td>
            <td>
                Returns a new <a href=""><code>L.esri.services.Query</code></a> object that can be used to query this layer. Your callback function will be passed a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a> with the results or an error.
<pre class="js"><code>featureLayer.query()
            .within(latlngbounds)
            .where("Direction = 'WEST'")
            .run(function(error, featureCollection){
              console.log(featureCollection);
            });</code></pre>
            </td>
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
            <td><code>createFeature(&lt;<a href="http://geojson.org/geojson-spec.html#feature-objects">GeoJSON Feature</a>&gt; feature, &lt;Function&gt; callback)</code></td>
            <td><code>this</code></td>
            <td>
                Adds a new feature to the feature layer. this also adds the feature to the map if creation is successful.
                <ul>
                    <li>Requires authentication as a user who has permission to edit the service in ArcGIS Online or the user who created the srevice.</li>
                    <li>Requires the <code>Create</code> capability be enabled on the service. You can check if creation exists by checking the metadata of your service under capabilities in the metadata.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>updateFeature(&lt;<a href="http://geojson.org/geojson-spec.html#feature-objects">GeoJSON Feature</a>&gt; feature, &lt;Function&gt; callback)</code></td>
            <td><code>this</code></td>
            <td>
                Update the provided feature on the Feature Layer. This also updates the feature on the map.
                <ul>
                    <li>Requires authentication as a user who has permission to edit the service in ArcGIS Online or the user who created the srevice.</li>
                    <li>Requires the <code>Update</code> capability be enabled on the service. You can check if creation exists by checking the metadata of your service under capabilities in the metadata.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>removeFeature(&lt;String|Integer&gt; id, &lt;Function&gt; callback)</code></td>
            <td><code>this</code></td>
            <td>
                Remove the feature with the provided id from the feature layer. This will also remove the feature from the map if it exists.
                <ul>
                    <li>Requires authentication as a user who has permission to edit the service in ArcGIS Online or the user who created the srevice.</li>
                    <li>Requires the <code>Update</code> capability be enabled on the service. You can check if creation exists by checking the metadata of your service under capabilities in the metadata.</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

### Example

```js
var map = L.map('map').setView([45.53,-122.64], 16);

L.esri.basemapLayer("Streets").addTo(map);

var url = "http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0";

var busStops = new L.esri.ClusteredFeatureLayer(url, {
  // Cluster Options
  disableClusteringAtZoom: 16,
  polygonOptions: {
    color: "#2d84c8"
  },

  // Feature Layer Options
  pointToLayer: function (geojson, latlng) {
    return L.circleMarker(latlng, 10, {
      color: "#2D84C8"
    });
  },
  onEachMarker: function(geojson, marker) {
    marker.bindPopup("<h3>"+geojson.properties.stop_name+"</h3><p>Stop ID: "+geojson.properties.stop_id+"</p><p>"+geojson.properties.stop_desc+"</p>")
  }
}).addTo(map);
```