# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][unreleased]

## [3.0.17] - 2025-06-25

### Fixed

- Wrong initial tile set zoom level for tileLayer with custom LODs ([#1400](https://github.com/Esri/esri-leaflet/pull/1400))

## [3.0.16] - 2025-05-01

### Changed

- Changed code formatting from Semistandard to Prettier and ESLint ([#1408](https://github.com/Esri/esri-leaflet/pull/1408))

## [3.0.15] - 2025-04-07

### Fixed

- `apikey` property on TiledMapLayer ([#1407](https://github.com/Esri/esri-leaflet/pull/1407))

## [3.0.14] - 2024-12-17

### Added

- Export the Esri attribution string for other layer types to use ([#1397](https://github.com/Esri/esri-leaflet/pull/1397))

## [3.0.13] - 2024-10-25

### Fixed

- Removed usage of `toLatLngBounds` to improve usage of Esri Leaflet with ESM CDNs. ([#1394](https://github.com/Esri/esri-leaflet/pull/1394))

### Changed

- Updated dependencies ([#1382](https://github.com/Esri/esri-leaflet/pull/1382))

## [3.0.12] - 2023-11-27

### Fixed

- Added `removeEsriAttribution` to be exported ([#1379](https://github.com/Esri/esri-leaflet/pull/1379))
- Fixed issue in `TiledMapLayer` when `LOD` is `0` ([#1381](https://github.com/Esri/esri-leaflet/pull/1381))
- Fixed apostrophe URL encoding ([#1377](https://github.com/Esri/esri-leaflet/pull/1377))

## [3.0.11] - 2023-08-07

### Fixed

- Fixed issue with attribution prefix consistency ([#1366](https://github.com/Esri/esri-leaflet/pull/1366))

## [3.0.10] - 2023-01-17

### Fixed

- Fixed issue with popups when using Leaflet v1.9.3 ([#1350](https://github.com/Esri/esri-leaflet/pull/1350))

### Changed

- Updated dependencies ([#1351](https://github.com/Esri/esri-leaflet/pull/1351))

## [3.0.9] - 2022-12-09

### Fixed

- Fixed performance issue with refreshing features ([#1346](https://github.com/Esri/esri-leaflet/pull/1346))

## [3.0.8] - 2022-04-08

### Fixed

- Fixed warning in Leaflet v1.8.0 ([#1325](https://github.com/Esri/esri-leaflet/pull/1325))

### Changed

- Updated development tooling:
  - updated Semistandard ([#1319](https://github.com/Esri/esri-leaflet/pull/1319), [#1320](https://github.com/Esri/esri-leaflet/pull/1320), [#1321](https://github.com/Esri/esri-leaflet/pull/1321), [#1322](https://github.com/Esri/esri-leaflet/pull/1322))
  - switched from `watch` to `chokidar` ([#1324](https://github.com/Esri/esri-leaflet/pull/1324))
  - switched to rollup-plugin-terser ([#1316](https://github.com/Esri/esri-leaflet/pull/1316)).

## [3.0.7] - 2022-02-24

### Fixed

- Include `siteData.json` in NPM release ([#1317](https://github.com/Esri/esri-leaflet/pull/1317)).

## [3.0.6] - 2022-02-23

### Fixed

- Include `siteData.json` in NPM release (414e060d44bf2be30baaa4fe2e94021c7a1c99a1).

## [3.0.5] - 2022-02-23

### Added

- `siteInfo.json` generation as part of the release ([#1313](https://github.com/Esri/esri-leaflet/pull/1313))

### Fixed

- `FeatureLayer.refresh()` fixed for layers where `simplifyFactor` is not set ([#1304](https://github.com/Esri/esri-leaflet/pull/1304))

### Changed

- Updated dependencies ([#1314](https://github.com/Esri/esri-leaflet/pull/1314))

## [3.0.4] - 2021-12-06

### Fixed

- Feature Layer fixes: `addFeature` event fixed and `eachActiveFeature` should now respect minZoom/maxZoom ([#1301](https://github.com/Esri/esri-leaflet/pull/1301))

## [3.0.3] - 2021-09-24

### Changed

- Added a deprecation warning when using `L.esri.BasemapLayer` ([info](https://esri.github.io/esri-leaflet/api-reference/layers/basemap-layer.html)). This warning can be disabled by setting the `ignoreDeprecationWarning` option to `true`. ([#1293](https://github.com/Esri/esri-leaflet/pull/1293)).
- Updated dependencies ([#1276](https://github.com/Esri/esri-leaflet/pull/1276))

## [3.0.2] - 2021-05-24

### Fixed

- Do not use named exports from JSON ([info](https://webpack.js.org/migrate/5/#cleanup-the-code)) (🙏destus90🙏 [#1273](https://github.com/Esri/esri-leaflet/pull/1273))

## [3.0.1] - 2021-02-23

### Fixed

- Ensure that `TiledMapLayer` will complete its `onRemove` prototype logic after removing its attribution. ([#1256](https://github.com/Esri/esri-leaflet/issues/1256))

## [3.0.0] - 2021-01-25

### Added

- `apikey` method on L.esri.Task
- `apikey` property on L.esri.FeatureLayer

## [2.5.3] - 2021-01-06

### Fixed

- Fix error (introduced in v2.5.2) that happens when the map attribution control is not present (🙏avinmathew🙏 [#1252](https://github.com/Esri/esri-leaflet/pull/1252))

### Changed

- REST calls will now use `inSR` instead of `inSr` ([#1251](https://github.com/Esri/esri-leaflet/pull/1251))

## [2.5.2] - 2020-12-29

### Fixed

- When esri-leaflet layers are removed from the map, the attribution will be removed ([#1248](https://github.com/Esri/esri-leaflet/pull/1248))

## [2.5.1] - 2020-10-04

### Added

- Support 'withCredentials' option (🙏luiscamachopt🙏 [#1233](https://github.com/Esri/esri-leaflet/pull/1233))
- Support 'fetchAllFeatures' option (🙏francharbo🙏 [#1229](https://github.com/Esri/esri-leaflet/pull/1229))

## [2.5.0] - 2020-08-06

### Fixed

- Fix Error on cellEnter (🙏francharbo🙏 [#1204](https://github.com/Esri/esri-leaflet/pull/1204))
- Fix bugs with feature layer setWhere ([#1211](https://github.com/Esri/esri-leaflet/pull/1211))
- MinZoom issue - do not clear \_currentSnapshot when hiding the layer ([#1212](https://github.com/Esri/esri-leaflet/pull/1212))
- ImageMapLayer - proxy support now works when `f:image` ([#1221](https://github.com/Esri/esri-leaflet/pull/1221))
- DynamicMapLayer - proxy support now works when `f:image` ([#1220](https://github.com/Esri/esri-leaflet/pull/1220))
- FeatureLayer issues when `refresh()` was called ([#1224](https://github.com/Esri/esri-leaflet/pull/1224))
- Issues when `addFeatures()` (or `updateFeatures()`) then `setWhere()` was called ([#1226](https://github.com/Esri/esri-leaflet/pull/1226))

### Changed

- `DynamicMapLayer` now defaults to using `format: 'png32'` instead of `'png24'`. (🙏pmacMaps🙏 [#1202](https://github.com/Esri/esri-leaflet/pull/1202), [#1187](https://github.com/Esri/esri-leaflet/issues/1187))
- Reverted the functionality that allowed over-zooming with the Imagery basemap in certain areas of the world due to bugs that were caused by that change ([#1223](https://github.com/Esri/esri-leaflet/pull/1223))

## [2.4.1] - 2020-05-19

### Fixed

- Fixed ES5 issue ([#1201](https://github.com/Esri/esri-leaflet/pull/1201))

## [2.4.0] - 2020-04-22

### Fixed

- Updated `request` to be imported in `BasemapLayer.js` rather than relying on global `L.esri`. (🙏danieloliveira117🙏 [#1191](https://github.com/Esri/esri-leaflet/issues/1191))

### Changed

- Updated `FeatureLayer` allowing queries to be consistently cached both on the server and on ArcGIS Online CDN. This should result in a decent performance boost for most use cases and in some cases (public, non-editable data) a significant performance boost. [#1189](https://github.com/Esri/esri-leaflet/pull/1189).
- use `@terraformer/arcgis` (instead of `@esri/arcgis-to-geojson-utils`) to generate GeoJSON from older ArcGIS services [#1194](https://github.com/Esri/esri-leaflet/pull/1194).

## [2.3.3] - 2020-01-29

### Fixed

- Ensure `DynamicMapLayer` can use both a token and `f: 'image'`. ([#1180](https://github.com/Esri/esri-leaflet/issues/1180))

## [2.3.2] - 2019-11-13

### Fixed

- Time filtering fix which adds a case for when a feature's time range contains the time range given in the to and from options for the layer. (🙏pjbiogit🙏 [#1174](https://github.com/Esri/esri-leaflet/pull/1174))

## [2.3.1] - 2019-10-10

### Fixed

- `?undefined` issue when using DynamicMapLayer and Proxy ([#1164](https://github.com/Esri/esri-leaflet/pull/1164))

### Changed

- REST calls will now use `outSR` instead of `outSr` ([#1168](https://github.com/Esri/esri-leaflet/pull/1168))

## [2.3.0] - 2019-07-17

### Fixed

- Time filtering fix (🙏pjbiogit🙏 [#1156](https://github.com/Esri/esri-leaflet/issues/1156))

### Changed

- dynamically resample Esri World Imagery (🙏jgravois🙏 [#1011](https://github.com/Esri/esri-leaflet/pull/1011))
- 'loading' event fired immediately before /export is called (🙏ogix🙏 [#1146](https://github.com/Esri/esri-leaflet/issues/1146))
- warning if `setTimeRange()` is called without a `timeField` ([#1148](https://github.com/Esri/esri-leaflet/issues/1148))

## [2.2.4] - 2019-03-20

### Fixed

- ensure a CORS request is made to fetch dynamic attribution for Esri basemaps instead of a JSONP request. (🙏jubasse🙏 [#1142](https://github.com/Esri/esri-leaflet/issues/1142))
- make sure webpack clients can access the ES source. ([#1134](https://github.com/Esri/esri-leaflet/issues/1134))
- ensure `basemapLayer` honors a proxy if one is set. (🙏dangowans🙏 [#1122](https://github.com/Esri/esri-leaflet/pull/1122))
- resolve devDependency security vulnerabilities (🙏gavinr🙏 [#1126](https://github.com/Esri/esri-leaflet/pull/1126))

## [2.2.3] - 2018-08-16

### Fixed

- ensure `ImageMapLayer` leverages a proxy. (🙏dangowans🙏 [#1121](https://github.com/Esri/esri-leaflet/pull/1121))

## [2.2.2] - 2018-08-02

### Fixed

- trapped an error when Map.attribution control is _not_ loaded.

### Added

- `dynamicMapLayer()` and `imageMapLayer()` now both expose a new `zIndex` constructor option and modify `zIndex` values appropriately internally when `bringToFront()` and `bringToBack()` are called. (🙏appleshowc🙏 [#1084](https://github.com/Esri/esri-leaflet/pull/1084))

## [2.2.1] - 2018-07-11

### Fixed

- resolved issue that caused _some_ raw ES6 files to not be bundled on npm.

## [2.2.0] - 2018-07-08

### Added

- it is now possible to add/update features in feature services in bulk (🙏Biboba🙏 [#1083](https://github.com/Esri/esri-leaflet/pull/1083))
- two new basemaps! `ImageryFirefly` and `Physical` (🙏pmacMaps🙏 [#1100](https://github.com/Esri/esri-leaflet/pull/1100))

### Changed

- use external sourcemap files consistently, even for debug build [#1088](https://github.com/Esri/esri-leaflet/pull/1088)

### Fixed

- better error trapping for non CORS requests (🙏strajuser🙏 [#1070](https://github.com/Esri/esri-leaflet/pull/1070))
- trap for GeoJSON with null geometry [#1060](https://github.com/Esri/esri-leaflet/issues/1060)
- check for null attribution (🙏octavm🙏 [#1078](https://github.com/Esri/esri-leaflet/pull/1078))
- ensure `token` is only included in tile requests once (🙏octavm🙏 [#1092](https://github.com/Esri/esri-leaflet/pull/1092))
- addressed <https://nodesecurity.io/advisories/566> [#1094](https://github.com/Esri/esri-leaflet/pull/1094)

### Removed

- cruft from npm tarball [#1067](https://github.com/Esri/esri-leaflet/pull/1067)

## [2.1.4] - 2018-03-09

### Changed

- upgraded to Rollup `v0.56.5`
- upgraded to @esri/arcgis-to-geojson-utils `v1.1.1`

### Fixed

- ensure tiledMapLayers utilize a configured proxy (🙏spoilsportmotors🙏 [#1053](https://github.com/Esri/esri-leaflet/pull/1053))

- fix logic error and simplify check for supported non-web mercator CRSs [#1051](https://github.com/Esri/esri-leaflet/pull/1051)

## [2.1.3] - 2018-02-14

### Added

- new `ImageryClarity` basemapLayer (🙏Biboba🙏 [#1047](https://github.com/Esri/esri-leaflet/pull/1047))
- dynamic attribution for `WorldImagery` basemap layer to attribute local Community Maps content providers

### Fixed

- smarter check for custom coordinate systems [#1045](https://github.com/Esri/esri-leaflet/pull/1045))
- removed rogue `Proj4` console errors in webpack/browserify apps
- caught the last few non ES6 imports from Leaflet (🙏finneganh🙏 [#1050](https://github.com/Esri/esri-leaflet/pull/1050))

## [2.1.2] - 2018-01-04

### Fixed

- improved support for custom `wkid:3857` tiled basemaps with custom properties [#1039](https://github.com/Esri/esri-leaflet/pull/1039))
- `image` is now the default format for ImageMapLayer (🙏nickpeihl🙏 [#998](https://github.com/Esri/esri-leaflet/pull/998))
- improved response parsing when no objectIdFieldName or esriFieldTypeOID are returned (🙏Saulzi🙏 [#1009](https://github.com/Esri/esri-leaflet/pull/1009))
- improved cleanup when map instances are destroyed (🙏jfolds🙏 [#1029](https://github.com/Esri/esri-leaflet/pull/1029))

### Added

- It is now possible for layers to pass through arbitrary custom request parameters (🙏Biboba🙏 [#1036](https://github.com/Esri/esri-leaflet/pull/1036))
- `QueryTask.returnM(bool)` (🙏jmfolds🙏 [#1002](https://github.com/Esri/esri-leaflet/pull/1002))
- `QueryTask.distinct()` (🙏joelondon🙏 [#1027](https://github.com/Esri/esri-leaflet/pull/1027))
- `DynamicMapLayer` has a new `popup` constructor option so that custom IdentifyFeatures parameters can be passed through (🙏Biboba🙏 [#1031](https://github.com/Esri/esri-leaflet/pull/1031))
- more tests for existing features! (🙏Biboba🙏 #1037, #1035)

### Removed

- unused `shallowClone` utility method

## [2.1.1] - 2017-08-11

### Fixed

- made Leaflet a peerDependency so that folks using WebPack can install v1.1.x without problems or duplication in their bundles
- added `UTF 8` to L.esri.request headers

### Changed

- now using `npm-run-all` for concurrent, cross platform script running

## [2.1.0] - 2017-07-27

### Added

- error handling has been added to classes that extend L.ImageOverlay [#941](https://github.com/Esri/esri-leaflet/pull/941) thank you[@Saulzi](https://github.com/Saulzi)!
- dynamicMapLayer now supports an option to bust server side caches [#942](https://github.com/Esri/esri-leaflet/issues/942)
- identifyFeatures and find now support requesting unformatted responses from ArcGIS Server 10.5+ map services [#961](https://github.com/Esri/esri-leaflet/issues/961)
- identifyFeatures now supports passing through input geometries other than points [#962](https://github.com/Esri/esri-leaflet/pull/962) thank you[@bbehling](https://github.com/bbehling)!
- dynamicMapLayer and imageMapLayer now support polar projections [#975](https://github.com/Esri/esri-leaflet/pull/975) thank you[@scaddenp](https://github.com/scaddenp)!
- query now supports datum transformations [#976](https://github.com/Esri/esri-leaflet/pull/976)

### Fixed

- in imageMapLayer, noData values of `0` are now handled correctly [#946](https://github.com/Esri/esri-leaflet/issues/946)
- ensure that eachActiveFeature correctly handles all geometry types [#948](https://github.com/Esri/esri-leaflet/issues/948)
- layer definitions are now passed through when binding a popup to dynamicMapLayer [#957](https://github.com/Esri/esri-leaflet/issues/957)
- ensure definition queries are applied to invisible layers [#964](https://github.com/Esri/esri-leaflet/pull/964) thank you[@jordanparfitt](https://github.com/jordanparfitt)!

## [2.0.8] - 2017-02-28

### Changed

- dynamicMapLayer popups now retrieve generalized geometries from map services to improve performance. [#921](https://github.com/Esri/esri-leaflet/pull/921)
- queries for features are no longer fired outside the layer's artificially constrained zoom level [#928](https://github.com/Esri/esri-leaflet/pull/928) (thank you[@keithpower](https://github.com/keithpower)!)
- ES6 syntax is now used to import selected Leaflet dependencies. [#920](https://github.com/Esri/esri-leaflet/pull/920)

### Fixed

- errors are no longer encountered when panning the map outside the artificially constrained zoom level of a previously drawn dynamicMapLayer [#917](https://github.com/Esri/esri-leaflet/pull/917) (thank you[@jordanparfitt](https://github.com/jordanparfitt)!)
- the value range returned by `IdentifyFeatures.simplify()` has been reversed for consistency with `Query.simplify()` [#921](https://github.com/Esri/esri-leaflet/pull/921)
- features are no longer accidentally drawn when the map is panned to a new location outside the artificially constrained zoom level of the layer. [#924](https://github.com/Esri/esri-leaflet/pull/924) (thank you[@keithpower](https://github.com/keithpower)!)

### Added

- In situations where a feature layer supports the geojson format, but it is deemed preferable to ask for Esri Geoservices JSON instead, developers can now set `isModern: false` as a constructor option. [#935](https://github.com/Esri/esri-leaflet/pull/935) (thank you[@spoilsportmotors](https://github.com/spoilsportmotors)!)
- an `eachActiveFeature()` method has been added to `Layers.FeatureLayer` in order to isolate features in the cache that are currently being displayed. [#936](https://github.com/Esri/esri-leaflet/pull/936)
- `Tasks.Query` now has two new spatial operators. `bboxIntersects` and `indexIntersects`. [#937](https://github.com/Esri/esri-leaflet/pull/937)

## [2.0.7] - 2017-01-10

### Fixed

- its now possible to call setOpacity() immediately after instantiating a `RasterLayer` [#909](https://github.com/Esri/esri-leaflet/pull/909) (thank you[@Saulzi](https://github.com/Saulzi)!)
- `L.TileLayer` maxNativeZoom is now honored by `tiledMapLayer` [#904](https://github.com/Esri/esri-leaflet/pull/904)
- an error is no longer thrown when a `RasterLayer` is added to the map at a zoom level outside its own custom restraint [#903](https://github.com/Esri/esri-leaflet/pull/903)
- `addfeature` is no longer emitted twice when `FeatureLayer.setWhere()` is called [#893](https://github.com/Esri/esri-leaflet/pull/893)

### Changed

- `RasterLayer` now exposes a public `redraw()` method [#905](https://github.com/Esri/esri-leaflet/pull/905)
- an inline base64 encoded transparent image is now substituted for missing tiles [#902](https://github.com/Esri/esri-leaflet/pull/902)
- the `addfeature` event is no longer triggered when features are fetched and drawn for the very first time [#893](https://github.com/Esri/esri-leaflet/pull/893)

## [2.0.6] - 2016-11-16

### Fixed

- `withCredentials` is no longer set for CORS requests [#890](https://github.com/Esri/esri-leaflet/pull/890)

## [2.0.5] - deprecated

### Fixed

- DynamicMapLayer image overlays now utilize a proxy when appropriate [#862](https://github.com/Esri/esri-leaflet/issues/862)
- `DynamicMapLayer.layerDefs` provided as a string are now serialized correctly [#866](https://github.com/Esri/esri-leaflet/pull/866) (thank you[@whyvez](https://github.com/whyvez)!)
- We no longer ask for raw geojson from ArcGIS Online proxied services that can't provide it. [#876](https://github.com/Esri/esri-leaflet/issues/876)
- Copyright text for `TiledMapLayer` is now displayed automatically when the map has a custom projection. [#877](https://github.com/Esri/esri-leaflet/issues/877)
- When a null extent is encountered by L.esri.Query, no matter its form, an `Invalid Bounds` error is passed in the callback. [#879](https://github.com/Esri/esri-leaflet/issues/879)
- `L.esri.request` now sets the generic `withCredentials` header when appropriate [#881](https://github.com/Esri/esri-leaflet/issues/881)

## [2.0.4] - 2016-10-18

### Changed

- The default maximum width of Leaflet's attribution control is now `55px` less than the map itself [#842](https://github.com/Esri/esri-leaflet/pull/842)

### Added

- A custom width crop can be configured via `L.esri.options.attributionWidthOffset` [#849](https://github.com/Esri/esri-leaflet/pull/849)
- `L.esri.query` now supports GeoJSON MultiPolygons [#866](https://github.com/Esri/esri-leaflet/pull/866) (thank you[@whyvez](https://github.com/whyvez)!)

### Fixed

- Last references to global namespaces have been removed from `L.esri.Util` [#852](https://github.com/Esri/esri-leaflet/pull/852) (thank you[@hamhands](https://github.com/hamhands)!)
- started linting our test suite
- `responseToFeatureCollection` now uses a case insensitive regex to look for common indexing field names
- `GeoJSON` / `geoJSON` casing is now used consistently

## [2.0.3] - 2016-09-16

### Added

- attribution from service metadata is now automatically displayed in Leaflet's attribution control for all layer types [#832](https://github.com/Esri/esri-leaflet/pull/832), [#842](https://github.com/Esri/esri-leaflet/pull/842) (thank you[@tyleralves](https://github.com/tyleralves)!)
- `Powered by Esri` is now displayed in Leaflet's attribution control when _any_ layer type is added to the map, not just L.esri.basemapLayer.
- the attribution control is restricted to a single line, but expands to show all data contributors on mouse hover.
- support for `DynamicMapLayer` services that require a token to be passed in a request for raw images [#830](https://github.com/Esri/esri-leaflet/pull/830) (thank you[@jaredbrookswhite](https://github.com/jaredbrookswhite)!)

## [2.0.2] - 2016-08-03

### Added

- support for `ImageMapLayer` services that require a token to be passed in a request for raw images [#812](https://github.com/Esri/esri-leaflet/pull/812)
- more graceful handling of stubborn `TiledMapLayer` services [#810](https://github.com/Esri/esri-leaflet/pull/810)

### Fixed

- bug which resulted in global `map` scope creep [#814](https://github.com/Esri/esri-leaflet/issues/818)
- bug which caused distortion in featureLayer display [#814](https://github.com/Esri/esri-leaflet/issues/818)

### Changed

- Attribution text which is displayed for hosted Esri basemaps is now 'Powered by [Esri](https://www.esri.com)'

## [2.0.1] - 2016-07-16

### Added

- users can now pass tokens to `basemapLayer` [#800](https://github.com/Esri/esri-leaflet/pull/800)

### Fixed

- to avoid broken tile thumbnails, a generic blank tile is referenced automatically by `tiledMapLayer`. [#784](https://github.com/Esri/esri-leaflet/pull/784)
- ensure addfeature and removefeature events are emitted when `featureLayer`s are added to and removed from the map. [#788](https://github.com/Esri/esri-leaflet/pull/788)
- base64 `dynamicMapLayer` responses are now parsed appropriately [#796](https://github.com/Esri/esri-leaflet/pull/796)

### Changed

- the esri logo is no longer displayed when hosted basemaps are used. It has been replaced by '&copy; Esri' in the map attribution. [#783](https://github.com/Esri/esri-leaflet/pull/783)
- Internal methods used to display dynamic attribution for tiled services with supporting static services were moved into L.esri.Util. [#799](https://github.com/Esri/esri-leaflet/pull/799)

## [1.0.4] - 2016-07-03

### Fixed

- ensure we remove all Esri logos from the map #795
- ensure addfeature and removefeature events are emitted when L.esri.featureLayers are added to and removed from the map. #788

## [2.0.0] - 2016-05-04

### Added

- new 'USATopo' `L.esri.basemapLayer` option.
- boilerplate issue template

### Fixed

- Worked around IE10,11 bug that caused `L.esri.featureLayer`s not to draw <https://github.com/Esri/esri-leaflet/pull/770>
- Ensured `L.esri.imageMapLayer` are overlaid appropriately at world scale <https://github.com/Esri/esri-leaflet/pull/774>
- Ensured copyright text makes it into the minified, concatenated build of the library
- create script tag after JSONP callback function is defined <https://github.com/Esri/esri-leaflet/issues/762>

## [2.0.0-beta.8]

### Changed

- Build system refactored to use latest Rollup and Rollup plugins.
- Reworked bundling directives for various modules systems to resolve and simplify various issues
  - WebPack users no longer have to use the Babel loader.
  - Babelify with Babel 6 now works

### Added

- `timeout` parameter for `FeatureLayer` <https://github.com/Esri/esri-leaflet/pull/730> Thanks @nathanhilbert

## [1.0.3]

### Fixed

- Ensure all visual relics of `L.esri.dynamicMapLayer` are removed outside `minZoom` and `maxZoom` defined for the layer #744

## [2.0.0-beta.7]

### Breaking

- `L.esri.Util.arcgisToGeoJson` is now `L.esri.Util.arcgisToGeoJSON`

### Added

- updated website to show off our 2.x API (compatible with Leaflet `1.0.0-beta.2`) and include API reference for supported plugins.
- new npm script to watch/recompile source

### Changed

- broke out several esri-leaflet components into external micro libraries ([tiny-binary-search](https://www.npmjs.com/package/tiny-binary-search), [leaflet-virtual-grid](https://www.npmjs.com/package/leaflet-virtual-grid), and [arcgis-to-geojson-utils](https://www.npmjs.com/package/arcgis-to-geojson-utils) for converting between and esri json and geojson)
- refactored source code for better custom projection support

### Fixed

- resolved bug that caused data to display outside a specified `min/maxZoom`
- edge case affecting time aware layers
- bug which caused `null` to sometimes be written to the attribution control (thanks brianbancroft!)
- made sure relevant node script commands are OS agnostic

## [1.0.2]

### Fixed

- Make sure appropriate behavior is encountered when removing feature layers from the map while web requests are pending. #691

### Fixed

- Ensure that we never try to remove the Esri logo from a map twice <https://github.com/Esri/esri-leaflet/issues/667>

## [1.0.1]

### Fixed

- Ensure that we never try to remove the Esri logo from a map twice <https://github.com/Esri/esri-leaflet/issues/667>

## [2.0.0-beta.6]

### Fixed

- Improved NationalGeographic and Gray attribution #612
- Fixed removing of `FeatureLayer` from maps (again)

## [2.0.0-beta.5]

### Fixed

- Removed stray `console.log` statements
- Added missing files to NPM
- Fixed removing of `FeatureLayer` from maps

## [2.0.0-beta.4]

### Breaking

- Nested namespaces for `L.esri.Layers`, `L.esri.Services` and `L.esri.Tasks` have been removed for better compatibility with ES 2015 modules. This means you should now write `L.esri.query()` for example as opposed to `L.esri.Tasks.query()`.

### Changed

- Tests are now run against the minified production code for more safety.

### Fixed

- Features no longer flicker when zooming in/out on `FeatureLayer`

### Added

- Various release process optimizations.
- Support for JSPM in package.json. Now you can `import featureLayer from 'esri-leaflet/src/Layers/FeatureLayer';` for more compact builds but be aware of [caveats](http://blog.izs.me/post/44149270867/why-no-directories-lib-in-node-the-less-snarky)
- Support for browserify in the package.json. Now you can `var featureLayer = require('esri-leaflet/src/Layers/FeatureLayer');` for more compact builds but be aware of [caveats](http://blog.izs.me/post/44149270867/why-no-directories-lib-in-node-the-less-snarky)

## [2.0.0-beta.3]

### Fixed

- Files not included in git tag.

## [2.0.0-beta.2]

### Fixed

- Release process bugs.

## [2.0.0-beta.1]

This release is the first release that supports [Leaflet 1.0.0-beta.1](http://leafletjs.com/2015/07/15/leaflet-1.0-beta1-released.html).

### Added

- New `featureLayer.resetFeatureStyle(id, style)` for reseting the styles on a specific feature to their original style.

### Changed

- By default basemap layers `GrayLabels`, `DarkGrayLabels`, `OceansLabels`, `ImageryLabels`, `ImageryTransportation`, `ShadedReliefLabels`, `TerrainLabels` will now be rendered on top of polygons and polylines if the browser supports [CSS Pointer Events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events). You can disable this behavior by passing `{pane: "tilePane"}` in the `L.esri.basemapLayer` options.
- Now relies on the [Leaflet 1.0.0-beta.1 release](http://leafletjs.com/2015/07/15/leaflet-1.0-beta1-released.html)
- Rewritten build and test systems to rely on ES 2015 Modules specification
- More build and release automation
- `featureLayer.resetStyle` no longer takes and id and will reset the style of all features. Use the new `featureLayer.resetFeatureStyle(id, style)` method.
- Styling point feature layers using vector markers like `L.circleMarker` should now also use the `style` option to set the styles of the vector markers as opposed to setting it in the `L.circleMarker` options. This enables the `setStyle`, `resetStyle`, `setFeatureStyle` and `resetFeatureStyle` options to work properly.

```js
L.esri.featureLayer({
  url: "http://...",

  // define how to convert your point into a layer
  pointToLayer: function (latlng, feature) {
    return L.circleMarker(latlng);
  },

  // style that vector layer
  style: {
    radius: 10,
    color: "red",
  },
});
```

### Removed

- All alternate/compact builds have been removed. They will be replaced with a new system for generating custom builds soon.
- `L.esri.Request` has been removed. Please use `L.esri.get`, `L.esri.get.CORS`, `L.esri.get.JSONP`, `L.esri.post` or `L.esri.request` directly.

## [1.0.0]

This represents the stable release of Esri Leaflet compatible with Leaflet 0.7.3. All future 1.0.X releases will be compatible with Leaflet 0.7.3 and contain only bug fixes. New features will only be added in Esri Leaflet 2.0.0 which will require Leaflet 1.0.0.

As this is a major release there are a number of breaking changes.

Also see the [Esri Leaflet 1.0 announcement](https://github.com/Esri/esri-leaflet/wiki/Esri-Leaflet-1.0.0-Announcement).

### Breaking Changes

- `L.esri.Services.FeatureLayer` has been renamed to `L.esri.Services.FeatureLayerService`. It should be initialized with `L.esri.Services.featureLayerService(options)`.
- All layers now match services and tasks and now only accept `url` in their options. E.x. `L.esri.featureLayer(url)` should now `L.esri.featureLayer({url: url}})`. This _does not_ affect `L.esri.baseMapLayer` which still accepts the `key` as it's first parameter.
- Request callbacks across Esri Leaflet now can handle authentication errors by calling `error.authenticate(newToken)` as opposed to listening to `authenticationrequired` event and calling `e.target.authenticate(newToken)`. **This means that your callbacks may be called multiple times**, once with an authentication failure and once with an authentication success. To avoid any side affects of this you should `return` as early as possible after handling errors. It is recommended you adapt techniques from <http://blog.timoxley.com/post/47041269194/avoid-else-return-early> to handle these cases.

```js
L.esri.Services.service({
  url: "http://logistics.arcgis.com/arcgis/rest/services/World/ServiceAreas/GPServer/GenerateServiceAreas",
  token: "badtoken",
}).metadata(function (error, response) {
  if (error && error.authenticate) {
    // handle an authentication error, returning to stop execution of the rest of the function
    error.authenticate("good token");
    return;
  }

  if (error) {
    // handle any other errors, returning to stop execution of the rest of the function
    return;
  }

  // if you get here you are successful!
  console.log(metadata);
});
```

### Changes

- Added support for the `dynamicLayers` option to `L.esri.DynamicMapLayer` <https://github.com/Esri/esri-leaflet/issues/566>
- Restored `bringToBack` and `bringToFront` to `L.esri.FeatureLayer` <https://github.com/Esri/esri-leaflet/issues/479>
- `load` event on `L.esri.FeatureLayer` now fires at the proper time <https://github.com/Esri/esri-leaflet/issues/545>
- `L.esri.DynamicMapLayer` and `L.esri.ImageMapLayer` will now automatically use POST for large requests. <https://github.com/Esri/esri-leaflet/issues/574>
- `L.esri.ImageMapLayer` now defaults to requesting `json` as opposed to an image to better handle authentication and large requests <https://github.com/Esri/esri-leaflet/issues/574>. If your Image Service does not support CORS you should set `{f:'image'}` in your options.

## [Release Candidate 8]

### Breaking Changes

- CDN moved to JS Delivr <http://www.jsdelivr.com/#!leaflet.esri>

### Changes

- Non standard scale levels from tile services published in web mercator are now remapped to the standard scale levels <https://github.com/Esri/esri-leaflet/pull/548> <https://github.com/Esri/esri-leaflet/issues/530>
- Fixed a bug introduced in RC 7 where features would sometimes not draw <https://github.com/Esri/esri-leaflet/issues/546> <https://github.com/Esri/esri-leaflet/issues/536>
- `load` event is now fired after all features are created, rather than when they are all received from the server <https://github.com/Esri/esri-leaflet/issues/545>
- Properly handle using `L.CircleMarker` with `L.esri.Layers.FeatureLayer` <https://github.com/Esri/esri-leaflet/issues/534>
- New `redraw` method on `L.esri.Layers.FeatureLayer` for programmatically redrawing features with their latest symbology. <https://github.com/Esri/esri-leaflet/pull/550>

## [Release Candidate 7]

### Breaking Changes

- DynamicMapLayer will now request `json` by default to better expose the authentication process. If you are using ArcGIS Server 10.0 or have disabled CORS on your server you will need to add `useCors: false` to your options.

### Changes

- refactor of `FeatureLayer.resetStyle()` behavior. <https://github.com/Esri/esri-leaflet/issues/488>
- improvement of `DynamicMapLayer` image loading logic. <https://github.com/Esri/esri-leaflet/issues/498>
- Fixed bug in display of dynamic map services at world scale. <https://github.com/Esri/esri-leaflet/issues/450>
- Switched to protocol relative urls for google fonts <https://github.com/Esri/esri-leaflet/pull/501> (thanks @whymarrh!)
- Added an `alt` tag to the Esri logo <https://github.com/Esri/esri-leaflet/issues/490>
- Improved a few regexes <https://github.com/Esri/esri-leaflet/pull/494> & <https://github.com/Esri/esri-leaflet/pull/487>
- Trap error when `identifyFeatures.run()` doesn't return any results. <https://github.com/Esri/esri-leaflet/issues/512>
- Dynamically switch to a smaller Esri logo in smaller maps. <https://github.com/Esri/esri-leaflet/issues/505>
- Added a `deleteFeatures()` method to both `L.esri.Layers.FeatureLayer` and `L.esri.Services.FeatureLayer` for dropping records in bulk. <https://github.com/Esri/esri-leaflet/pull/510>
- Improve logic of rendering simplified features with `L.esri.FeatureLayer`. <https://github.com/Esri/esri-leaflet/issues/320> and <https://github.com/Esri/esri-leaflet/pull/518>
- Various doc improvements. <https://github.com/Esri/esri-leaflet/pull/511> & <https://github.com/Esri/esri-leaflet/pull/507> & <https://github.com/Esri/esri-leaflet/pull/506> & <https://github.com/Esri/esri-leaflet/issues/495>
- DynamicMapLayer will now request `json` by default to better expose authentication helpers
- Attribution for basemaps is now always requested with JSONP

## [Release Candidate 6]

### Breaking Changes

None

### Changes

- `f:'json'` will now be used automatically when a proxy is set for `L.esri.DynamicMapLayer`. <https://github.com/Esri/esri-leaflet/issues/464>
- Callback functions will now only be run once when there is a CORS error. <https://github.com/Esri/esri-leaflet/issues/465>
- Layer ids will now be included with the GeoJSON response from `identify()` and `L.esri.Tasks.Identify`. <https://github.com/Esri/esri-leaflet/issues/443>
- Bugfix for adding/removing certain basemap layers. <https://github.com/Esri/esri-leaflet/issues/455>

## [Release Candidate 5]

### Breaking Changes

- All `Task` and `Service` constructors now accept `url` as a value within options, rather than as a separate parameter. [#420](https://github.com/Esri/esri-leaflet/issues/420)
- 'Layer' objects continue to expect a `url` string to be supplied as the first parameter, but afterwards, the property is now accessible via Layer.options.url instead of Layer.url

### Changes

- Fixed duplicate Esri logo bug [#427](https://github.com/Esri/esri-leaflet/issues/427)
- GeoJSON is now requested directly from ArcGIS Online Hosted Feature Services [#418](https://github.com/Esri/esri-leaflet/issues/418)
- other FeatureLayer performance improvements [#416](https://github.com/Esri/esri-leaflet/issues/416)
- `minZoom`, `maxZoom`, [#413](https://github.com/Esri/esri-leaflet/issues/413) and `cacheLayers` were added as new FeatureLayer constructor options
- default fill is now specified for multipolygons [#406](https://github.com/Esri/esri-leaflet/issues/406)
- dark gray basemap now utilizes our new production service [#399](https://github.com/Esri/esri-leaflet/issues/399)

## [Release Candidate 4]

### Changes

- Fixed a bug where resetStyle would not work with MultiPolygon and MultiPolyline features [#390](https://github.com/Esri/esri-leaflet/issues/390)
- Fixed a display bug when rapidly toggling L.esri.DynamicMapLayer on/off before the image completely loads [#386](https://github.com/Esri/esri-leaflet/issues/386)
- Bower installation fixed [#378](https://github.com/Esri/esri-leaflet/issues/378)

## [Release Candidate 3]

### Changes

- Removed hardcoded http call in `L.esri.Controls.Logo` [#383](https://github.com/Esri/esri-leaflet/issues/383)
- `L.esri.TiledMapLayer` now accepts a token option for secured tiles. [#384](https://github.com/Esri/esri-leaflet/issues/384)
- Fixed a bug with `DynamicMapLayer` still rendering after being removed from the map. [#386](https://github.com/Esri/esri-leaflet/issues/386)
- Fixed 404s on example site.
- Fixed setting sr param on `L.esri.Tasks.Find` [#379](https://github.com/Esri/esri-leaflet/issues/379)
- `bower install esri-leaflet` now works properly.

## [Release Candidate 2]

### Changes

- Fixed IE 8 and 9 support that was broken in RC 1.
- Fixed sourcemaps by embedding source files inside the maps.
- Fix a bug when aborting JSONP requests
- Other small fixes for plugin support
- Added `contains`, `overlaps` and `intersects` to `L.esri.Tasks.Query`.
- Spatial methods on `L.esri.Tasks.Query` can now accept the following Leaflet types, `L.Marker`, `L.Polygon`, `L.Polyline`, `L.LatLng`, `L.LatLngBounds` and `L.GeoJSON`. It can also accept valid GeoJSON Point, Polyline, Polygon and GeoJSON Feature objects containing Point, Polyline, Polygon.
- Most methods that accept `L.LatLng` and `L.LatLngBounds` now accept the simple [lat,lng] or [[lat,lng], [lat,lng]] forms.

## [Release Candidate 1]

### Changes

- `L.esri.Task` now accepts `proxy` and `useCors` like `L.esri.Service`. <https://github.com/Esri/esri-leaflet/pull/359>
- Esri Leaflet can now be used in Common JS (browserify) and AMD (Dojo, RequireJS) module loaders. Examples will be coming soon.
- Source maps are now built and distributed along with the distribution files to aid in debugging. To learn how to use the source maps [Treehouse](http://blog.teamtreehouse.com/introduction-source-maps) and [HTML5Rocks](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) have excellent resources.
- `L.esri.ClusteredFeatureLayer` has been moved to its own repository. <https://github.com/Esri/esri-leaflet-clustered-feature-layer>
- `L.esri.HeatmapFeatureLayer` has been moved to its own repository. <https://github.com/Esri/esri-leaflet-heatmap-feature-layer>
- An edge case when converting ArcGIS > GeoJSON has been resolved <https://github.com/Esri/esri-leaflet/pull/340>
- `popupOptions` are now properly persevered <https://github.com/Esri/esri-leaflet/pull/348>
- `setStyle` now permanently overrides the style in `options.style`. <https://github.com/Esri/esri-leaflet/pull/349>
- `setWhere` and `setTimeRange` now take callbacks. <https://github.com/Esri/esri-leaflet/pull/354>
- You can now abort JSONP requests with request.abort() just like with `XMLHttpRequest`. <https://github.com/Esri/esri-leaflet/pull/354>
- `returnGeometry` can now be set on `L.esri.Tasks.Query`. <https://github.com/Esri/esri-leaflet/pull/358>
- a sample.html file was added to help jumpstart debugging local source files. <https://github.com/Esri/esri-leaflet/pull/364>

### Breaking Changes

- Task methods that accept callbacks (like `run` or `bounds`) now return an instance of `XMLHttpRequest` as opposed to the task or service.
- `bindPopup` on `L.esri.DynamicMapLayer` now identifies only visible features by default rather then all features.
- All API requests inside of layers, tasks and services will now switch between GET and POST automatically when the request size exceeds 2000 characters. This improves IE compatibility but means that for long requests (like complex `where` clauses or long lists of IDs) you may need to setup an instance of <https://github.com/Esri/resource-proxy> and use the `proxy` option.

### Changes

## [Beta 6]

### Breaking Changes

- `L.esri.Tasks.Identify` has been renamed to `L.esri.Tasks.IdentifyFeatures`. This is to reduce confusion with `L.esri.Tasks.IdentifyImage` and to clearly delineate what these 2 classes do.

### Changes

- Logo position can now be controlled by using the `logoPosition` option on `L.esri.BasemapLayer` <https://github.com/Esri/esri-leaflet/issues/210>
- Logo can now be hidden entirely and re-added to the map with the `L.esri.Controls.Logo` class. **If you use Esri map tiles you must display the Esri Logo!**
- Fix a regression from Beta 4 where features could not be loaded from ArcGIS Server if they were in non-mercator references. <https://github.com/Esri/esri-leaflet/issues/283> <https://github.com/Esri/esri-leaflet/pull/322>
- The `addFeature`, `removeFeature`, `updateFeature` methods will no longer throw errors when callbacks are omitted. <https://github.com/Esri/esri-leaflet/issues/285>
- `deleteFeature` now properly removes the feature from the map so it will now appear after zooming or panning. <https://github.com/Esri/esri-leaflet/issues/284>
- New `createfeature`, `addfeature` and `removefeature` events on `L.esri.FeatureLayer`. <https://github.com/Esri/esri-leaflet/issues/282>
- `L.esri.Tasks.Query` now supports Map Services and Image Services with the new `query.layer(id)` and `query.pixelSize(point)` params respectively
- New `L.esri.Tasks.Find` task for searching feature text in Map Services <https://github.com/Esri/esri-leaflet/pull/287>. Thanks @rdjurasaj-usgs!
- Support for image services via `L.esri.Layers.ImageMapLayer`. Thanks @rdjurasaj-usgs and @tomwayson
- `L.esri.Tasks.IdentifyImage` for identifying images. Thanks @tomwayson.

### Misc

- [New example](esri.github.io/esri-leaflet/examples/parse-feature-collection.html) for parsing [Feature Collections](http://resources.arcgis.com/en/help/arcgis-rest-api/#/featureCollection/02r30000003m000000/) from ArcGIS Online.
- [New example]() for labeling points with [Leaflet.label](https://github.com/Leaflet/Leaflet.label).
- Travis CI is now running tests <https://github.com/Esri/esri-leaflet/pull/271>
- Build are no longer saved in the `/dist` folder. <https://github.com/Esri/esri-leaflet/pull/307>
- [Development Roadmap](https://github.com/Esri/esri-leaflet/wiki/Roadmap) has been updated.

## [Beta 5]

### Breaking Changes

- `Oceans` no longer contains map labels, labels have been added as another key `OceansLabels`.
- `L.esri.FeatureLayer` no longer inherits from `L.GeoJSON` and as a result no longer has `getBounds`, `bringToBack` or `bringToFront` or `addData` methods.
- L.esri.Util.geojsonBounds has been removed. If you need to get the bounding box of a GeoJSON object please use [Terraformer](http://terraformer.io) or [`L.GeoJSON`](http://leafletjs.com/reference.html#geojson).
- Many other utility methods have been removed. If you were using methods in the `L.esri.Util` namespace please check that they exist.
- Layers no longer fire a `metadata` event. They now have a `metadata` method that can be used to get layer metadata. If you need to convert extents into L.LatLngBounds you can use `L.esri.Util.extentToBounds`.
- `L.esri.DynamicMapLayer` no longer inherits from `L.ImageOverlay` as a result the `setUrl` method no longer exists.
- You can no longer pass a `cluster` object to `L.esri.ClusteredFeatureLayer`, instead pass any options you want to pass to `L.MarkerClusterGroup` directly to `L.esri.ClusteredFeatureLayer`.
- You can no long pass a string for the `layerDefs` option on `L.esri.DynamicMapLayer`. Layer definitions should now be passed as an object like `{'0':'STATE_NAME='Kansas' and POP2007>25000'}`
- You can no longer pass a string for the `layers` option on `L.esri.DynamicMapLayer` you can now only pass an array of layer ids that will be shown like `[0,1,2]`.
- The `createMarker` method on `L.esri.ClusteredFeatureLayer` has been renamed to `pointToLayer`.

### Changes

- Added `OceansLabels` to `L.esri.BasemapLayer`.
- `Oceans` has switched to the new Ocean basemap with out labels.
- `L.esri.FeatureLayer` has been refactored into several classes. `L.esri.FeatureGrid` and `L.esri.FeatureManager` now handle loading and querying features from the service.
- `L.esri.ClusteredFeatureLayer` and `L.esri.HeatMapFeatureLayer` now inherit from `L.esri.FeatureManager` so they share many new methods and options.
- `L.esri.FeatureLayer`, `L.esri.ClusteredFeatureLayer` and `L.esri.HeatMapFeatureLayer` now support time enabled service via `from`, `to`, `timeFields` and `timeFilterMode` options and `setTimeRange(from, to)` and `getTimeRange()` methods.
- `L.esri.FeatureLayer`, `L.esri.ClusteredFeatureLayer` and `L.esri.HeatMapFeatureLayer` now support `where` options and have new methods for `setWhere()` and `getWhere()` to perform filtering.
- `L.esri.FeatureLayer` now supports generalizing polygon and polyline features on the service side for performance using the new `simplifyFactor` option.
- Don't throw errors when `L.esri.BasemapLayer` is added to maps without an attribution control. If you do not add attribution you must handle adding attribution your self to the map.
- Remove rbush. Switch to tracking feature ids with the cell key system.
- Remove `L.esri.Util.geojsonBounds` as it was only being used to create bounds and envelopes for rbush.
- add `bindPopup` method to `L.esri.DynamicMapLayer`.
- add `getTimeRange` and `setTimeRange` methods `L.esri.DynamicMapLayer`.
- New `L.esri.Services` namespace to handle generic abstraction of interacting with ArcGIS Online and ArcGIS server services.
- new `L.esri.Services.Service` base class that can be used for interacting with any service. All `L.esri.Layers` classes now uses `L.esri.Services.Service` internally for their API requests. This class also abstracts authentication and proxying.
- new `L.esri.Services.FeatureLayer` class for interacting with the Feature Layer API.
- new `L.esri.Services.MapService` class for interacting with the Map Server API.
- new `L.esri.Tasks` namespace for tasks that map to individual API methods.
- new `L.esri.Tasks.Query` class for interacting with the Feature Layer query API.
- new `L.esri.Tasks.Identify` class for interacting with Map Servers that support identify.

## [Beta 4 Patch 1]

### Changes

- Patches a bug with identifying features on DynamicMapLayer
- Various updates and fixes to examples

## [Beta 4]

### New Demos

- Heat map layer - <http://esri.github.io/esri-leaflet/heatmaplayer.html>
- Geocoder - <http://esri.github.io/esri-leaflet/findplaces.html>

### Changes

- Authentication for ClusteredFeatureLayer <https://github.com/Esri/esri-leaflet/commit/d23ddd99ee86bb7255e4d89b6cf3f339a441c88b>
- Removed Terraformer as a dependency to cut down on build size and complexity. The neccessary Terraformer methods have been ported into L.esri.Util. This cuts a whomping 15kb from the build!
- Fix for DynamicMapLayer that is outside of min/max zoom levels <https://github.com/Esri/esri-leaflet/commit/0d2c2c36ed6ccbad96e0ab24c24cc48f43079ade>
- Fix for layerDefs in DynamicMapLayer <https://github.com/Esri/esri-leaflet/commit/1375bbf2768ba0fb6806f51c09a3d6fa192521d9>
- Add HeatmapFeatureLayer based on Leaflet.heat
- Add where and fields options to FeatureLayer and ClusteredFeatureLayer, and HeatmapFeatureLayer
- Add bounds property to the metadata event when possible #216

## [Beta 3]

- Improve DynamicMapLayer panning and zooming performance. #137
- FeatureLayer and ClusteredFeatureLayer can now load features from map services. Thanks to @odoe and @jgravois.
- FeatureLayer, DynamicMapLayer and ClusteredFeatureLayer all accept a token option for accessing services that require authentication and fire a `authenticationrequired` event when they encounter a need for a token. Thanks to @aaronpk for the Oauth demos. #139
- Add DarkGray and DarkGrayLabels to BasemapLayer. #190
- An attributionControl on maps is now required when using BasemapLayer. #159

[unreleased]: https://github.com/esri/esri-leaflet/compare/v3.0.17..HEAD
[3.0.17]: https://github.com/esri/esri-leaflet/compare/v3.0.16..v3.0.17
[3.0.16]: https://github.com/esri/esri-leaflet/compare/v3.0.15..v3.0.16
[3.0.15]: https://github.com/esri/esri-leaflet/compare/v3.0.14..v3.0.15
[3.0.14]: https://github.com/esri/esri-leaflet/compare/v3.0.13..v3.0.14
[3.0.13]: https://github.com/esri/esri-leaflet/compare/v3.0.12..v3.0.13
[3.0.12]: https://github.com/esri/esri-leaflet/compare/v3.0.11..v3.0.12
[3.0.11]: https://github.com/esri/esri-leaflet/compare/v3.0.10...v3.0.11
[3.0.10]: https://github.com/esri/esri-leaflet/compare/v3.0.9...v3.0.10
[3.0.9]: https://github.com/esri/esri-leaflet/compare/v3.0.8...v3.0.9
[3.0.8]: https://github.com/esri/esri-leaflet/compare/v3.0.7...v3.0.8
[3.0.7]: https://github.com/esri/esri-leaflet/compare/v3.0.6...v3.0.7
[3.0.6]: https://github.com/esri/esri-leaflet/compare/v3.0.5...v3.0.6
[3.0.5]: https://github.com/esri/esri-leaflet/compare/v3.0.4...v3.0.5
[3.0.4]: https://github.com/esri/esri-leaflet/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/esri/esri-leaflet/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/esri/esri-leaflet/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/esri/esri-leaflet/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/esri/esri-leaflet/compare/v2.5.3...v3.0.0
[2.5.3]: https://github.com/esri/esri-leaflet/compare/v2.5.2...v2.5.3
[2.5.2]: https://github.com/esri/esri-leaflet/compare/v2.5.1...v2.5.2
[2.5.1]: https://github.com/esri/esri-leaflet/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/esri/esri-leaflet/compare/v2.4.1...v2.5.0
[2.4.1]: https://github.com/esri/esri-leaflet/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/esri/esri-leaflet/compare/v2.3.3...v2.4.0
[2.3.3]: https://github.com/esri/esri-leaflet/compare/v2.3.2...v2.3.3
[2.3.2]: https://github.com/esri/esri-leaflet/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/esri/esri-leaflet/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/esri/esri-leaflet/compare/v2.2.4...v2.3.0
[2.2.4]: https://github.com/esri/esri-leaflet/compare/v2.2.3...v2.2.4
[2.2.3]: https://github.com/esri/esri-leaflet/compare/v2.2.2...v2.2.3
[2.2.2]: https://github.com/esri/esri-leaflet/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/esri/esri-leaflet/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/esri/esri-leaflet/compare/v2.1.4...v2.2.0
[2.1.4]: https://github.com/esri/esri-leaflet/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/esri/esri-leaflet/compare/v2.1.2...v2.1.3
[2.1.2]: https://github.com/esri/esri-leaflet/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/esri/esri-leaflet/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/esri/esri-leaflet/compare/v2.0.8...v2.1.0
[2.0.8]: https://github.com/esri/esri-leaflet/compare/v2.0.7...v2.0.8
[2.0.7]: https://github.com/esri/esri-leaflet/compare/v2.0.6...v2.0.7
[2.0.6]: https://github.com/esri/esri-leaflet/compare/v2.0.5...v2.0.6
[2.0.5]: https://github.com/esri/esri-leaflet/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/esri/esri-leaflet/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/esri/esri-leaflet/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/esri/esri-leaflet/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/esri/esri-leaflet/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/esri/esri-leaflet/compare/v2.0.0-beta.8...v2.0.0
[2.0.0-beta.8]: https://github.com/esri/esri-leaflet/compare/v2.0.0-beta.7...v2.0.0-beta.8
[2.0.0-beta.7]: https://github.com/esri/esri-leaflet/compare/v2.0.0-beta.6...v2.0.0-beta.7
[1.0.4]: https://github.com/esri/esri-leaflet/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/esri/esri-leaflet/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/esri/esri-leaflet/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/esri/esri-leaflet/compare/v1.0.0...v1.0.1
[2.0.0-beta.6]: https://github.com/esri/esri-leaflet/compare/v2.0.0-beta.5...v2.0.0-beta.6
[2.0.0-beta.5]: https://github.com/esri/esri-leaflet/compare/v2.0.0-beta.4...v2.0.0-beta.5
[2.0.0-beta.4]: https://github.com/esri/esri-leaflet/compare/v2.0.0-beta.3...v2.0.0-beta.4
[2.0.0-beta.3]: https://github.com/esri/esri-leaflet/compare/v2.0.0-beta.2...v2.0.0-beta.3
[2.0.0-beta.2]: https://github.com/esri/esri-leaflet/compare/v2.0.0-beta.1...v2.0.0-beta.2
[2.0.0-beta.1]: https://github.com/esri/esri-leaflet/compare/v1.0.0...v2.0.0-beta.1
[1.0.0]: https://github.com/esri/esri-leaflet/compare/v1.0.0-rc.8...v1.0.0
[release candidate 8]: https://github.com/esri/esri-leaflet/compare/v1.0.0-rc.7...v1.0.0-rc.8
[release candidate 7]: https://github.com/esri/esri-leaflet/compare/v1.0.0-rc.6...v1.0.0-rc.7
[release candidate 6]: https://github.com/esri/esri-leaflet/compare/v1.0.0-rc.5...v1.0.0-rc.6
[release candidate 5]: https://github.com/esri/esri-leaflet/compare/v1.0.0-rc.4...v1.0.0-rc.5
[release candidate 4]: https://github.com/esri/esri-leaflet/compare/v1.0.0-rc.3...v1.0.0-rc.4
[release candidate 3]: https://github.com/esri/esri-leaflet/compare/v1.0.0-rc.2...v1.0.0-rc.3
[release candidate 2]: https://github.com/esri/esri-leaflet/compare/v1.0.0-rc.1...v1.0.0-rc.2
[release candidate 1]: https://github.com/esri/esri-leaflet/compare/v0.0.1-beta.6...v1.0.0-rc.1
[beta 6]: https://github.com/esri/esri-leaflet/compare/v0.0.1-beta.5...v0.0.1-beta.6
[beta 5]: https://github.com/esri/esri-leaflet/compare/v0.0.1-beta.4-patch-1...v0.0.1-beta.5
[beta 4 patch 1]: https://github.com/esri/esri-leaflet/compare/v0.0.1-beta.4...v0.0.1-beta.4-patch-1
[beta 4]: https://github.com/esri/esri-leaflet/compare/v0.0.1-beta.3...v0.0.1-beta.4
[beta 3]: https://github.com/esri/esri-leaflet/compare/v0.0.1-beta.2...v0.0.1-beta.3
