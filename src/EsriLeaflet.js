// import leaflet to ensure a gloabl
import L from 'leaflet';

// import base
import { Support } from './Support.js';
import { Util } from './Util.js';
import { get, post, request } from './Request.js';

// import tasks
import { Task, task } from './Tasks/Task.js';
import { Query, query } from './Tasks/Query.js';
import { Find, find } from './Tasks/Find.js';
import { Identify, identify } from './Tasks/Identify.js';
import { IdentifyFeatures, identifyFeatures } from './Tasks/IdentifyFeatures.js';
import { IdentifyImage, identifyImage } from './Tasks/IdentifyImage.js';

// export services
import { Service, service } from './Services/Service.js';
import { MapService, mapService } from './Services/MapService.js';
import { ImageService, imageService } from './Services/ImageService.js';
import { FeatureLayerService, featureLayerService } from './Services/FeatureLayerService.js';

// export layers
import { BasemapLayer, basemapLayer } from './Layers/BasemapLayer.js';
import { TiledMapLayer, tiledMapLayer } from './Layers/TiledMapLayer.js';
import { RasterLayer } from './Layers/RasterLayer.js';
import { ImageMapLayer, imageMapLayer } from './Layers/ImageMapLayer.js';
import { DynamicMapLayer, dynamicMapLayer } from './Layers/DynamicMapLayer.js';
import { FeatureGrid } from './Layers/FeatureLayer/FeatureGrid.js';
import { FeatureManager } from './Layers/FeatureLayer/FeatureManager.js';
import { FeatureLayer, featureLayer } from './Layers/FeatureLayer/FeatureLayer.js';

export var VERSION = '2.0.0-beta.3';
export { Support };
export { Util };
export { get };
export { post };
export { request };

export var Tasks = {
  Task: Task,
  task: task,
  Query: Query,
  query: query,
  Find: Find,
  find: find,
  Identify: Identify,
  identify: identify,
  IdentifyFeatures: IdentifyFeatures,
  identifyFeatures: identifyFeatures,
  IdentifyImage: IdentifyImage,
  identifyImage: identifyImage
};

export var Services = {
  Service: Service,
  service: service,
  MapService: MapService,
  mapService: mapService,
  ImageService: ImageService,
  imageService: imageService,
  FeatureLayerService: FeatureLayerService,
  featureLayerService: featureLayerService
};

export var Layers = {
  BasemapLayer: BasemapLayer,
  basemapLayer: basemapLayer,
  TiledMapLayer: TiledMapLayer,
  tiledMapLayer: tiledMapLayer,
  RasterLayer: RasterLayer,
  ImageMapLayer: ImageMapLayer,
  imageMapLayer: imageMapLayer,
  DynamicMapLayer: DynamicMapLayer,
  dynamicMapLayer: dynamicMapLayer,
  FeatureGrid: FeatureGrid,
  FeatureManager: FeatureManager,
  FeatureLayer: FeatureLayer,
  featureLayer: featureLayer
};

export { BasemapLayer };
export { basemapLayer };
export { TiledMapLayer };
export { tiledMapLayer };
export { RasterLayer };
export { ImageMapLayer };
export { imageMapLayer };
export { DynamicMapLayer };
export { dynamicMapLayer };
export { FeatureGrid };
export { FeatureManager };
export { FeatureLayer };
export { featureLayer };

var _isAmd = (typeof define === 'undefined') ? false : define.amd && typeof define === 'function';
var _isCjs = (typeof exports === 'object') && (typeof module !== 'undefined');
var _isSystem = window && window.System;

if ((_isAmd || _isCjs || _isSystem) && window && window.L) {
  window.L.esri = {
    VERSION: VERSION,
    Support: Support,
    Util: Util,
    get: get,
    post: post,
    request: request,
    Tasks: Tasks,
    Services: Services,
    Layers: Layers,
    BasemapLayer: BasemapLayer,
    basemapLayer: basemapLayer,
    TiledMapLayer: TiledMapLayer,
    tiledMapLayer: tiledMapLayer,
    RasterLayer: RasterLayer,
    ImageMapLayer: ImageMapLayer,
    imageMapLayer: imageMapLayer,
    DynamicMapLayer: DynamicMapLayer,
    dynamicMapLayer: dynamicMapLayer,
    FeatureGrid: FeatureGrid,
    FeatureManager: FeatureManager,
    FeatureLayer: FeatureLayer,
    featureLayer: featureLayer
  };
}
