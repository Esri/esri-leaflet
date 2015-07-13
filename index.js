// import base
import { Support } from './Support';
import { Util } from './Util';
import { Request, get, post, request } from './Request';

// import tasks
import { Task, task } from './Tasks/Task';
import { Query, query } from './Tasks/Query';
import { Find, find } from './Tasks/Find';
import { Identify, identify } from './Tasks/Identify';
import { IdentifyFeatures, identifyFeatures } from './Tasks/IdentifyFeatures';
import { IdentifyImage, identifyImage } from './Tasks/IdentifyImage';

// export services
import { Service, service } from './Services/Service';
import { MapService, mapService } from './Services/MapService';
import { ImageService, imageService } from './Services/ImageService';
import { FeatureLayerService, featureLayerService } from './Services/FeatureLayerService';

// export layers
import { BasemapLayer, basemapLayer } from './Layers/BasemapLayer';
import { TiledMapLayer, tiledMapLayer } from './Layers/TiledMapLayer';
import { RasterLayer } from './Layers/RasterLayer';
import { ImageMapLayer, imageMapLayer } from './Layers/ImageMapLayer';
import { DynamicMapLayer, dynamicMapLayer } from './Layers/DynamicMapLayer';
import { FeatureGrid } from './Layers/FeatureLayer/FeatureGrid';
import { FeatureManager } from './Layers/FeatureLayer/FeatureManager';
import { FeatureLayer, featureLayer } from './Layers/FeatureLayer/FeatureLayer';

export default {
  Support,
  Util,
  Request,
  get,
  post,
  request,
  Task, task,
  Query, query,
  Find, find,
  Identify, identify,
  IdentifyFeatures, identifyFeatures,
  IdentifyImage, identifyImage,
  Service, service,
  MapService, mapService,
  ImageService, imageService,
  FeatureLayerService, featureLayerService,
  BasemapLayer, basemapLayer,
  TiledMapLayer, tiledMapLayer,
  RasterLayer,
  ImageMapLayer, imageMapLayer,
  DynamicMapLayer, dynamicMapLayer,
  FeatureGrid,
  FeatureManager,
  FeatureLayer, featureLayer
}
