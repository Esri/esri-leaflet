---
title: L.esri.Related.Query
layout: documentation.hbs
---

# L.esri.Related.Query

An abstraction to assist querying related tables published in ArcGIS Server or ArcGIS Online.  You can find more information and the source code for this plugin [here](https://github.com/jgravois/esri-leaflet-related).

### Constructor

Extends [`L.esri.Task`](task.html)

<table>
    <thead>
        <tr>
            <th>Constructor</th>
            <td>Options</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>L.esri.Related.query({{{param 'L.esri.FeatureLayer' 'endpoint'}}})</code><br>or<br><code>L.esri.Related.query({{{param 'Object' 'options'}}})</code></td>
            <td><code>`<L.esri.FeatureLayer>` or `<Options>`</code></td>
            <td>Accepts either an `options` object or an instance of [`L.esri.FeatureLayer`](../layers/feature-layer.html).</td>
        </tr>
    </tbody>
</table>

### Options

Accepts all [`L.esri.Task`](task.html#options) options. When used, the `url` option is required.

### Methods

<table>
    <thead>
        <tr>
            <th>Method</th>
            <td>Returns</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>objectIds({{{param 'Array' 'objectIds'}}} or {{{param 'String' 'objectId'}}})</code></td>
            <td><code>`this`</code></td>
            <td>The ObjectId(s) of the features to query for related records.</td>
        </tr>
        <tr>
            <td><code>relationshipId({{{param 'String' 'relationship id'}}})</code></td>
            <td><code>`this`</code></td>
            <td>The id of the relationship itself.</td>
        </tr>
        <tr>
            <td><code>run({{{param 'Function' 'callback'}}})</code></td>
            <td><code>`this`</code></td>
            <td>Executes the query, passing the previously supplied input parameters.</td>
        </tr>
        <tr>
            <td><code>fields({{{param 'Array' 'fields'}}} or {{{param 'String' 'field'}}})</code></td>
            <td><code>`this`</code></td>
            <td>(Optional) Indicates which fields from matched records to include in response (default is 'all').</td>
        </tr>
        <tr>
            <td><code>returnGeometry({{{param 'Boolean' 'true'}}}, {{{param 'Object' 'value'}}})</code></td>
            <td><code>`this`</code></td>
            <td>(Optional) Indicates whether or request the geometry of response features (default is true).</td>
        </tr>
        <tr>
            <td><code>returnZ({{{param 'Boolean' 'true'}}}, {{{param 'Object' 'value'}}})</code></td>
            <td><code>`this`</code></td>
            <td>(Optional) Indicates whether to request information about elevation in response features (default is true).</td>
        </tr>
        <tr>
            <td><code>returnM({{{param 'Boolean' 'true'}}}, {{{param 'Object' 'value'}}})</code></td>
            <td><code>`this`</code></td>
            <td>(Optional) Indicates whether to request information about 4-D M values in response features (default is false).</td>
        </tr>
        <tr>
            <td><code>precision({{{param 'Number' 'number'}}}, {{{param 'Object' 'value'}}})</code></td>
            <td><code>`this`</code></td>
            <td>(Optional) Indicates the desired decimal precision of response feature geometries.</td>
        </tr>
        <tr>
            <td><code>definitionExpression({{{param 'String' 'sqlfilter'}}}, {{{param 'Object' 'value'}}})</code></td>
            <td><code>`this`</code></td>
            <td>(Optional) An opportunity to specify a SQL `where` clause to further filter results. (Example: "STATE_NAME = 'California'")</td>
        </tr>
    </tbody>
</table>

### Results

| Property | Type | Description |
| --- | --- | --- |
| `features` | `[<L.geoJson>]`| The result of a valid request will be composed of an array of [L.geoJson](http://leafletjs.com/reference.html#geojson) features. |

Example

```js
{
  features: [{
    "type": "Feature",
    "properties": {
      ...
    },
    "id": 1
  },
  ...
  ]
}
```
