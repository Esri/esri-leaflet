export var VERSION = '2.0.0-beta.3';

// import base
export { Support } from './Support.js';
export { Util } from './Util.js';
export { get, post, request } from './Request.js';

// export tasks
export { Task, task } from './Tasks/Task.js';
export { Query, query } from './Tasks/Query.js';
export { Find, find } from './Tasks/Find.js';
export { Identify, identify } from './Tasks/Identify.js';
export { IdentifyFeatures, identifyFeatures } from './Tasks/IdentifyFeatures.js';
export { IdentifyImage, identifyImage } from './Tasks/IdentifyImage.js';

// export services
export { Service, service } from './Services/Service.js';
export { MapService, mapService } from './Services/MapService.js';
export { ImageService, imageService } from './Services/ImageService.js';
export { FeatureLayerService, featureLayerService } from './Services/FeatureLayerService.js';

// export layers
export { BasemapLayer, basemapLayer } from './Layers/BasemapLayer.js';
export { TiledMapLayer, tiledMapLayer } from './Layers/TiledMapLayer.js';
export { RasterLayer } from './Layers/RasterLayer.js';
export { ImageMapLayer, imageMapLayer } from './Layers/ImageMapLayer.js';
export { DynamicMapLayer, dynamicMapLayer } from './Layers/DynamicMapLayer.js';
export { FeatureGrid } from './Layers/FeatureLayer/FeatureGrid.js';
export { FeatureManager } from './Layers/FeatureLayer/FeatureManager.js';
export { FeatureLayer, featureLayer } from './Layers/FeatureLayer/FeatureLayer.js';
