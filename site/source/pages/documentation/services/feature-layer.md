---
layout: documentation.hbs
---

# FeatureLayer

**Extends** `L.esri.Service`

`L.esri.Services.FeatureLayer` is an abstaction interacting with Map Services running on ArcGIS Online and ArcGIS server that allows you to make requests to the API, as well as query and identify features on the service.

### Constructor

| Constructor | Description |
| --- | --- |
| `new L.esri.Services.FeatureLayer(url, options)`<br>`L.esri.Services.featureLayer(url, options)` | The `url` parameter is the url to the ArcGIS Server or ArcGIS Online map service you should like to consume. See [service URLs](#service-urls) for more information on how to find these urls. |

### Options

`L.esri.Services.FeatureLayer` accepts all [`L.esri.Service`]() options.

### Events

`L.esri.Services.FeatureLayer` fires all  [`L.esri.Service`]() events.

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