# Esri Leaflet

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![apache licensed](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/esri-leaflet/master/LICENSE)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/esri-leaflet/badge)](https://www.jsdelivr.com/package/npm/esri-leaflet)

[npm-img]: https://img.shields.io/npm/v/esri-leaflet.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/esri-leaflet
[travis-img]: https://img.shields.io/travis/Esri/esri-leaflet/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/esri-leaflet

[Leaflet](http://leafletjs.com/) plugins for working with a handful of the most popular [ArcGIS Service](http://developers.arcgis.com) types. This includes Esri [basemaps](http://esri.github.io/esri-leaflet/examples/switching-basemaps.html) and [feature services](http://esri.github.io/esri-leaflet/examples/simple-feature-layer.html), as well as [tiled](http://esri.github.io/esri-leaflet/examples/tile-layer-2.html) map, [dynamic](http://esri.github.io/esri-leaflet/examples/simple-dynamic-map-layer.html) map and [image](http://esri.github.io/esri-leaflet/examples/simple-image-map-layer.html)  services.

> This project is maintained with :heart: by folks spanning multiple teams within Esri, but we provide no guarantee of individual features, nor a traditional product lifecycle to support planning.

The goal of this project is **not** to replace the [ArcGIS API for JavaScript](https://developers.arcgis.com/en/javascript/) but rather to provide small components for *only some* aspects of the ArcGIS platform for developers who prefer to build mapping applications with [Leaflet](http://leafletjs.com/).

We are proud to facilitate a project which requires participation from our diverse user community in order to thrive and we welcome contributions from those [just getting their feet wet](https://github.com/Esri/esri-leaflet/issues/647) in open-source.

Support for [Geocoding](https://github.com/Esri/esri-leaflet-geocoder) services and [Geoprocessing](https://github.com/jgravois/esri-leaflet-gp) services, as well as service defined [rendering](https://github.com/esri/esri-leaflet-renderers) are available as well (via additional plugins).

> If you'd like to display Esri services in *any* Leaflet application, we ask that you adhere to our [Terms of Use](#terms) and attribution requirements.

## Table of Contents

- [Getting Started](#getting-started)
  - [Demos](#demos)
  - [Example](#example)
  - [API Reference](#api-reference)
  - [Additional Plugins](#additional-plugins)
  - [Frequently Asked Questions](#frequently-asked-questions)
  - [Issues](#issues)
  - [Dependencies](#dependencies)
- [Going Deeper](#going-deeper)
  - [Development Instructions](#development-instructions)
  - [Versioning](#versioning)
  - [Contributing](#contributing)
- [Terms](#terms)
- [Credit](#credit)
- [License](#license)

## Demos
We've shared lots of sample code showing off many of the features of Esri Leaflet.

http://esri.github.io/esri-leaflet/examples/

## Example
The easiest way to get started is to load Esri Leaflet via [CDN](https://unpkg.com/esri-leaflet). Here is an example you can copy/paste into your own `.html` file.

![App](https://raw.github.com/Esri/esri-leaflet/master/example.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Load Leaflet from CDN -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

    <!-- Load Esri Leaflet from CDN -->
    <script src="https://unpkg.com/esri-leaflet/dist/esri-leaflet.js"></script>

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
        url: "https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0",
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

## [API Reference](http://esri.github.io/esri-leaflet/api-reference/)

The source code for our documentation site can be found [here](https://github.com/Esri/esri-leaflet-doc). If you notice a typo or other problem, _please_ [let us know](https://github.com/Esri/esri-leaflet-doc/issues)!

## Additional Plugins

Many folks have written plugins to customize and extend Leaflet.

http://leafletjs.com/plugins.html

You can also pick and choose additional Esri Leaflet plugins.

http://esri.github.io/esri-leaflet/plugins/

## Frequently Asked Questions

* [What are the terms of use for ArcGIS Online services?](#terms)
* [What exactly is Esri Leaflet?  Is it a replacement for Leaflet?](https://github.com/Esri/esri-leaflet/wiki/FAQ#what-is-esri-leaflet)
* [Will Esri Leaflet replace the ArcGIS API for JavaScript?](https://github.com//Esri/esri-leaflet/wiki/FAQ#will-esri-leaflet-replace-the-arcgis-api-for-javascript)
* [What is the benefit of using Esri Leaflet over using Leaflet all by itself?](https://github.com//Esri/esri-leaflet/wiki/FAQ#why-use-esri-leaflet)
* [What are the goals of Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-are-the-goals-of-esri-leaflet)
* [Can I use Esri Leaflet with Leaflet Version 1.0.x?](https://github.com/Esri/esri-leaflet/wiki/FAQ#can-i-use-esri-leaflet-with-leaflet-version-10x)
* [How do you decide what features get included in Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#how-do-you-decide-what-features-get-included-in-esri-leaflet)
* [I have an idea! What should I do?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-have-an-idea-what-should-i-do)
* [When will you support "x"?](https://github.com//Esri/esri-leaflet/wiki/FAQ#when-will-you-support-x)
* [Can you implement feature "x"?](https://github.com//Esri/esri-leaflet/wiki/FAQ#can-you-implement-feature-x)
* [I want to contribute. How can I help?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-want-to-contribute-how-can-i-help)
* [I built something with Esri Leaflet can I show you?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-built-something-with-esri-leaflet-can-i-show-you)
* [I built a reusable component (layer type, api wrapper, ui control etc...) can I contribute it to Esri Leaflet?](https://github.com//Esri/esri-leaflet/wiki/FAQ#i-built-a-reusable-component-layer-type-api-wrapper-ui-control-etc-can-i-contribute-it-to-esri-leaflet)
* [Which services require authentication?](https://github.com//Esri/esri-leaflet/wiki/FAQ#which-services-require-authentication)
* [What are some good Leaflet Plugins?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-are-some-good-leaflet-plugins)
* [What browsers does Esri Leaflet support?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-browsers-does-esri-leaflet-support)
* [What versions of ArcGIS Server does Esri Leaflet support?](https://github.com//Esri/esri-leaflet/wiki/FAQ#what-versions-of-arcgis-server-does-esri-leaflet-support)
* [Upgrading the version of Esri Leaflet used in my app broke everything!](https://github.com//Esri/esri-leaflet/wiki/FAQ#upgrading-the-version-of-esri-leaflet-used-in-my-app-broke-everything)
* [Does Esri Leaflet support IE 'compatibility mode'?](https://github.com//Esri/esri-leaflet/wiki/FAQ#compatibility-mode)
* [I'm into TypeScript, but Esri Leaflet seems to be a vanilla JS thing. Can I find typings somewhere?](https://github.com//Esri/esri-leaflet/wiki/FAQ#typescript-typings)
* [When _exactly_ do I need to use a paid Esri developer account to deploy to production?](https://github.com//Esri/esri-leaflet/wiki/FAQ#deployment-plan)

## Issues

If something isn't working the way you expected, please take a look at [previously logged issues](https://github.com/Esri/esri-leaflet/issues?labels=FAQ&milestone=&page=1&state=closed) that resolve common problems first.  Have you found a new bug?  Want to request a new feature?  We'd love to hear from you.  Please let us know by submitting an [issue](https://github.com/Esri/esri-leaflet/issues).

If you're looking for help you can also post issues on [GIS Stackexchange](http://gis.stackexchange.com/questions/ask?tags=esri-leaflet,leaflet) and/or the [Esri Leaflet place](https://geonet.esri.com/discussion/create.jspa?sr=pmenu&containerID=1841&containerType=700&tags=esri-leaflet,leaflet) on GeoNet.

## Going Deeper

### Development Instructions

If you'd like to inspect and modify the source of Esri Leaflet, follow the instructions below to set up a local development environment.

1. [Fork and clone Esri Leaflet](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet` folder
3. Install the [`package.json`](https://github.com/Esri/esri-leaflet/blob/master/package.json#L14-L49) dependencies by running `npm install`
4. Run `npm start` from the command line. This will compile minified source in a brand new `dist` directory, launch a tiny webserver and begin watching the raw source for changes.
5. Run `npm test` to make sure you haven't introduced a new 'feature' accidentally.
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

### Dependencies

* Esri Leaflet [1.x](https://github.com/Esri/esri-leaflet/releases/tag/v1.0.4) (available on [CDN](https://unpkg.com/esri-leaflet@1.0.4)) can be used in apps alongside:
  *  [Leaflet](http://leafletjs.com) version 0.7.x.

* Esri Leaflet [2.x](https://github.com/Esri/esri-leaflet/releases/tag/v2.0.8) (available on [CDN](https://unpkg.com/esri-leaflet@2.0.8)) can be used in apps alongside:
  *  [Leaflet](http://leafletjs.com) version 1.x.

The `master` branch of this repository is *only* compatible with Leaflet 1.x.

### Versioning

For transparency into the release cycle and in striving to maintain backward compatibility, Esri Leaflet is maintained under Semantic Versioning guidelines and will adhere to these rules whenever possible.

For more information on SemVer, please visit <http://semver.org/>.

### Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/esri-leaflet/blob/master/CONTRIBUTING.md).

### Terms

If your app is for public, non-revenue generating, non-government, non-commercial use, the free [Essentials Developer Plan](https://developers.arcgis.com/pricing/) is sufficient. If you're going to generate revenue or are using the app for government or business purposes, you'll have to purchase one of the products below:

* ArcGIS [Pro](https://www.esri.com/en-us/arcgis/products/arcgis-pro/overview)
* ArcGIS [Online for Organizations](http://www.esri.com/software/arcgis/arcgisonline)
* ArcGIS [Enterprise](https://www.esri.com/en-us/arcgis/products/arcgis-enterprise/overview)
* ArcGIS [Online Deployment Plan](https://developers.arcgis.com/pricing/credits/) 

If you display an ArcGIS Online service in **any** Leaflet application, we require that you display Esri attribution and recognize data providers. Using this plugin, it couldn't be easier to follow the terms.  Just select your basemap and the appropriate credits will be displayed in Leaflet's own [Attribution control](http://leafletjs.com/reference.html#control-attribution) as users pan/zoom automatically.

```js
L.esri.basemapLayer('Topographic').addTo(map);
```

![attribution](https://raw.github.com/Esri/esri-leaflet/master/attribution.png)

If you need more than 1 million [map transactions](http://doc.arcgis.com/en/arcgis-online/reference/transaction-limits.htm) per month, please let us know.

* [Esri Attribution Requirements](https://developers.arcgis.com/terms/attribution/)
* [ArcGIS Online Terms of Use](https://developers.arcgis.com/terms/)
* [Licensing & Attribution](https://developers.arcgis.com/javascript/latest/guide/licensing/index.html)

### Credit

* `L.esri.DynamicMapLayer` originally used code from [AGS.Layer.Dynamic.js](https://github.com/sanborn/leaflet-ags/blob/master/src/AGS.Layer.Dynamic.js)
* `L.esri.TiledMapLayer` adapts some code from [arcgis-level-fixer](https://github.com/gisinc/arcgis-level-fixer)

### License

Copyright &copy; 2014-2018 Esri

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
