---
title: L.esri.Geocoding.Suggest
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Geocoding.Suggest` is an abstraction for submitting requests for geocoding suggestions.  You can find more information and the source code for this plugin [here](https://github.com/Esri/esri-leaflet-geocoder).

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
            <code>L.esri.Geocoding.suggest({{{param 'Object' 'options'}}})</code><br><br>
            </td>
            <td>Creates a new `Suggest` task</td>
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
            <td><code>text({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>The text to get suggestions for.
            </td>
        </tr>
        <tr>
            <td><code>category({{{param 'String' 'category'}}})</code></td>
            <td><code>this</code></td>
            <td>The optional category to search for. A list of valid categories can be found [here](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm#ESRI_SECTION1_502B3FE2028145D7B189C25B1A00E17B).
            </td>
        </tr>
        <tr>
            <td><code>within({{{param 'L.LatLngBounds' 'bounds'}}})</code></td>
            <td><code>this</code></td>
            <td>A bounding box used to filter results.
            </td>
        </tr>
        <tr>
            <td><code>nearby({{{param 'L.LatLng' 'latlng' }}}, {{{param 'Integer' 'distance'}}})</code></td>
            <td><code>this</code></td>
            <td>Increase the match score of candidates close to a location passed within the request.
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
L.esri.Geocoding.suggest()
  .text('trea')
  .nearby([45,-121], 5000)
  .run(function(error, response){
    /* response syntax is documented here:
    https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm#ESRI_SECTION1_FC3884A45AD24E62BD11C9888F1392DB
    */
  });
```