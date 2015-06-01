# Esri Leaflet

[![Build Status](https://travis-ci.org/Esri/esri-leaflet.svg)](https://travis-ci.org/Esri/esri-leaflet)

Leaflet plugins for [ArcGIS Services](http://developers.arcgis.com). Currently Esri Leaflet supports loading Esri [basemaps](http://esri.github.io/esri-leaflet/examples/switching-basemaps.html) and [feature services](http://esri.github.io/esri-leaflet/examples/simple-feature-layer.html), as well as [tiled](http://esri.github.io/esri-leaflet/examples/tile-layer-2.html) map, [dynamic](http://esri.github.io/esri-leaflet/examples/simple-dynamic-map-layer.html) map and [image](http://esri.github.io/esri-leaflet/examples/simple-image-map-layer.html)  services.

The goal of Esri Leaflet is **not** to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/), but rather to provide small components to allow developers to build mapping applications with Leaflet.

**Currently Esri Leaflet is in development and should be thought of as a beta or preview.**

### Demos
We've written [loads of demos](http://esri.github.io/esri-leaflet/examples/) showing many of the features of Esri Leaflet.

### Example
Here is a quick example to get you started. Just copy/paste into your own `.html` file and run.

![App](https://raw.github.com/Esri/esri-leaflet/master/esri-leaflet.png)

```html
<!DOCTYPE html>
<html>
  <head>
     <!-- Load Leaflet from CDN-->
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

    <!-- we encourage you to replace 'latest' with a hardcode version number (like '1.0.0-rc.7') in production applications -->
    <script src="//cdn.jsdelivr.net/leaflet.esri/latest/esri-leaflet.js"></script>

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

### Development Roadmap

If you are interested in contributing to Esri Leaflet or seeing what is coming up next check out the [development roadmap](https://github.com/Esri/esri-leaflet/wiki/Roadmap).

### Issues

Find a bug or want to request a new feature?  Please let us know by submitting an [issue](https://github.com/Esri/esri-leaflet/issues).

Please take a look at [previously logged issues](https://github.com/Esri/esri-leaflet/issues?labels=FAQ&milestone=&page=1&state=closed) that resolve common problems.

You can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-leaflet,leaflet) an/or the [Esri Leaflet place](https://geonet.esri.com/discussion/create.jspa?sr=pmenu&containerID=1841&containerType=700&tags=esri-leaflet,leaflet) on GeoNet.

### Frequently Asked Questions

* [What exactly is Esri Leaflet?  Is it a replacement for Leaflet?](https://github.com/Esri/esri-leaflet/wiki/FAQ#what-is-esri-leaflet)
* [Will Esri Leaflet replace the ArcGIS API for JavaScript?](https://github.com//Esri/esri-leaflet/wiki/FAQ#will-esri-leaflet-replace-the-arcgis-api-for-javascript)
* [What is the benefit of using Esri Leaflet over using Leaflet all by itself?](https://github.com//Esri/esri-leaflet/wiki/FAQ#why-use-esri-leaflet)
* [What are the goals of Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-are-the-goals-of-esri-leaflet)
* [When will Esri Leaflet leave beta?](https://github.com//Esri/esri-leaflet/wiki/FAQ#when-will-esri-leaflet-leave-beta)
* [How do you decide what features get included in Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#how-do-you-decide-what-features-get-included-in-esri-leaflet)
* [I have an idea! What should I do?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-have-an-idea-what-should-i-do)
* [When will you support "x"?](https://github.com//Esri/esri-leaflet/wiki/FAQ#when-will-you-support-x)
* [Can you implement feature "x"?](https://github.com//Esri/esri-leaflet/wiki/FAQ#can-you-implement-feature-x)
* [When will feature "x" get done?](https://github.com//Esri/esri-leaflet/wiki/FAQ#when-will-feature-x-get-done)
* [I want to contribute. How can I help?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-want-to-contribute-how-can-i-help)
* [I built something with Esri Leaflet can I show you?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-built-something-with-esri-leaflet-can-i-show-you)
* [I built a reusable component (layer type, api wrapper, ui control ect...) can I contribute it to Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-built-a-reusable-component-layer-type-api-wrapper-ui-control-ect-can-i-contribute-it-to-esri-leaflet)
* [What are the terms of use for Esri map tiles?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-are-the-terms-of-use-for-esri-map-tiles)
* [Which services require authentication?](https://github.com//Esri/esri-leaflet/wiki/FAQ#which-services-require-authentication)
* [What are some good Leaflet Plugins?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-are-some-good-leaflet-plugins)
* [What browsers does Esri Leaflet support?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-browsers-does-esri-leaflet-support)
* [What versions of ArcGIS Server does Esri Leaflet support?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-versions-of-arcgis-server-does-esri-leaflet-support)

### Projects Using Esri Leaflet

* [Geotrigger Editor](https://github.com/Esri/geotrigger-editor)
* [Geotrigger Faker](https://github.com/Esri/geotrigger-faker)
* [ArcGIS for Developers](https://developers.arcgis.com/en/)

Feel free to add your own project to this list!

### Development Instructions

In order to compile the API yourself and/or run the tests, make sure you have the [Grunt CLI](http://gruntjs.com/getting-started) installed.

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
5. Install the dependencies with `npm install`
5. run `grunt` from the command line. This will start the web server locally at [http://localhost:8001](http://localhost:8001) and start watching the source files and running linting and testing commands.
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request) if you'd like to contribute

### Dependencies

* [Leaflet](http://leafletjs.com) version 0.7 or higher is required but the latest version is recommended.

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, Esri Leaflet is maintained under the Semantic Versioning guidelines and will adhere to these rules whenever possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility **bumps the major** while resetting minor and patch
* New additions without breaking backward compatibility **bumps the minor** while resetting the patch
* Bug fixes and misc changes **bumps only the patch**

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/esri-leaflet/blob/master/CONTRIBUTING.md).

### Credit

* `L.esri.Layers.DynamicMapLayer` originally used code from https://github.com/sanborn/leaflet-ags/blob/master/src/AGS.Layer.Dynamic.js
* `L.esri.Layers.TiledMapLayer` adapts some code from https://github.com/gisinc/arcgis-level-fixer

### Licensing
Copyright 2015 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet)
[](Esri Language: JavaScript)
