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