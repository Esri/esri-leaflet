/* globals Terraformer:true, L:true, Esri:true, console:true */

L.esri = {};

L.esri.Util = {
  extentToBounds: function(extent){
    var southWest = new L.LatLng(extent.xmin, extent.ymin);
    var northEast = new L.LatLng(extent.xmax, extent.ymin);
    return new L.LatLngBounds(southWest, northEast);
  },

  boundsToExtent: function(bounds) {
    return {
      "xmin": bounds.getSouthWest().lng,
      "ymin": bounds.getSouthWest().lat,
      "xmax": bounds.getNorthEast().lng,
      "ymax": bounds.getNorthEast().lat,
      "spatialReference": {
        "wkid" : 4326
      }
    };
  },
  boundsToEnvelope: function(bounds){
    var extent = L.esri.Util.boundsToExtent(bounds);
    return {
      x: extent.xmin,
      y: extent.ymin,
      w: Math.abs(extent.xmin - extent.ymax),
      h: Math.abs(extent.ymin - extent.ymax)
    };
  }
};