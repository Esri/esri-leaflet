---
title: Utilities
layout: documentation.hbs
---

# L.esri.Utils

Utility methods used internally by Esri Leaflet. These methods are useful for converting data between ArcGIS and Leaflet formats.

<table>
    <thead>
        <tr>
            <td>Method</td>
            <td>Returns</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>extentToBounds({{{param 'Extent' 'extent' 'http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/'}}})</code></td>
            <td><code><a href="http://leafletjs.com/reference.html#latlngbounds">LatLngBounds</a></code></td>
            <td>Converts ArcGIS Extent objects to Leaflet <a href="http://leafletjs.com/reference.html#latlngbounds">LatLngBounds</a> objects.</td>
        </tr>
        <tr>
            <td><code>boundsToExtent({{{param 'LatLngBounds' 'bounds' 'http://leafletjs.com/reference.html#latlngbounds'}}})</code></td>
            <td><code><a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/">Extent</a></code></td>
            <td>Converts Leaflet <a href="http://leafletjs.com/reference.html#latlngbounds">LatLngBounds</a> objects to ArcGIS Extent objects.</td>
        </tr>
        <tr>
            <td><code>arcgisToGeojson({{{param 'ArcGIS Geometry' 'arcgis' 'http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/'}}})</code><br><code>arcgisToGeojson({{{param 'ArcGIS Feature' 'arcgis' 'http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_object/02r3000000n8000000/'}}})</code></td>
            <td><code><a href="http://geojson.org/geojson-spec.html#geojson-objects">GeoJSON</a></code></td>
            <td>Converts <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/">ArcGIS Geometry Objects</a> or <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_object/02r3000000n8000000/">ArcGIS Feature Objects</a> objects to <a href="http://geojson.org/geojson-spec.html#geojson-objects">GeoJSON</a>. If you pass a GeoJSON Feature or FeatureCollection you should also pass <code>idAttribute</code> to assign a property from the feature attributes to the ID of the GeoJSON Feature, <code>'OBJECTID'</code> or <code>'FID'</code> attributes by default.</td>
        </tr>
        <tr>
            <td>geojsonToArcGIS({{{param 'GeoJSON' 'geojson' 'http://geojson.org/geojson-spec.html#geojson-objects'}}}, {{{param 'String' 'idAttribute'}}})</td>
            <td><code>Object</code></td>
            <td>Converts <a href="http://geojson.org/geojson-spec.html#geojson-objects">GeoJSON</a> objects to <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/">ArcGIS Geometry Objects</a> or <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_object/02r3000000n8000000/">ArcGIS Feature Objects</a>. If you pass a GeoJSON Feature or FeatureCollection you should also pass <code>idAttribute</code> to assign a property in the output features to represent the features id, <code>'OBJECTID'</code> by default.</td>
        </tr>
        <tr>
            <td>responseToFeatureCollection({{{param 'Object' 'response'}}}, {{{param 'String' 'idAttribute'}}})</td>
            <td><code><a href="http://geojson.org/geojson-spec.html#feature-collection-objects">FeatureCollection</a></code></td>
            <td>Converts an API response (returned by identify, query or find API methods) to a <a href="http://geojson.org/geojson-spec.html#feature-collection-objects">GeoJSON FeatureCollection</a>. This is used internally by <code><a href="{{assets}}api-reference/tasks/query.html">L.esri.Tasks.Query</a></code>, <code><a href="{{assets}}api-reference/tasks/identify.html">L.esri.Tasks.Identify</a></code> and <code><a href="{{assets}}api-reference/tasks/find.html">L.esri.Tasks.Find</a></code> to convert responses.</td>
        </tr>
        <tr>
            <td>cleanUrl({{{param 'String' 'url'}}})</td>
            <td><code>String</code></td>
            <td>Used internally to ensure that URLs have no leading or trailing whitespace and have a leading slash.</td>
        </tr>
    </tbody>
</table>

