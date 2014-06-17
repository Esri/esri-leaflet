---
title: Download
layout: markdown.hbs
class: no-sidebar
---

# Download

All builds of Esri Leaflet are availble for download on [GitHub](https://github.com/Esri/esri-leaflet/releases/).

<a href="https://github.com/Esri/esri-leaflet/releases/download/v0.0.1-beta.4-patch-1/esri-leaflet-0.0.1-beta.5.zip" class="btn">Current Release</a>
<a href="https://github.com/Esri/esri-leaflet/releases/" class="btn">Past Releases</a>

# CDN

Esri Leaflet is currently hosted on Amazon Cloudfront to make it easily available. After the beta period it will be available on [jsDelivr](http://www.jsdelivr.com/).

#### Standard Build

```xml
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet.js"></script>
```

#### Other Builds

```xml
<!-- Core Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet-core.js"></script>

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

| Feature | Standard | Core | MapService | FeatureLayer | Basemaps | ClusteredFeatureLayer | HeatmapFeatureLayer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Size - kb | 37.5kb | 7.7kb | 10.1kb | 21.3kb | 8.3kb | 3.2kb | 1.5kb |
| Size Gzipped - kb | 6.38kb | 1.6kb | 1.92kb | 4kb | 1.5kb | 0.6kb | 0.3kb |
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
