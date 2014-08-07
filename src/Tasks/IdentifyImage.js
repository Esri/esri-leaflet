L.esri.Tasks.IdentifyImage = L.esri.Tasks.Identify.extend({

  initialize: function(endpoint){
    if(endpoint.url && endpoint.get){
      this._service = endpoint;
      this.url = endpoint.url;
    } else {
      this.url = L.esri.Util.cleanUrl(endpoint);
    }

    this._params = {
      returnGeometry: false
    };
  },

  at: function(latlng){
    this._params.geometry = JSON.stringify({
      x: latlng.lng,
      y: latlng.lat,
      spatialReference:{
        wkid: 4326
      }
    });
    this._params.geometryType = 'esriGeometryPoint';
    return this;
  },

  setMosaicRule: function(mosaicRule) {
    this._params.mosaicRule = mosaicRule;
    return this;
  },

  getMosaicRule: function() {
    return this._params.mosaicRule;
  },

  setRenderingRule: function(renderingRule) {
    this._params.renderingRule = renderingRule;
    return this;
  },

  getRenderingRule: function() {
    return this._params.renderingRule;
  },

  setPixelSize: function(pixelSize) {
    this._params.pixelSize = pixelSize.join ? pixelSize.join(',') : pixelSize;
    return this;
  },

  getPixelSize: function() {
    return this._params.pixelSize;
  },

  run: function (callback, context){
    var _this = this;
    this._request(function(error, response){
      callback.call(context, error, (response && _this._responseToGeoJSON(response)), response);
    }, context);
  },

  _responseToGeoJSON: function(response) {
    var geoJSON =  {
      'pixel': {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [response.location.x, response.location.y]
        },
        'crs': {
          'type': 'EPSG',
          'properties': {
            'code': response.location.spatialReference.wkid
          }
        },
        'properties': {
          'OBJECTID': response.objectId,
          'name': response.name,
          'value': response.value
        },
        'id': response.objectId
      },
      // @TODO: populate catalog items (if any)
      // merging in any catalogItemVisibilities as a propery of each feature
      'catalogItems': {
        'type': 'FeatureCollection',
        'features': []
      }
    };
    return geoJSON;
  }

});

L.esri.Tasks.identifyImage = function(url, params){
  return new L.esri.Tasks.IdentifyImage(url, params);
};