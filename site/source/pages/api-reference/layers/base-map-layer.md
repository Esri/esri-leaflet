---
title: L.esri.Layers.BasemapLayer
layout: documentation.hbs
---

# {{page.data.title}}

Quickly access Esri published map tiles from on ArcGIS Online in Leaflet.

Inherits from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer)

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
            <td><code class="nobr">new L.esri.Layers.BaseMapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.Layers.baseMapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">new L.esri.BaseMapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code><br><br><code class="nobr">L.esri.baseMapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code></td>
            <td><code>key</code> type of base map you want to add. The <code>options</code> parameter can accept the same [options](http://leafletjs.com/reference.html#tilelayer) as `L.TileLayer`.</td>
        </tr>
    </tbody>
</table>

**Valid Keys**

* `Streets`
* `Topographic`
* `NationalGeographic`
* `Oceans`
* `OceansLabels`
* `Gray`
* `GrayLabels` - Labels to pair with the `Gray` base map
* `DarkGray`
* `DarkGrayLabels` - Labels to pair with the `DarkGray` base map
* `Imagery`
* `ImageryLabels` - Labels and political boundaries to pair with the `Imagery` basemap
* `ImageryTransportation` - A street map for pairing with the `Imagery` base map
* `ShadedRelief`
* `ShadedReliefLabels` - Labels for pairing with the `ShadedRelief` base map

### Options

`L.esri.TiledMapLayer` accepts all [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer-options) options.

### Methods

`L.esri.BasemapLayer` inherits all methods from [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer).

### Events

`L.esri.TiledMapLayer` fires all  [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) events.

### Example

```js
var map = L.map('map').setView([37.75,-122.45], 12);

L.esri.basemapLayer("Topographic").addTo(map);
```