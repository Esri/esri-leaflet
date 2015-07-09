---
title: L.esri.Layers.BasemapLayer
layout: documentation.hbs
---

# {{page.data.title}}

Quickly access Esri published map tiles from ArcGIS Online or ArcGIS Server in Leaflet.

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
            <td><code class="nobr">L.esri.basemapLayer({{{param 'String' 'key'}}}, {{{param 'Object' 'options'}}})</code></td>
            <td><code>key</code> refers to the specific basemap you'd like to add. The <code>options</code> parameter can accept the same [options](http://leafletjs.com/reference.html#tilelayer) as `L.TileLayer`.</td>
        </tr>
    </tbody>
</table>

##### Basemaps

These maps have worldwide coverage at a variety of zoom levels.

* `Streets`
* `Topographic`
* `NationalGeographic`
* `Oceans`
* `Gray`
* `DarkGray`
* `Imagery`
* `ShadedRelief`
* `Terrain`

##### Optional Labels

These are optional layers that add extra text labels to the basemaps.

* `OceansLabels` - Labels to pair with the `Oceans` basemap
* `GrayLabels` - Labels to pair with the `Gray` basemap
* `DarkGrayLabels` - Labels to pair with the `DarkGray` basemap
* `ImageryLabels` - Labels including political boundaries to pair with the `Imagery` basemap
* `ImageryTransportation` - Street map labels for pairing with the `Imagery` basemap
* `ShadedReliefLabels` - Labels for pairing with the `ShadedRelief` base map
* `TerrainLabels` - Labels for pairing with the `Terrain` base map

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
