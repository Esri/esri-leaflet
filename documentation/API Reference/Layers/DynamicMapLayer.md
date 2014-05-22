# DynamicMapLayer

**Extends** `L.ImageOverlay`

If you have a MapService you and use `L.esri.DynamicMapLayer(url, options)` to render it on a map.

#### Constructor
Constructor | Description
--- | ---
`new L.esri.DynamicMapLayer(url, options)`<br>`L.esri.DynamicMapLayer(url, options)` | `url` should be the URL of the feature layer to consume. See [service URLs](#service-urls) for more information on how to find these urls.

#### Options

`L.esri.DynamicMapLayer` also accepts all the options you can pass to [`L.ImageOverlay`](http://leafletjs.com/reference.html#imageoverlay).

Option | Type | Default | Description
--- | --- | --- | ---
`format` | `String` | `'png24'` | Output format of the image.
`transparent` | `Boolean` | `true` | Allow the server to produce transparent images.
`f` | `String` | `'image'` | Output type
`bboxSR` | `Integer` | `4326` | Spatial reference of the bounding box to generate the image with. If you don't know what this is don't change it.
`imageSR` | | `3857` | Spatial reference of the output image. If you don't know what this is don't change it.
`layers` | `String` or `Array` | `''` | An array of Layer IDs like `[3,4,5]` to show from the service or a string in the format like `[show | hide | include | exclude]:layerId1,layerId2` like `exclude:3,5`.
`layerDefs` | `String` `Object` | `''` | A string representing a query to run against the service before the image is rendered. This can be a string like `"STATE_NAME='Kansas' and POP2007>25000"` or an object mapping different queries to specific layers `{5:"STATE_NAME='Kansas'", 4:"STATE_NAME='Kansas'}`.
`opacity` | `Integer` | `1` | Opacity of the layer. Should be a value between 0 and 1.
`position` | `String` | '"front"` | position of the layer relative to other overlays
`token` | `String` | `null` | If you pass a token in your options it will included in all requests to the service. See [working with authenticated services](#working-with-authenticated-services) for more information.

#### Methods

Method | Returns |  Description
--- | --- | ---
`identify(latlng, [options](#identify-options), callback)` | `null` | Used to identify what features exist in a particular location on a `L.esri.DynamicMapLayer`. The first parameter is a [`L.LatLng`](http://leafletjs.com/reference.html#latlng) object. the second if an object setting various options, and finally a callback that will be called with `error` and `response`.
 
#### Events

`L.esri.DynamicMapLayer` also fires all the same events as [`L.TileLayer`](http://leafletjs.com/reference.html#tilelayer) in addition to these events.

Event | Data | Description
--- | --- | ---
`metadata` | [`Metadata`](#metadata-event) | After creating a new `L.esri.DynamicMapLayer` a request for data describing the service will be made and passed to the metadata event.
`authenticationrequired` | [`Authentication`](#authentication-event) | This will be fired when a request to a service fails and requires authentication. See [working with authenticated services](#working-with-authenticated-services) for more information.

##### Example

```js
var map = L.map('map').setView([ 38.24788726821097,-85.71807861328125], 13 );

L.esri.dynamicMapLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyHazardsandRisks/MapServer", {
  opacity : 0.25
}).addTo(map);
```