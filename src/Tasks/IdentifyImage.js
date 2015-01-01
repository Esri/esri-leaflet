EsriLeaflet.Tasks.IdentifyImage = EsriLeaflet.Tasks.Identify.extend({
  setters: {
    'setMosaicRule': 'mosaicRule',
    'setRenderingRule': 'renderingRule',
    'setPixelSize': 'pixelSize',
    'returnCatalogItems': 'returnCatalogItems',
    'returnGeometry': 'returnGeometry'
  },

  params: {
    returnGeometry: false
  },

  at: function(latlng){
    latlng = L.latLng(latlng);
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

  getMosaicRule: function() {
    return this.params.mosaicRule;
  },

  getRenderingRule: function() {
    return this.params.renderingRule;
  },

  getPixelSize: function() {
    return this.params.pixelSize;
  },

  run: function (callback, context){
    return this.request(function(error, response){
      callback.call(context, error, (response && this._responseToGeoJSON(response)), response);
    }, this);
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
      geoJSON.catalogItems = EsriLeaflet.Util.responseToFeatureCollection(catalogItems);
      if (catalogItemVisibilities && catalogItemVisibilities.length === geoJSON.catalogItems.features.length) {
        for (var i = catalogItemVisibilities.length - 1; i >= 0; i--) {
          geoJSON.catalogItems.features[i].properties.catalogItemVisibility = catalogItemVisibilities[i];
        }
      }
    }
    return geoJSON;
  }

});

EsriLeaflet.Tasks.identifyImage = function(params){
  return new EsriLeaflet.Tasks.IdentifyImage(params);
};