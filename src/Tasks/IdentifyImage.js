L.esri.Tasks.IdentifyImage = L.esri.Tasks.Identify.extend({
  params: {
    returnGeometry: false
  },

  at: function(latlng){
    this.params.geometry = JSON.stringify({
      x: latlng.lng,
      y: latlng.lat,
      spatialReference:{
        wkid: 4326
      }
    });
    this.params.geometryType = 'esriGeometryPoint';
    return this;
  },

  setMosaicRule: function(mosaicRule) {
    this.params.mosaicRule = mosaicRule;
    return this;
  },

  getMosaicRule: function() {
    return this.params.mosaicRule;
  },

  setRenderingRule: function(renderingRule) {
    this.params.renderingRule = renderingRule;
    return this;
  },

  getRenderingRule: function() {
    return this.params.renderingRule;
  },

  setPixelSize: function(pixelSize) {
    this.params.pixelSize = pixelSize.join ? pixelSize.join(',') : pixelSize;
    return this;
  },

  getPixelSize: function() {
    return this.params.pixelSize;
  },

  returnCatalogItems: function (returnCatalogItems) {
    this.params.returnCatalogItems = returnCatalogItems;
    return this;
  },

  run: function (callback, context){
    var _this = this;
    this.request(function(error, response){
      callback.call(context, error, (response && _this._responseToGeoJSON(response)), response);
    }, context);
  },

  // get pixel data and return as geoJSON point
  // populate catalog items (if any)
  // merging in any catalogItemVisibilities as a propery of each feature
  _responseToGeoJSON: function(response) {
    var location = response.location;
    var catalogItems = response.catalogItems;
    var catalogItemVisibilities = response.catalogItemVisibilities;
    var geoJSON =  {
      'pixel': {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [location.x, location.y]
        },
        'crs': {
          'type': 'EPSG',
          'properties': {
            'code': location.spatialReference.wkid
          }
        },
        'properties': {
          'OBJECTID': response.objectId,
          'name': response.name,
          'value': response.value
        },
        'id': response.objectId
      }
    };
    if (response.properties && response.properties.Values) {
      geoJSON.pixel.properties.values = response.properties.Values;
    }
    if (catalogItems && catalogItems.features) {
      geoJSON.catalogItems = L.esri.Util.responseToFeatureCollection(catalogItems);
      if (catalogItemVisibilities && catalogItemVisibilities.length === geoJSON.catalogItems.features.length) {
        for (var i = catalogItemVisibilities.length - 1; i >= 0; i--) {
          geoJSON.catalogItems.features[i].properties.catalogItemVisibility = catalogItemVisibilities[i];
        }
      }
    }
    return geoJSON;
  }

});

L.esri.Tasks.identifyImage = function(url, params){
  return new L.esri.Tasks.IdentifyImage(url, params);
};