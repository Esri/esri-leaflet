# Esri Leaflet

Leaflet plugins for [ArcGIS Services](http://developers.arcgis.com). Currently Esri Leaflet supports loading Esri [basemaps](http://esri.github.io/esri-leaflet/examples/switching-basemaps.html) and [feature services](http://esri.github.io/esri-leaflet/examples/simple-feature-layer.html), as well as [tiled](http://esri.github.io/esri-leaflet/examples/tile-layer-2.html) and [dynamic](http://esri.github.io/esri-leaflet/examples/simple-dynamic-map-layer.html) map services.

The goal of Esri Leaflet is **not** to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/), but rather to provide small components to allow developers to build mapping applications with Leaflet.

**Currently Esri Leaflet is in development and should be thought of as a beta or preview.**

### Demos
There are [loads of demos](http://patrickarlt.github.io/esri-leaflet/examples/) showing the features of Esri Leaflet that will help you get started.

### Example
Here is a quick example to get you started. Just change the paths to point to the proper libraries and go.

![App](https://raw.github.com/Esri/esri-leaflet/master/esri-leaflet.png)

```html
<!DOCTYPE html>
<html>
  <head>
     <!-- Load Leaflet from CDN-->
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

    <!-- Load Esri Leaflet from CDN -->
    <script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet.js"></script>

    <style>
      html, body,  #map {
        width : 100%;
        height : 100%;
      }
    </style>
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

### Documentation & Examples

A full [API Reference](http://esri.github.io/esri-leaflet/api-reference/) and plenty of [sample code](http://esri.github.io/esri-leaflet/examples/) can be found at the [Esri Leaflet](http://esri.github.io/esri-leaflet/) website.

### Projects Using Esri Leaflet

* [Geotrigger Editor](https://github.com/Esri/geotrigger-editor)
* [Geotrigger Faker](https://github.com/Esri/geotrigger-faker)
* [ArcGIS for Developers](https://developers.arcgis.com/en/)

Feel free to add your projects to this list!

### Development Instructions

Make Sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
5. Install the dependencies with `npm install`
5. run `grunt` from the command line. This will start the web server locally at [http://localhost:8001](http://localhost:8001) and start watching the source files and running linting and testing commands.
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Dependencies
* [Leaflet](http://leaflet.com) version 0.7 or higher is required.

### Optional Dependencies
* [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) - for `L.esri.ClusteredFeatureLayer`
* [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) - only for `L.esri.HeatmapLayer`.
* [Esri Leaflet Geocoder](https://github.com/Esri/esri-leaflet-geocoder) - for geocoding functionality.

### Resources

* [Importing Data Into Feature Services](https://developers.arcgis.com/tools/csv-to-feature-service/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [@Esri](http://twitter.com/esri)
* [@EsriPDX](http://twitter.com/esripdx)

### Issues

Find a bug or want to request a new feature?  Please let us know by submitting an [issue](https://github.com/Esri/esri-leaflet/issues).

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/esri-leaflet/blob/master/CONTRIBUTING.md).

### Credit

`L.esri.DymanicMapLayer` was originally code from https://github.com/sanborn/leaflet-ags/blob/master/src/AGS.Layer.Dynamic.js

### Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/esri-leaflet/master/license.txt) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet)
[](Esri Language: JavaScript)
