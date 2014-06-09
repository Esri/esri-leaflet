# HeatMapFeatureLayer

`L.esri.HeatMapFeatureLayer` provides integration for Feature Layers with the [Leaflet.heat plugin](https://github.com/Leaflet/Leaflet.heat). Because of the extra Dependency on Leaflet.heat we do not include `L.esri.HeatMapFeatureLayer` in the default build of Esri Leaflet. It lives in /dist/extras/heatmap-feature-layer.js. You will also need to include your own copy of the [Leaflet.heat plugin](https://github.com/Leaflet/Leaflet.heat).

### Constructor

|Constructor | Description |
|--- | --- |
|`new L.esri.Layers.HeatMapFeatureLayer(url, options)`<br>`L.esri.Layers.heatMapFeatureLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls. |

You can also initalize `L.esri.Layers.HeatMapFeatureLayer` with the aliases `new L.esri.HeatMapFeatureLayer(url, options)` and `L.esri.heatMapFeatureLayer(url, options)`.

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

`L.esri.HeatMapFeatureLayer` will also accept any options that can be passed to [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat#lheatlayerlatlngs-options) to customize the appearance of the heatmap.

### Events

| Event | Type | Description |
| --- | --- | --- |
| `loading` | [&lt;LoadingEvent&gt;]() | Fires when new features start loading. |
| `load` | [&lt;Load&gt;]() | Fires when all features in the current bounds of the map have loaded. |
| `authenticationrequired` | `[&lt;AuthenticationEvent&gt;]()` | This will be fired when a request to the service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information. |

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
<pre class="js"><code>featureLayer.query.within(latlngbounds).where("Direction = 'WEST'").run(function(error, featureCollection){
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
var map = new L.Map('map').setView([40.722868115037,-73.92142295837404], 14);

var heatmap = new L.esri.HeatMapFeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Graffiti_Locations3/FeatureServer/0", {
  radius: 12,
  gradient: {
    0.4: "#ffeda0",
    0.65: "#feb24c",
    1: "#f03b20"
  }
}).addTo(map);
```