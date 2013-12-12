L.esri.Mixins.identifiableLayer = {
  identify:function(latLng, options, callback){
    var defaults = {
      sr: '4326',
      mapExtent: JSON.stringify(L.esri.Util.boundsToExtent(this._map.getBounds())),
      tolerance: 5,
      geometryType: 'esriGeometryPoint',
      imageDisplay: this._map._size.x + ',' + this._map._size.y + ',96',
      geometry: JSON.stringify({
        x: latLng.lng,
        y: latLng.lat,
        spatialReference: {
          wkid: 4326
        }
      })
    };

    if(this.options.layers) {
      defaults.layers = this.options.layers;
    }

    var params;

    if (typeof options === 'function' && typeof callback === 'undefined') {
      callback = options;
      params = defaults;
    } else if (typeof options === 'object') {
      if (options.layerDefs) {
        options.layerDefs = this.parseLayerDefs(options.layerDefs);
      }

      params = L.Util.extend(defaults, options);
    }

    L.esri.get(this.serviceUrl + '/identify', params, callback);
  },
  parseLayerDefs: function (layerDefs) {
    if (layerDefs instanceof Array) {
      //throw 'must be object or string';
      return '';
    }

    if (typeof layerDefs === 'object') {
      return JSON.stringify(layerDefs);
    }

    return layerDefs;
  }
};