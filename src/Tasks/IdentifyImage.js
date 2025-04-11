import { latLng } from "leaflet";
import { Identify } from "./Identify.js";
import { responseToFeatureCollection } from "../Util.js";

export const IdentifyImage = Identify.extend({
  setters: {
    setMosaicRule: "mosaicRule",
    setRenderingRule: "renderingRule",
    setPixelSize: "pixelSize",
    returnCatalogItems: "returnCatalogItems",
    returnGeometry: "returnGeometry",
  },

  params: {
    returnGeometry: false,
  },

  at(latlng) {
    latlng = latLng(latlng);
    this.params.geometry = JSON.stringify({
      x: latlng.lng,
      y: latlng.lat,
      spatialReference: {
        wkid: 4326,
      },
    });
    this.params.geometryType = "esriGeometryPoint";
    return this;
  },

  getMosaicRule() {
    return this.params.mosaicRule;
  },

  getRenderingRule() {
    return this.params.renderingRule;
  },

  getPixelSize() {
    return this.params.pixelSize;
  },

  run(callback, context) {
    return this.request(function (error, response) {
      callback.call(
        context,
        error,
        response && this._responseToGeoJSON(response),
        response,
      );
    }, this);
  },

  // get pixel data and return as geoJSON point
  // populate catalog items (if any)
  // merging in any catalogItemVisibilities as a propery of each feature
  _responseToGeoJSON(response) {
    const location = response.location;
    const catalogItems = response.catalogItems;
    const catalogItemVisibilities = response.catalogItemVisibilities;
    const geoJSON = {
      pixel: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [location.x, location.y],
        },
        crs: {
          type: "EPSG",
          properties: {
            code: location.spatialReference.wkid,
          },
        },
        properties: {
          OBJECTID: response.objectId,
          name: response.name,
          value: response.value,
        },
        id: response.objectId,
      },
    };

    if (response.properties && response.properties.Values) {
      geoJSON.pixel.properties.values = response.properties.Values;
    }

    if (catalogItems && catalogItems.features) {
      geoJSON.catalogItems = responseToFeatureCollection(catalogItems);
      if (
        catalogItemVisibilities &&
        catalogItemVisibilities.length === geoJSON.catalogItems.features.length
      ) {
        for (let i = catalogItemVisibilities.length - 1; i >= 0; i--) {
          geoJSON.catalogItems.features[i].properties.catalogItemVisibility =
            catalogItemVisibilities[i];
        }
      }
    }
    return geoJSON;
  },
});

export function identifyImage(params) {
  return new IdentifyImage(params);
}

export default identifyImage;
