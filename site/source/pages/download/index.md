---
title: Download
layout: markdown.hbs
class: no-sidebar
---

# Download

All builds of Esri Leaflet are available for download on [GitHub](https://github.com/Esri/esri-leaflet/releases/).

<a href="https://github.com/Esri/esri-leaflet/releases/download/v1.0.0-rc.4/esri-leaflet-v1.0.0-rc.4.zip" class="btn">Current Release</a>
<a href="https://github.com/Esri/esri-leaflet/releases/" class="btn">Past Releases</a>

# NPM

Esri Leaflet is also [available on NPM](https://www.npmjs.org/package/esri-leaflet) and can be installed with the following command.

```bash
npm install esri-leaflet --save
```

# Bower

Esri Leaflet is also [available on Bower](http://bower.io/search/?q=esri-leaflet) and can be installed with the following command.

```bash
bower install esri-leaflet
```

# CDN

Esri Leaflet is currently hosted on Amazon Cloudfront to make it easily available. After the beta period it will be available on [jsDelivr](http://www.jsdelivr.com/).

#### Standard Build

```xml
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/1.0.0-rc.4/esri-leaflet.js"></script>
```

#### Other Builds

Esri Leaflet is also built into several smaller components and plugins for specific use cases these more specialized builds are available on the CDN.

```xml
<!-- Core Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/1.0.0-rc.4/esri-leaflet-core.js"></script>

<!-- Basemaps Only Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/1.0.0-rc.4/esri-leaflet-basemaps.js"></script>

<!-- Feature Layer Only Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/1.0.0-rc.4/esri-leaflet-feature-layer.js"></script>

<!-- Map Service Only Build -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/1.0.0-rc.4/esri-leaflet-map-service.js"></script>

<!-- Heatmap Feature Layer -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-heatmap-feature-layer/1.0.0-rc.2/esri-leaflet-heatmap-feature-layer.js"></script>

<!-- Clustered Feature Layer -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-clustered-feature-layer/1.0.0-rc.2/esri-leaflet-clustered-feature-layer.js"></script>

<!-- Geocoding Control -->
<script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-geocoder/0.0.1-beta.5/esri-leaflet-geocoder.js"></script>
<link rel="stylesheet" type="text/css" href="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-geocoder/1.0.0-rc.1/esri-leaflet-geocoder.css">
```

# Builds

A summary of what features exist in which builds.

| Feature                                | Standard | Core     | MapService | ImageService | FeatureLayer | Basemaps |
| -------------------------------------- | -------- | -------- | ---------- | ------------ | ------------ | -------- |
| Size                                   | 50.2kb   | 10.7kb   | 24.2kb     | 21.1kb       | 27.8kb       | 10.8kb   |
| Gzipped                                | 12.4kb   | 3.8kb    | 6.7kb      | 6.2kb        | 8.2kb        | 3.3kb    |
| `L.esri.Request`                       | &#10003; | &#10003; | &#10003;   | &#10003;     | &#10003;     | &#10003; |
| `L.esri.Util`                          | &#10003; | &#10003; | &#10003;   | &#10003;     | &#10003;     |          |
| `L.esri.Services.Service`              | &#10003; | &#10003; | &#10003;   | &#10003;     | &#10003;     |          |
| `L.esri.Services.MapService`           | &#10003; |          | &#10003;   |              |              |          |
| `L.esri.Services.FeatureLayer`         | &#10003; |          |            |              | &#10003;     |          |
| `L.esri.Tasks.Task `                   | &#10003; | &#10003; | &#10003;   | &#10003;     | &#10003;     |          |
| `L.esri.Tasks.Query`                   | &#10003; |          | &#10003;   | &#10003;     | &#10003;     |          |
| `L.esri.Tasks.Find`                    | &#10003; |          | &#10003;   |              |              |          |
| `L.esri.Tasks.IdentifyFeatures`        | &#10003; |          | &#10003;   |              |              |          |
| `L.esri.Tasks.IdentifyImage`           | &#10003; |          |            | &#10003;     |              |          |
| `L.esri.Layers.FeatureLayer`           | &#10003; |          |            |              | &#10003;     |          |
| `L.esri.Layers.ImageMapLayer`          | &#10003; |          |            | &#10003;     |              |          |
| `L.esri.Layers.DynamicMapLayer`        | &#10003; |          | &#10003;   |              |              |          |
| `L.esri.Layers.TiledMapLayer`          | &#10003; |          | &#10003;   |              |              |          |
| `L.esri.Layers.BasemapLayer`           | &#10003; |          |            |              |              | &#10003; |