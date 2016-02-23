# Esri Leaflet

[![Build Status](https://travis-ci.org/Esri/esri-leaflet.svg?branch=master)](https://travis-ci.org/Esri/esri-leaflet)

[Leaflet](http://leafletjs.com/) plugins for working with a handful of the most popular [ArcGIS Service](http://developers.arcgis.com) types. This includes Esri [basemaps](http://esri.github.io/esri-leaflet/examples/switching-basemaps.html) and [feature services](http://esri.github.io/esri-leaflet/examples/simple-feature-layer.html), as well as [tiled](http://esri.github.io/esri-leaflet/examples/tile-layer-2.html) map, [dynamic](http://esri.github.io/esri-leaflet/examples/simple-dynamic-map-layer.html) map and [image](http://esri.github.io/esri-leaflet/examples/simple-image-map-layer.html)  services.  

> Esri Leaflet is maintained with :heart: by folks spanning multiple teams within Esri, but we provide no guarantee of individual features, nor a traditional product lifecycle to support planning.  

The goal of this project is **not** to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/) but rather to provide small components for *only some* aspects of the ArcGIS platform for developers who prefer to build mapping applications with [Leaflet](http://leafletjs.com/).

We are proud to facilitate a project which requires participation from our diverse user community in order to thrive and we welcome contributions from those [just getting their feet wet](https://github.com/Esri/esri-leaflet/issues/647) in open-source.

Support for [Geocoding](https://github.com/Esri/esri-leaflet-geocoder) services and [Geoprocessing](https://github.com/jgravois/esri-leaflet-gp) services, as well as service defined [rendering](https://github.com/esri/esri-leaflet-renderers) are available as well (via additional plugins).

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
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v1.0.0-beta.2/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet/v1.0.0-beta.2/leaflet.js"></script>

    <!-- Load Esri Leaflet locally, after cloning this repository -->
    <script src="http://cdn.jsdelivr.net/leaflet.esri/2.0.0-beta.7/esri-leaflet.js"></script>

    <style>
      html, body, #map {
        margin:0; padding:0;  width : 100%; height : 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([45.528, -122.680], 13);

      L.esri.basemapLayer("Gray").addTo(map);

      var parks = L.esri.featureLayer({
        url: "http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0",
        style: function () {
          return { color: "#70ca49", weight: 2 };
        }
      }).addTo(map);

      var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";

      parks.bindPopup(function(e){
        return L.Util.template(popupTemplate, e.feature.properties)
      });
    </script>
  </body>
</html>
```

### Documentation & Examples

A full [API Reference](http://esri.github.io/esri-leaflet/api-reference/) and plenty of [sample code](http://esri.github.io/esri-leaflet/examples/) can be found at the [Esri Leaflet](http://esri.github.io/esri-leaflet/) website.  The source code for the site can be found [here](https://github.com/Esri/esri-leaflet-doc).

### Development Roadmap

If you are interested in contributing to Esri Leaflet or seeing what is coming up next check out the [development roadmap](https://github.com/Esri/esri-leaflet/wiki/Roadmap).

### Issues

Find a bug or want to request a new feature?  Please let us know by submitting an [issue](https://github.com/Esri/esri-leaflet/issues).

Please take a look at [previously logged issues](https://github.com/Esri/esri-leaflet/issues?labels=FAQ&milestone=&page=1&state=closed) that resolve common problems.

You can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-leaflet,leaflet) and/or the [Esri Leaflet place](https://geonet.esri.com/discussion/create.jspa?sr=pmenu&containerID=1841&containerType=700&tags=esri-leaflet,leaflet) on GeoNet.

Did you notice a problem with the Esri Leaflet website?  Please [let us know](https://github.com/Esri/esri-leaflet-doc/issues)!

### Frequently Asked Questions

* [What exactly is Esri Leaflet?  Is it a replacement for Leaflet?](https://github.com/Esri/esri-leaflet/wiki/FAQ#what-is-esri-leaflet)
* [Will Esri Leaflet replace the ArcGIS API for JavaScript?](https://github.com//Esri/esri-leaflet/wiki/FAQ#will-esri-leaflet-replace-the-arcgis-api-for-javascript)
* [What is the benefit of using Esri Leaflet over using Leaflet all by itself?](https://github.com//Esri/esri-leaflet/wiki/FAQ#why-use-esri-leaflet)
* [What are the goals of Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-are-the-goals-of-esri-leaflet)
* [Can I use Esri Leaflet with Leaflet Version 1.0.0-beta1?](https://github.com//Esri/esri-leaflet/wiki/FAQ#can-i-use-esri-leaflet-with-leaflet-version-100-beta1)
* [How do you decide what features get included in Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#how-do-you-decide-what-features-get-included-in-esri-leaflet)
* [I have an idea! What should I do?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-have-an-idea-what-should-i-do)
* [When will you support "x"?](https://github.com//Esri/esri-leaflet/wiki/FAQ#when-will-you-support-x)
* [Can you implement feature "x"?](https://github.com//Esri/esri-leaflet/wiki/FAQ#can-you-implement-feature-x)
* [When will feature "x" get done?](https://github.com//Esri/esri-leaflet/wiki/FAQ#when-will-feature-x-get-done)
* [I want to contribute. How can I help?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-want-to-contribute-how-can-i-help)
* [I built something with Esri Leaflet can I show you?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-built-something-with-esri-leaflet-can-i-show-you)
* [I built a reusable component (layer type, api wrapper, ui control etc...) can I contribute it to Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-built-a-reusable-component-layer-type-api-wrapper-ui-control-etc-can-i-contribute-it-to-esri-leaflet)
* [What are the terms of use for Esri map tiles?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-are-the-terms-of-use-for-esri-map-tiles)
* [Which services require authentication?](https://github.com//Esri/esri-leaflet/wiki/FAQ#which-services-require-authentication)
* [What are some good Leaflet Plugins?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-are-some-good-leaflet-plugins)
* [What browsers does Esri Leaflet support?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-browsers-does-esri-leaflet-support)
* [What versions of ArcGIS Server does Esri Leaflet support?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-versions-of-arcgis-server-does-esri-leaflet-support)
* [Upgrading the version of Esri Leaflet used in my app broke everything!](https://github.com//Esri/esri-leaflet/wiki/FAQ#upgrading-the-version-of-esri-leaflet-used-in-my-app-broke-everything)

### Projects Using Esri Leaflet

* [Geotrigger Editor](https://github.com/Esri/geotrigger-editor)
* [Geotrigger Faker](https://github.com/Esri/geotrigger-faker)
* [ArcGIS for Developers](https://developers.arcgis.com/en/)

Feel free to add your own project to this list!

### Development Instructions

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
3. Install the dependencies with `npm install`
4. Run `npm run serve` from the command line. This will compile minified source in a brand new `dist` directory, launch a tiny webserver and begin watching the raw source for changes.
5. Run `npm test` to make sure you haven't introduced a new 'feature' accidently.
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)
7. If you're interested in playing around with our website locally, just make sure you have [GruntCLI](http://gruntjs.com/getting-started) installed and run `grunt`.  This will start the web server locally at [http://localhost:8001](http://localhost:8001) and start watching the website source files for changes.

### Dependencies

* Esri Leaflet [1.x](https://github.com/Esri/esri-leaflet/releases/tag/v1.0.2) (available on [CDN](https://cdn.jsdelivr.net/leaflet.esri/1.0.2/esri-leaflet.js)) can be used in apps alongside:
  *  [Leaflet](http://leafletjs.com) version 0.7.x.

* Esri Leaflet [2.x](https://github.com/Esri/esri-leaflet/releases/tag/v2.0.0-beta.5) (available on [CDN](https://cdn.jsdelivr.net/leaflet.esri/2.0.0-beta.7/esri-leaflet.js)) can be used in apps alongside:
  *  [Leaflet](http://leafletjs.com) version 1.0.0-beta2.

The `master` branch of this repository is only compatible with Leaflet 1.0.x.

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

* `L.esri.DynamicMapLayer` originally used code from [AGS.Layer.Dynamic.js](https://github.com/sanborn/leaflet-ags/blob/master/src/AGS.Layer.Dynamic.js)
* `L.esri.TiledMapLayer` adapts some code from [arcgis-level-fixer](https://github.com/gisinc/arcgis-level-fixer)

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
