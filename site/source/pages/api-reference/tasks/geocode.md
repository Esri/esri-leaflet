---
title: L.esri.Geocoding.Geocode
layout: documentation.hbs
---

# {{page.data.title}}

`L.esri.Geocoding.Geocode` is an abstraction for submitting geocoding requests.

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
            <code>L.esri.Geocoding.geocode({{{param 'Object' 'options'}}})</code><br><br>
            </td>
            <td>Creates a new `Geocode` task</td>
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
            <td>The text to geocode. If you specify `text` other params like `address`, `city`, `subregion`, `region`, `postal`, and `country` will be ignored.
            </td>
        </tr>
        <tr>
            <td><code>address({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>The street and house number to be geocoded.
            </td>
        </tr>
        <tr>
            <td><code>neighborhood({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>The neighborhood to be geocoded.
            </td>
        </tr>
        <tr>
            <td><code>city({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>The city to be geocoded.
            </td>
        </tr>
        <tr>
            <td><code>subregion({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>The subregion to be geocoded.
            </td>
        </tr>
        <tr>
            <td><code>region({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>The region to be geocoded.
            </td>
        </tr>
        <tr>
            <td><code>postal({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>The postal code to be geocoded.
            </td>
        </tr>
        <tr>
            <td><code>country({{{param 'String' 'text'}}})</code></td>
            <td><code>this</code></td>
            <td>The country to be geocoded.
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
L.esri.Geocoding.geocode().text('380 New York St, Redlands, California, 92373').run(function(err, results, response){
  console.log(results);
});
```

```js
L.esri.Geocoding.geocode().address('380 New York St').city('Redlands').region('California').postal(92373).run(function(err, results, response){
  console.log(results);
});
```

```js
//Using .within()
var southWest = L.latLng(37.712, -108.227),
    northEast = L.latLng(41.774, -102.125),
    bounds = L.latLngBounds(southWest, northEast); // Colorado

L.esri.Geocoding.geocode().text("Denver").within(bounds).run(function(err, response){
  console.log(response);
});
```

```js
//Using .nearby()
var denver = L.latLng(37.712, -108.227);

L.esri.Geocoding.geocode().text("Highlands Ranch").nearby(denver, 20000).run(function(err, response){
  console.log(response);
});
```

### Results Object
In the examples above the `results` object will look like this.
```js
{
  results: [
    {
      latlng: L.LatLng,
      text: 'Formatted Address',
      score: 100, // certainty ranking of the match
      properties: {
        // additional info like specific address components (Country Code etc.)
      }
    }
  ]
}
```