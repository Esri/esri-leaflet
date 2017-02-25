// export version
export {version as VERSION} from '../package.json';

// import base
export { Support } from './Support';
export { options } from './Options';
export { EsriUtil as Util } from './Util';
export { get, post, request } from './Request';

// export tasks
export { Task, task } from './Tasks/Task';
export { Query, query } from './Tasks/Query';
export { Find, find } from './Tasks/Find';
export { Identify, identify } from './Tasks/Identify';
export { IdentifyFeatures, identifyFeatures } from './Tasks/IdentifyFeatures';
export { IdentifyImage, identifyImage } from './Tasks/IdentifyImage';

// export services
export { Service, service } from './Services/Service';
export { MapService, mapService } from './Services/MapService';
export { ImageService, imageService } from './Services/ImageService';
export { FeatureLayerService, featureLayerService } from './Services/FeatureLayerService';

// export layers
export { BasemapLayer, basemapLayer } from './Layers/BasemapLayer';
export { TiledMapLayer, tiledMapLayer } from './Layers/TiledMapLayer';
export { RasterLayer } from './Layers/RasterLayer';
export { ImageMapLayer, imageMapLayer } from './Layers/ImageMapLayer';
export { DynamicMapLayer, dynamicMapLayer } from './Layers/DynamicMapLayer';
export { FeatureManager } from './Layers/FeatureLayer/FeatureManager';
export { FeatureLayer, featureLayer } from './Layers/FeatureLayer/FeatureLayer';
