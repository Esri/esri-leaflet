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
import { RasterLayer, rasterLayer } from './Layers/RasterLayer';
import { ImageMapLayer, imageMapLayer } from './Layers/ImageMapLayer';
import { DynamicMapLayer, dynamicMapLayer } from './Layers/DynamicMapLayer';
import { FeatureGrid, featureGrid } from './Layers/FeatureLayer/FeatureGrid';
import { FeatureManager, featureManager } from './Layers/FeatureLayer/FeatureManager';
import { FeatureLayer, featureLayer } from './Layers/FeatureLayer/FeatureLayer';

export var VERSION = '1.0.0';
export { Support } from './Support';
export { Util } from './Util';
export * from './Request';

export var Tasks = {
  Task, task,
  Query, query,
  Find, find,
  Identify, identify,
  IdentifyFeatures, identifyFeatures,
  IdentifyImage, identifyImage
};

export var Services = {
  Service, service,
  MapService, mapService,
  ImageService, imageService,
  FeatureLayer: FeatureLayerService, featureLayer: featureLayerService
};

export var Layers = {
  BasemapLayer, basemapLayer,
  TiledMapLayer, tiledMapLayer,
  RasterLayer, rasterLayer,
  ImageMapLayer, imageMapLayer,
  DynamicMapLayer, dynamicMapLayer
};

export { BasemapLayer };
export { basemapLayer };
export { TiledMapLayer };
export { tiledMapLayer };
export { ImageMapLayer };
export { imageMapLayer };
export { DynamicMapLayer };
export { dynamicMapLayer };
export { FeatureGrid };
export { featureGrid };
export { FeatureManager };
export { featureManager };
export { FeatureLayer };
export { featureLayer };
