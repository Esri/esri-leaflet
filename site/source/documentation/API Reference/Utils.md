# Utils

Utility methods used internally by Esri Leaflet, mostly for converting [ArcGIS Geometry JSON](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/) structures to their Leaflet equivalents.

<table>
    <thead>
        <tr>
            <tr>Method</tr>
            <tr>Returns</tr>
            <tr>Description</tr>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>extentToBounds(&lt;Extent&gt;, extent)</code></td>
            <td><code><a href="http://leafletjs.com/reference.html#latlngbounds">LatLngBounds</a></code></td>
            <td>Converts ArcGIS Extent objects to Leaflet <a href="http://leafletjs.com/reference.html#latlngbounds">LatLngBounds</a> objects.</td>
        </tr>
        <tr>
            <td><code>boundsToExtent(&lt;<a href="http://leafletjs.com/reference.html#latlngbounds">LatLngBounds</a>&gt;, bounds)</code></td>
            <td><code>Extent</code></td>
            <td>Converts Leaflet <a href="http://leafletjs.com/reference.html#latlngbounds">LatLngBounds</a> objects to ArcGIS Extent objects.</td>
        </tr>
        <tr>
            <td>arcgisToGeojson(&lt;<a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/">ArcGIS Geometry Objects</a>|<a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_object/02r3000000n8000000/">ArcGIS Feature Objects</a>&gt;)</td>
            <td><code><a href="http://geojson.org/geojson-spec.html#geojson-objects">GeoJSON</a></code></td>
            <td>Converts <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/">ArcGIS Geometry Objects</a> or <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_object/02r3000000n8000000/">ArcGIS Feature Objects</a> objects to <a href="http://geojson.org/geojson-spec.html#geojson-objects">GeoJSON</a>. If you pass a GeoJSON Feature or FeatureCollection you should also pass <code>idAttribute</code> to assign a property from the feature attributes to the ID of the GeoJSON Feature, <code>'OBJECTID'</code> or <code>'FID'</code> attributes by default.</td>
        </tr>
        <tr>
            <td>geojsonToArcGIS(&lt;<a href="http://geojson.org/geojson-spec.html#geojson-objects">GeoJSON</a>&gt; geojson, &lt;String&gt; idAttribute)</td>
            <td><code>Object</code></td>
            <td>Converts <a href="http://geojson.org/geojson-spec.html#geojson-objects">GeoJSON</a> objects to <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/">ArcGIS Geometry Objects</a> or <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_object/02r3000000n8000000/">ArcGIS Feature Objects</a>. If you pass a GeoJSON Feature or FeatureCollection you should also pass <code>idAttribute</code> to assign a property in the output features to represent the features id, <code>'OBJECTID'</code> by default.</td>
        </tr>
        <tr>
            <td>featureSetToFeatureCollection()</td>
            <td><code><a href="http://geojson.org/geojson-spec.html#feature-collection-objects">FeatureCollection</a></code></td>
            <td>Converts an ArcGIS Feature Set (returned by identify and query API methods) to a GeoJSON <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">FeatureCollection</a>. This is used internally by <code>L.esri.Service.Query</code> and <code>L.esri.Services.Identify</code> to convert responses.</td>
        </tr>
        <tr>
            <td>cleanUrl(&lt;String&gt;, url)</td>
            <td><code>String</code></td>
            <td>Used internally to ensure that URLs have no leading or trailing whitespace and have a leading slash.</td>
        </tr>
    </tbody>
</table>

