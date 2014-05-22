# Esri Leaflet

Leaflet plugin for [ArcGIS Services](http://developers.arcgis.com). Currently Esri Leaflet supports loading Esri [basemaps](#basemaplayer) and [feature services](#featurelayer), as well as [tiled](#tiledmaplayer) and [dynamic](#dynamicmaplayer) map services.

The goal of Esri Leaflet is **not** to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/), but rather to provide small components to allow developers to build mapping applications with Leaflet.

**Currently Esri Leaflet is in development and should be thought of as a beta or preview.**

### Demos
There are [loads of demos](http://esri.github.io/esri-leaflet/) showing the features of Esri Leaflet.

### Example
Here is a quick example to get you started. Just change the paths to point to the proper libraries and go.

![App](https://raw.github.com/Esri/esri-leaflet/master/esri-leaflet.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Esri Leaflet Demo</title>
    <link rel="stylesheet" href="/the/path/to/leaflet.css">
    <!--[if lte IE 8]><link rel="stylesheet" href="/the/path/to/leaflet.ie.css"><![endif]-->
    <style>
      html, body,  #map {
        width : 100%;
        height : 100%;
      }
    </style>
    <script src="/the/path/to/leaflet.js"></script>
    <script src="/the/path/to/esri-leaflet.js"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([45.528, -122.680], 13);

      L.esri.basemapLayer("Gray").addTo(map);

      var parks = new L.esri.FeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0", {
       style: function () {
          return { color: "#70ca49", weight: 2 };
        }
      }).addTo(map);

      var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";

      parks.bindPopup(function(feature){
        return L.Util.template(popupTemplate, feature.properties)
      });
    </script>
  </body>
</html>
```

## Documentation

@TODO

## Development Instructions

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
5. Install the dependancies with `npm install`
5. The examples in the `/examples` folder should work
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Dependencies
* [Leaflet](http://leaflet.com) version 0.7 or higher is required.

### Optional Dependencies
* [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) - for `L.esri.ClusteredFeatureLayer`
* [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) - only for `L.esri.HeatmapLayer`.

## Resources

* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [@Esri](http://twitter.com/esri)
* [@EsriPDX](http://twitter.com/esripdx)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Credit

`L.esri.DymanicMapLayer` was origninally code from https://github.com/sanborn/leaflet-ags/blob/master/src/AGS.Layer.Dynamic.js that was significantly modified.

## Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/esri-leaflet/master/license.txt) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet)
[](Esri Language: JavaScript)
