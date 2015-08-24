---
title: L.esri.Geocoding.ReverseGeocode
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Geocoding.ReverseGeocode` is an abstraction for submitting requests for address candidates associated with a particular location.  You can find more information and the source code for this plugin [here](https://github.com/Esri/esri-leaflet-geocoder).

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
            <td>
            <code>L.esri.Geocoding.reverseGeocode({{{param 'Object' 'options'}}})</code><br><br>
            </td>
            <td>Creates a new `ReverseGeocode` task.</td>
        </tr>
    </tbody>
</table>

You can pass any options you can pass to [L.esri.Task](task.html). The `url` will be the [ArcGIS World Geocoder](https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm) by default but a custom geocoding service can also be used.


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
            <td><code>latlng({{{param 'L.LatLng' 'latlng'}}})</code></td>
            <td><code>this</code></td>
            <td>The `L.LatLng` object for which an associated address will be queried.
            </td>
        </tr>
        <tr>
            <td><code>distance({{{param 'Integer' 'distance'}}})</code></td>
            <td><code>this</code></td>
            <td>The distance (in meters) around the point for which addresses will be queried.  The default value is `100`.
            </td>
        </tr>
        <tr>
            <td><code>language({{{param 'String' 'language'}}})</code></td>
            <td><code>this</code></td>
            <td>The language to use when returning address candidates.
            </td>
        </tr>
        <tr>
            <td><code>run({{{param 'Function' 'callback' }}}, {{{param 'Object' 'context'}}})</code></td>
            <td><code>`XMLHttpRequest`</code></td>
            <td>Executes the request chain and accepts the response callback.
            </td>
        </tr>
    </tbody>
</table>

### Examples

```js
L.esri.Geocoding.reverseGeocode()
  .latlng([48.8583,  2.2945])
  .run(function(error, result, response){
      // callback is called with error, result, and raw response.
      // result.latlng contains the coordinates of the located address
      // result.address contains information about the match
  });
```