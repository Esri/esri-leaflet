// import base
import { Support } from './Support';
import {Util } from './Util';
import {Request, get, post, request} from './Request';

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

export var VERSION = '1.0.0';

export { get }
export { post }
export { request }
export { Request }

export { Support }
export { Util }

export { Task }
export { task }
export { Query }
export { query }
export { Find }
export { find }
export { Identify }
export { identify }
export { IdentifyFeatures }
export { identifyFeatures }
export { IdentifyImage }
export { identifyImage }

export { Service }
export { service }
export { MapService }
export { mapService }
export { ImageService }
export { imageService }
export { FeatureLayerService }
export { featureLayerService }

export { BasemapLayer }
export { basemapLayer }
export { TiledMapLayer }
export { tiledMapLayer }
export { RasterLayer }

export { ImageMapLayer }
export { imageMapLayer }
export { DynamicMapLayer }
export { dynamicMapLayer }
export { FeatureGrid }

export { FeatureManager }

export { FeatureLayer }
export { featureLayer }

var EsriLeaflet = {
  VERSION: '1.0.0',
  Support: Support,
  Util: Util,
  get: get,
  post: post,
  request: request,
  Tasks: {
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
  },
  Services: {
    Service: Service,
    service: service,
    MapService: MapService,
    mapService: mapService,
    ImageService: ImageService,
    imageService: imageService,
    FeatureLayerService: FeatureLayerService,
    featureLayerService: featureLayerService
  },
  Layers: {
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
  },
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

if(window && window.L) {
  window.L.esri = EsriLeaflet;
}

export default EsriLeaflet;
