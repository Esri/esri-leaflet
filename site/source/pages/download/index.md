---
title: Download
layout: markdown.hbs
class: no-sidebar
---

# Download

All builds of Esri Leaflet are available for download on [GitHub](https://github.com/Esri/esri-leaflet/releases/).

<a href="https://github.com/Esri/esri-leaflet/releases/download/v0.0.1-beta.5/esri-leaflet-0.0.1-beta.5.zip" class="btn">Current Release</a>
<a href="https://github.com/Esri/esri-leaflet/releases/" class="btn">Past Releases</a>

# CDN

Esri Leaflet is currently hosted on Amazon Cloudfront to make it easily available. After the beta period it will be available on [jsDelivr](http://www.jsdelivr.com/).

#### Standard Build

```xml
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet.js"></script>
```

#### Other Builds

Esri Leaflet is also built into several smaller components and plugins for specific use cases these more specialized builds are available on the CDN.

```xml
<!-- Core Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet-core.js"></script>

<!-- Basemaps Only Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet-basemaps.js"></script>

<!-- Feature Layer Only Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet-feature-layer.js"></script>

<!-- Map Service Only Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet-map-service.js"></script>

<!-- Heatmap Feature Layer -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet-heatmap-feature-layer.js"></script>

<!-- Clustered Feature Layer -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet-clustered-feature-layer.js"></script>

<!-- Geocoding Control -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-geocoder/0.0.1-beta.3/esri-leaflet-geocoder.js"></script>
<link rel="stylesheet" type="text/css" href="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-geocoder/0.0.1-beta.3/esri-leaflet-geocoder.css">
```

# Builds

A summary of what features exist in which builds.

| Feature | Standard | Core | MapService | FeatureLayer | Basemaps | ClusteredFeatureLayer | HeatmapFeatureLayer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Size    | 37.5kb | 7.7kb | 11.8kb | 23kb | 8.3kb | 3.w2kb | 1.5kb |
| Gzipped | 6.38kb | 1.6kb | 2.23kb | 4.3kb | 1.5kb | 0.6kb | 0.3kb |
| `L.esri.Request` | &#10003; | &#10003; | &#10003; | &#10003; | &#10003; | | |
| `L.esri.Util` | &#10003; | &#10003; | &#10003; | &#10003; | | | |
| `L.esri.Services.Service` | &#10003; | &#10003; | &#10003; | &#10003; | | | |
| `L.esri.Services.MapService` | &#10003; | | &#10003; | | | | |
| `L.esri.Services.FeatureLayer` | &#10003; | | | &#10003; | | | |
| `L.esri.Tasks.Query` | &#10003; | | | &#10003; | | | |
| `L.esri.Tasks.Identify` | &#10003; | | &#10003; | | | | |
| `L.esri.Layers.FeatureLayer` | &#10003; | | | &#10003; | | | |
| `L.esri.Layers.DynamicMapLayer` | &#10003; | | &#10003; | | | | |
| `L.esri.Layers.TiledMapLayer` | &#10003; | | &#10003; | | | | |
| `L.esri.Layers.BasemapLayer` | &#10003; | | | | &#10003; | | |
| `L.esri.Layers.ClusteredFeatureLayer` | | | | | | &#10003; | |
| `L.esri.Layers.HeatMapFeatureLayer` | | | | | | | &#10003; |
