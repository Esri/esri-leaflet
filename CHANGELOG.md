# Changelog

## Master

#### Changes

* Added `OceansLabels` to `L.esri.BasemapLayer`.
* `Oceans` has switched to the new Ocean basemap with out labels.
* `L.esri.FeatureLayer` has been refactored into several classes. `L.esri.FeatureGrid` and `L.esri.FeatureManager` now handle loading and querying features from the service.
* `L.esri.ClusteredFeatureLayer` and `L.esri.HeatMapFeatureLayer` now inherit from `L.esri.FeatureGrid` and `L.esri.FeatureManager`.
* `L.esri.FeatureLayer`, `L.esri.ClusteredFeatureLayer` and `L.esri.HeatMapFeatureLayer` now support time enabled service via `from`, `to`, `timeFields` and `timeFilterMode` options and `setTimeRange(from, to)` and `getTimeRange()` methods.
* `L.esri.FeatureLayer`, `L.esri.ClusteredFeatureLayer` and `L.esri.HeatMapFeatureLayer` now support `where` options and have new methods for `setWhere()` and `getWhere()` to perform filtering.
* `L.esri.FeatureLayer` now supports generalizing polygon and polyline features on the service side for performence using the new `simplifyFactor` option.
* You can now pass a `hideLogo` option to `L.esri.BasemapLayer` https://github.com/Esri/esri-leaflet/issues/210
* Don't throw errors when `L.esri.BasemapLayer` is added to maps without an attribution control.
* Remove rbush. Switch to tracking feature ids with the cell key system.
* Remove `L.esri.Util.geojsonBounds` as it was only being used to create bounds and envelopes for rbush.
* add `bindPopup` method to `L.esri.DynamicMapLayer`.
* add `getTimeRange` and `setTimeRange` methods `L.esri.DynamicMapLayer`.

#### Breaking Changes

* `Oceans` no longer contains map labels, labels have been added as another key `OceansLabels`.
* `L.esri.FeatureLayer` no longer inherits from `L.GeoJSON` and as a result no longer has `getBounds`, `bringToBack` or `bringToFront` or `addData` methods.
* L.esri.Util.geojsonBounds has been removed. If you need to get the bounding box of a GeoJSON object please use [Terraformer](http://terraformer.io) or [`L.GeoJSON`](http://leafletjs.com/reference.html#geojson).
* Many other utility methods have been removed. If you were using methods in the `L.esri.Util` namespace please check that they exist.
* Layers no longer fire a `metadata` event. They now have a `metadata` method that can be used to get layer metadata. If you need to convert extents into L.LatLngBounds you can use `L.esri.Util.extentToBounds`.
* `L.esri.DynamicMapLayer` no longer inherits from `L.ImageOverlay` as a result the `setUrl` method no longer exists.
* You can no longer pass a `cluster` object to `L.esri.ClusteredFeatureLayer`, insteed pass any options you want to pass to `L.MarkerClusterGroup` directly to `L.esri.ClusteredFeatureLayer`.
* You can no long pass a string for the `layerDefs` option on `L.esri.DynamicMapLayer`. Layer definitions should now be passed as an object like `{'0':'STATE_NAME='Kansas' and POP2007>25000'}`
* You can no longer pass a string for the `layers` option on `L.esri.DynamicMapLayer` you can now only pass an array of layer ids that will be shown like `[0,1,2]`.
* The `createMarker` method on `L.esri.ClusteredFeatureLayer` has been renamed to `pointToLayer`.

## Beta 4 Patch 1

#### Changes

* Patches a bug with identifying features on DynamicMapLayer
* Various updates and fixes to examples

## Beta 4

#### New Demos
* Heat map layer - http://esri.github.io/esri-leaflet/heatmaplayer.html
* Geocoder - http://esri.github.io/esri-leaflet/findplaces.html

#### Changes

* Authentication for ClusteredFeatureLayer https://github.com/Esri/esri-leaflet/commit/d23ddd99ee86bb7255e4d89b6cf3f339a441c88b
* Removed Terraformer as a dependency to cut down on build size and complexity. The neccessary * * * Terraformer methods have been ported into L.esri.Util. This cuts a whomping 15kb from the build!
* Fix for DynamicMapLayer that is outside of min/max zoom levels https://github.com/Esri/esri-leaflet/commit/0d2c2c36ed6ccbad96e0ab24c24cc48f43079ade
* Fix for layerDefs in DynamicMapLayer https://github.com/Esri/esri-leaflet/commit/1375bbf2768ba0fb6806f51c09a3d6fa192521d9
* Add HeatmapFeatureLayer based on Leaflet.heat
* Add where and fields options to FeatureLayer and ClusteredFeatureLayer, and HeatmapFeatureLayer
* Add bounds property to the metadata event when possible #216

# Beta 3

* Improve DynamicMapLayer panning and zooming performance. #137
* FeatureLayer and ClusteredFeatureLayer can now load features from map services. Thanks to @odoe and @jgravois.
* FeatureLayer, DynamicMapLayer and ClusteredFeatureLayer all accept a token option for accessing services that require authentication and fire a authenticationrequired event when they encounter a need for a token. Thanks to @aaronpk for the Oauth demos. #139
* Add DarkGray and DarkGrayLabels to BasemapLayer. #190
* An attributionControl on maps is now required when using BasemapLayer. #159