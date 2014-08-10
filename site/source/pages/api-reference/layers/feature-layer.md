---
title: L.esri.Layers.FeatureLayer
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Layer.FeatureLayer` is used to visualize and query vector geographic data hosted in ArcGIS Feature Layers. These layers are hosted as a part of Feature Services on either ArcGIS Online or ArcGIS Server.

Feature Layers are provided by Feature Services which can contain multupile layers. Feature Layers expose vector geographic information as a web service that can be visualized, styled, queried and edited.

Here is a sample Feature Service URL 

```
http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Neighborhoods_pdx/
```

FeatureServer` note that it ends in `/FeatureService`. This particular service contains only 1 Feature Layer 

```
http://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/Neighborhoods_pdx/FeatureServer/0
```

Note that the Feature Layer url ends in `/FeatureService/{LAYER_ID}`.

You can create a new empty feature service witha  single layer on the [ArcGIS for Devleopers website](https://developers.arcgis.com/en/hosted-data/#/new) or you can use ArcGIS Online to [create a Feature Service from a CSV or Shapefile](https://developers.arcgis.com/tools/csv-to-feature-service/).

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
            <td><code class="nobr">new L.esri.Layers.FeatureLayer({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.Layers.featureLayer({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">new L.esri.FeatureLayer({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.featureLayer({{{param 'String' 'url'}}}, {{{param 'Object' 'options'}}})</code></td>
            <td><code>url</code> should be the URL to the Feature Layer.</td>
        </tr>
    </tbody>
</table>

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
            <td><code>pointToLayer({{{param 'GeoJSON Feature' 'feature' 'http://geojson.org/geojson-spec.html#feature-objects'}}}, {{{param 'LatLng' 'latlng' 'http://leafletjs.com/reference.html#latlng'}}})</code></td>
            <td><code>Function</code></td>
            <td>Function that will be used for creating layers for GeoJSON points (if not specified, simple markers will be created).</td>
        </tr>
        <tr>
            <td><code>style({{{param 'GeoJSON Feature' 'feature' 'http://geojson.org/geojson-spec.html#feature-objects'}}}, {{{param 'ILayer' 'layer' 'http://leafletjs.com/reference.html#ilayer'}}})</code></td>
            <td><code>Function</code></td>
            <td>Function that will be used to get style options for vector layers created for GeoJSON features.</td>
        </tr>
        <tr>
            <td><code>onEachFeature({{{param 'GeoJSON Feature' 'feature' 'http://geojson.org/geojson-spec.html#feature-objects'}}}, {{{param 'ILayer' 'layer' 'http://leafletjs.com/reference.html#ilayer'}}})</code></td>
            <td><code>Function</code></td>
            <td> </td>
        </tr>
        <tr>
            <td><code>where</code></td>
            <td><code>String</code></td>
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
            <td><code>timeField</code></td>
            <td><code>false</code></td>
            <td>The name of the field to lookup the time of the feature. Can be an object like <code>{start:'startTime', end:'endTime'}</code> or a string like <code>'created'</code>.</td>
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
            <td>How many digits of precision to request from the server. <a href="http://en.wikipedia.org/wiki/Decimal_degrees">Wikipedia</a> has a great reference of digit precision to meters.</td>
        </tr>
        <tr>
            <td><code>token</code></td>
            <td><code>String</code></td>
            <td>If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.</td>
        </tr>
        <tr>
            <td><code>proxy</code></td>
            <td><code>String</code></td>
            <td>URL of an <a href="https://developers.arcgis.com/javascript/jshelp/ags_proxy.html">ArcGIS API for JavaScript proxies</a> or <a href="https://github.com/Esri/resource-proxy">ArcGIS Resource Proxies</a> to use for proxying POST requests.</td>
        </tr>
        <tr>
            <td><code>useCors</code></td>
            <td><code>Boolean</code></td>
            <td>If this service should use CORS when making GET requests.</td>
        </tr>
    </tbody>
</table>

### Events

| Event | Type | Description |
| --- | --- | --- |
| `loading` | [<`LoadingEvent`>]({{assets}}api-reference/events.html#loading-event) | Fires when new features start loading. |
| `load` | [<`LoadEvent`>]({{assets}}api-reference/events.html#load-event) | Fires when all features in the current bounds of the map have loaded. |
| `createfeature` | [<`CreateFeatureEvent`>]({{assets}}api-reference/events.html#feature-create) | Fired when a feature from the Feature Layer is loaded for the first time. |
| `removefeature` | [<`RemoveFeatureEvent`>]({{assets}}api-reference/events.html#feature-remove) | Fired when a feature on the layer is removed from the map. |
| `addfeature` | [<`AddFeatureEvent`>]({{assets}}api-reference/events.html#feature-add) | Fired when a previously removed feature is added back to the map. |

`L.esri.Layer.FeatureLayer` also fires all  [`L.esri.Service.FeatureLayer`]({{assets}}api-reference/services/feature-layer.html) events.

In additon to these events `L.esri.Layer.FeatureLayer` also fires the following [Mouse Events](http://leafletjs.com/reference.html#event-objects) `click`, `dblclick`, `mouseover`, `mouseout`, `mousemove`, and `contextmenu` and the following the [Popup Events](http://leafletjs.com/reference.html#event-objects) `popupopen` and `popupclose`

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
            <td><code>setStyle({{{param 'PathOptions' 'style' 'http://leafletjs.com/reference.html#path-options'}}})</code><br><br><code>setStyle({{{param 'Function' 'style'}}})</code></td>
            <td><code>this</code></td>
            <td>Sets the given path options to each layer that has a <code>setStyle</code> method. Can also be a <code>Function</code> that will receive a <code>feature</code> argument and should return <a href="http://leafletjs.com/reference.html#path-options">Path Options</a>
            <pre><code class="language-javascript">featureLayer.setStyle(1, {
    color: white;
})</code></pre>
            <pre><code class="language-javascript">featureLayer.setStyle(1, function(feature){
    return {
    weight: feature.properties.pixelWidth
    };
})</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>setFeatureStyle({{{param 'String or Integer' 'id'}}}, {{{param 'Function or <a href="http://leafletjs.com/reference.html#path-options">Path Options</a>a>'}}})</code></td>
            <td><code>this</code></td>
            <td>Changes the style on a specfic feature.</td>
        </tr>
        <tr>
            <td><code>resetStyle({{{param 'String or Integer' id}}})</code></td>
            <td><code>this</code></td>
            <td>Given the ID of a feature, reset that feature to the original style.</td>
        </tr>
        <tr>
            <td><code>bindPopup({{{param 'Function' 'fn'}}}, {{{param 'PopupOptions' 'popupOptions' 'http://leafletjs.com/reference.html#popup-options'}}})</code></td>
            <td><code>this</code></td>
            <td>
              Defines a function that will return HTML to be bound to a popup on each feature.
<pre class="js"><code>featureLayer.bindPopup(function(features){
  return "Name: " + features.properties.NAME;
});</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>unbindPopup()</code></td>
            <td><code>this</code></td>
            <td>Removed a popup previously bound with `bindPopup`.</td>
        </tr>
        <tr>
            <td><code>eachFeature({{{param 'Function' 'fn'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>
                Calls the passed function against every feature. The function will be passed the layer that represents the feature.
<pre class="js"><code>featureLayer.eachFeature(function(layer){
  console.log(layer.feature.properties.NAME);
});</code></pre>
            </td>
        </tr>
        <tr>
            <td><code>getFeature({{{param 'String or Integer' id}}} id)</code></td>
            <td><code>Layer</code></td>
            <td>Given the id of a Feature return the layer on the map that represents it. This will usually be a Leaflet vector layer like <a href="http://leafletjs.com/reference.html#polyline">Polygon</a> or <a href="http://leafletjs.com/reference.html#polyline">Polygon</a>, or a Leaflet <a href="http://leafletjs.com/reference.html#marker">Marker</a>.</td>
        </tr>
        <tr>
            <td><code>getWhere()</code></td>
            <td><code>String</code></td>
            <td>Returns the current `where` setting</td>
        </tr>
        <tr>
            <td><code>setWhere({{{param 'String' 'where'}}})</code></td>
            <td><code>this</code></td>
            <td>Sets the new `where` option and refreshes the layer to reflect the new <code>where</code> filter.</td>
        </tr>
        <tr>
            <td><code>getTimeRange()</code></td>
            <td><code>Array</code></td>
            <td>Returns the current time range as an array like <code>[from, to]</code></td>
        </tr>
        <tr>
            <td><code>setTimeRange({{{param 'Date' 'from'}}}, {{{param 'Date' 'to'}}})</code></td>
            <td><code>this</code></td>
            <td>Sets the current time filter applied to features. An optional callback is run upon completion only if <code>timeFilterMode</code> is set to <code>'server'</code>.</td>
        </tr>
        <tr>
            <td><code>authenticate({{{param 'String' 'token'}}})</code></td>
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
            <td><code>createFeature({{{param 'GeoJSON Feature' 'feature' 'http://geojson.org/geojson-spec.html#feature-objects'}}}, {{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>
                Adds a new feature to the feature layer. this also adds the feature to the map if creation is successful.
                <ul>
                    <li>Requires authentication as a user who has permission to edit the service in ArcGIS Online or the user who created the service.</li>
                    <li>Requires the <code>Create</code> capability be enabled on the service. You can check if creation exists by checking the metadata of your service under capabilities in the metadata.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>updateFeature({{{param 'GeoJSON Feature' 'feature' 'http://geojson.org/geojson-spec.html#feature-objects'}}}, {{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>
                Update the provided feature on the Feature Layer. This also updates the feature on the map.
                <ul>
                    <li>Requires authentication as a user who has permission to edit the service in ArcGIS Online or the user who created the service.</li>
                    <li>Requires the <code>Update</code> capability be enabled on the service. You can check if creation exists by checking the metadata of your service under capabilities in the metadata.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>deleteFeature({{{param 'String or Integer' 'id'}}}, {{{param 'Function' 'callback'}}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>this</code></td>
            <td>
                Remove the feature with the provided id from the feature layer. This will also remove the feature from the map if it exists.
                <ul>
                    <li>Requires authentication as a user who has permission to edit the service in ArcGIS Online or the user who created the service.</li>
                    <li>Requires the <code>Update</code> capability be enabled on the service. You can check if creation exists by checking the metadata of your service under capabilities in the metadata.</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

### Example

```js
var map = L.map('map').setView([45.53,-122.64], 14);

L.esri.basemapLayer("Streets").addTo(map);

var busStops = L.esri.featureLayer('http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/').addTo(map);
```
