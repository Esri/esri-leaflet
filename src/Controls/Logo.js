EsriLeaflet.Controls.Logo = L.Control.extend({
  options: {
    position: 'bottomright',
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginRight: 0
  },

  onAdd: function () {
    var div = L.DomUtil.create('div', 'esri-leaflet-logo');
    div.style.marginTop = this.options.marginTop;
    div.style.marginLeft = this.options.marginLeft;
    div.style.marginBottom = this.options.marginBottom;
    div.style.marginRight = this.options.marginRight;
    div.innerHTML = this._adjustLogo(this._map._size);

    this._map.on('resize', function(e){
      div.innerHTML = this._adjustLogo(e.newSize);
    }, this);

    return div;
  },

  _adjustLogo: function (mapSize) {
    if (mapSize.x <= 600 || mapSize.y <= 600){
      return '<a href="https://developers.arcgis.com" style="border: none;"><img src="https://js.arcgis.com/3.13/esri/images/map/logo-sm.png" alt="Powered by Esri" style="border: none;"></a>';
    }
    else {
      return '<a href="https://developers.arcgis.com" style="border: none;"><img src="https://js.arcgis.com/3.13/esri/images/map/logo-med.png" alt="Powered by Esri" style="border: none;"></a>';
    }
  }

});

EsriLeaflet.Controls.logo = function(options){
  return new L.esri.Controls.Logo(options);
};
