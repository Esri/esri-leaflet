// import base
export { Support, cors, pointerEvents } from './src/Support';
export { Util, shallowClone, warn, cleanUrl, isArcgisOnline, geojsonTypeToArcGIS, responseToFeatureCollection, geojsonToArcGIS, arcgisToGeojson, boundsToExtent, extentToBounds } from './src/Util';
export { Request, get, post, request } from './src/Request';

// export tasks
export { Task, task } from './src/Tasks/Task';
export { Query, query } from './src/Tasks/Query';
export { Find, find } from './src/Tasks/Find';
export { Identify, identify } from './src/Tasks/Identify';
export { IdentifyFeatures, identifyFeatures } from './src/Tasks/IdentifyFeatures';
export { IdentifyImage, identifyImage } from './src/Tasks/IdentifyImage';

// export services
export { Service, service } from './src/Services/Service';
export { MapService, mapService } from './src/Services/MapService';
export { ImageService, imageService } from './src/Services/ImageService';
export { FeatureLayerService, featureLayerService } from './src/Services/FeatureLayerService';

// export layers
export { BasemapLayer, basemapLayer } from './src/Layers/BasemapLayer';
export { TiledMapLayer, tiledMapLayer } from './src/Layers/TiledMapLayer';
export { RasterLayer } from './src/Layers/RasterLayer';
export { ImageMapLayer, imageMapLayer } from './src/Layers/ImageMapLayer';
export { DynamicMapLayer, dynamicMapLayer } from './src/Layers/DynamicMapLayer';
export { FeatureGrid } from './src/Layers/FeatureLayer/FeatureGrid';
export { FeatureManager } from './src/Layers/FeatureLayer/FeatureManager';
export { FeatureLayer, featureLayer } from './src/Layers/FeatureLayer/FeatureLayer';
