/* eslint-env mocha */

describe('L.esri.IdentifyImage', () => {
	function deepClone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	function createMap() {
		// create container
		const container = document.createElement('div');

		// give container a width/height
		container.setAttribute('style', 'width:500px; height: 500px;');

		// add contianer to body
		document.body.appendChild(container);

		return L.map(container).setView([45.51, -122.66], 16);
	}

	let server;
	let task;

	// create map
	const map = createMap();

	const latlng = map.getCenter();
	const rawLatlng = [45.51, -122.66];

	const imageServiceUrl = 'http://services.arcgis.com/mock/arcgis/rest/services/MockImageService/ImageServer/';

	const sampleResponse = {
		objectId: 0,
		name: 'Pixel',
		value: '-17.5575',
		location: {
			x: -122.81,
			y: 45.48,
			spatialReference: {
				wkid: 4326
			}
		},
		properties: null,
		catalogItems: null,
		catalogItemVisibilities: []
	};

	const sampleResults = {
		pixel: {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [-122.81, 45.48]
			},
			crs: {
				type: 'EPSG',
				properties: {
					code: 4326
				}
			},
			properties: {
				OBJECTID: 0,
				name: 'Pixel',
				value: '-17.5575'
			},
			id: 0
		}
	};

	const sampleResponseWithCatalogItems = {
		objectId: 0,
		name: 'Pixel',
		value: '17, 22, 39, 45',
		location:
    {
    	x: -13527177.6374152,
    	y: 5837991.41167063,
    	spatialReference: {
    		wkid: 54004
    	}
    },
		properties:
    {
    	Values: [
    		'10 18 34 43',
    		'17 22 39 45'
    	]
    },
		catalogItems:
    {
    	objectIdFieldName: 'OBJECTID',
    	spatialReference: {
    		wkid: 54004
    	},
    	geometryType: 'esriGeometryPolygon',
    	features: [
    		{
    			geometry:
          {
          	rings:
            [
            	[
            		[-78.3984375, -1.7575368113083125],
            		[-78.3984375, 3.162455530237848],
            		[-72.421875, 3.162455530237848],
            		[-72.421875, -1.7575368113083125],
            		[-78.3984375, -1.7575368113083125]
            	]
            ]
          },
    			attributes:
          {
          	OBJECTID: 6,
          	Name: 'p046r028_7t19990907.met;p046r028_7t19990907.met',
          	MinPS: 0,
          	MaxPS: 28.5,
          	LowPS: 14.25,
          	HighPS: 114,
          	Category: 1,
          	Tag: 'Pansharpened',
          	GroupName: 'p046r028_7t19990907',
          	ProductName: 'Level1',
          	CenterX: -13624980.3112093,
          	CenterY: 5756154.02144619,
          	ZOrder: null,
          	SOrder: null,
          	StereoID: '',
          	SensorName: 'Landsat-7-ETM+',
          	AcquisitionDate: 936662400000,
          	SunAzimuth: 150.8831799,
          	SunElevation: 46.5205819,
          	CloudCover: 0,
          	Shape_Length: 1058133.67231272,
          	Shape_Area: 69904833443.6272
          }
    		},
    		{
    			geometry:
          {
          	rings:
            [
            	[
            		[56.6015625, 44.08758502824516],
            		[56.6015625, 53.74871079689897],
            		[84.0234375, 53.74871079689897],
            		[84.0234375, 44.08758502824516],
            		[56.6015625, 44.08758502824516]
            	]
            ]
          },
    			attributes:
          {
          	OBJECTID: 2,
          	Name: 'p045r028_7t19991002.met;p045r028_7t19991002.met',
          	MinPS: 0,
          	MaxPS: 28.5,
          	LowPS: 14.25,
          	HighPS: 114,
          	Category: 1,
          	Tag: 'Pansharpened',
          	GroupName: 'p045r028_7t19991002',
          	ProductName: 'Level1',
          	CenterX: -13456998.9817332,
          	CenterY: 5756986.51347787,
          	ZOrder: null,
          	SOrder: null,
          	StereoID: '',
          	SensorName: 'Landsat-7-ETM+',
          	AcquisitionDate: 938822400000,
          	SunAzimuth: 157.6031865,
          	SunElevation: 37.975699,
          	CloudCover: 50,
          	Shape_Length: 1058012.72377166,
          	Shape_Area: 69884678121.7441
          }
    		}
    	]
    },
		catalogItemVisibilities: [
			0.671180049953907,
			0.328819950035319
		]
	};

	const sampleResultsWithCatalogItems = {
		pixel: {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [-13527177.6374152, 5837991.41167063]
			},
			crs: {
				type: 'EPSG',
				properties: {
					code: 54004
				}
			},
			properties: {
				OBJECTID: 0,
				name: 'Pixel',
				value: '17, 22, 39, 45',
				values: [
					'10 18 34 43',
					'17 22 39 45'
				]
			},
			id: 0
		},
		catalogItems: {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Polygon',
						coordinates: [
							[
								[56.6015625, 44.08758502824516],
								[84.0234375, 44.08758502824516],
								[84.0234375, 53.74871079689897],
								[56.6015625, 53.74871079689897],
								[56.6015625, 44.08758502824516]
							]
						]
					},
					properties: {
						OBJECTID: 2,
						Name: 'p045r028_7t19991002.met;p045r028_7t19991002.met',
						MinPS: 0,
						MaxPS: 28.5,
						LowPS: 14.25,
						HighPS: 114,
						Category: 1,
						Tag: 'Pansharpened',
						GroupName: 'p045r028_7t19991002',
						ProductName: 'Level1',
						CenterX: -13456998.9817332,
						CenterY: 5756986.51347787,
						ZOrder: null,
						SOrder: null,
						StereoID: '',
						SensorName: 'Landsat-7-ETM+',
						AcquisitionDate: 938822400000,
						SunAzimuth: 157.6031865,
						SunElevation: 37.975699,
						CloudCover: 50,
						Shape_Length: 1058012.72377166,
						Shape_Area: 69884678121.7441,
						catalogItemVisibility: 0.671180049953907
					},
					id: 2
				},
				{
					type: 'Feature',
					geometry: {
						type: 'Polygon',
						coordinates: [
							[
								[-78.3984375, -1.7575368113083125],
								[-72.421875, -1.7575368113083125],
								[-72.421875, 3.162455530237848],
								[-78.3984375, 3.162455530237848],
								[-78.3984375, -1.7575368113083125]
							]
						]
					},
					properties: {
						OBJECTID: 6,
						Name: 'p046r028_7t19990907.met;p046r028_7t19990907.met',
						MinPS: 0,
						MaxPS: 28.5,
						LowPS: 14.25,
						HighPS: 114,
						Category: 1,
						Tag: 'Pansharpened',
						GroupName: 'p046r028_7t19990907',
						ProductName: 'Level1',
						CenterX: -13624980.3112093,
						CenterY: 5756154.02144619,
						ZOrder: null,
						SOrder: null,
						StereoID: '',
						SensorName: 'Landsat-7-ETM+',
						AcquisitionDate: 936662400000,
						SunAzimuth: 150.8831799,
						SunElevation: 46.5205819,
						CloudCover: 0,
						Shape_Length: 1058133.67231272,
						Shape_Area: 69904833443.6272,
						catalogItemVisibility: 0.328819950035319
					},
					id: 6
				}
			]
		}
	};

	beforeEach(() => {
		server = sinon.fakeServer.create();
		task = L.esri.identifyImage({url: imageServiceUrl}).at(latlng);
	});

	afterEach(() => {
		server.restore();
	});

	it('should identify a pixel value at location', (done) => {
		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&f=json`, JSON.stringify(sampleResponse));

		const request = task.run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResults);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		expect(request).to.be.an.instanceof(XMLHttpRequest);

		server.respond();
	});

	it('should identify a pixel value at location with simple LatLng', (done) => {
		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&f=json`, JSON.stringify(sampleResponse));

		const request = task.at(rawLatlng).run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResults);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		expect(request).to.be.an.instanceof(XMLHttpRequest);

		server.respond();
	});

	it('should identify a pixel value with mosaic rule', (done) => {
		const mosaicRule = {mosaicMethod: 'esriMosaicLockRaster', lockRasterIds: [8]};
		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&mosaicRule=%7B%22mosaicMethod%22%3A%22esriMosaicLockRaster%22%2C%22lockRasterIds%22%3A%5B8%5D%7D&f=json`, JSON.stringify(sampleResponse));

		task.setMosaicRule(mosaicRule);
		expect(task.getMosaicRule()).to.deep.equal(mosaicRule);

		task.run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResults);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});

	it('should identify a pixel value with rendering rule', (done) => {
		const renderingRule = {rasterFunction: 'RFTAspectColor'};
		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&renderingRule=%7B%22rasterFunction%22%3A%22RFTAspectColor%22%7D&f=json`, JSON.stringify(sampleResponse));

		task.setRenderingRule(renderingRule);
		expect(task.getRenderingRule()).to.deep.equal(renderingRule);

		task.run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResults);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});

	it('should identify a pixel value with a pixel size array', (done) => {
		const pixelSize = [15, 15];

		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&pixelSize=15%2C15&f=json`, JSON.stringify(sampleResponse));

		task.setPixelSize(pixelSize);

		expect(task.getPixelSize()).to.equal(pixelSize);

		task.run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResults);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});

	it('should identify a pixel value with a pixel size string', (done) => {
		const pixelSize = '1,1';

		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&pixelSize=1%2C1&f=json`, JSON.stringify(sampleResponse));

		task.setPixelSize(pixelSize);
		expect(task.getPixelSize()).to.equal(pixelSize);

		task.run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResults);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});

	it('should return catalog items', (done) => {
		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=true&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&returnCatalogItems=true&f=json`, JSON.stringify(sampleResponseWithCatalogItems));

		task.returnGeometry(true).returnCatalogItems(true);
		task.run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResultsWithCatalogItems);
			expect(raw).to.deep.equal(sampleResponseWithCatalogItems);
			done();
		});

		server.respond();
	});

	it('should return catalog items w/o geometry', (done) => {
		const sampleResponseWithCatalogItemsNoGeometry = deepClone(sampleResponseWithCatalogItems);
		const sampleResultsWithCatalogItemsNoGeomerty = deepClone(sampleResultsWithCatalogItems);
		for (let i = sampleResponseWithCatalogItemsNoGeometry.catalogItems.features.length - 1; i >= 0; i--) {
			delete (sampleResponseWithCatalogItemsNoGeometry.catalogItems.features[i].geometry);
			sampleResultsWithCatalogItemsNoGeomerty.catalogItems.features[i].geometry = null;
		}
		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&returnCatalogItems=true&f=json`, JSON.stringify(sampleResponseWithCatalogItemsNoGeometry));

		task.returnCatalogItems(true);
		task.run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResultsWithCatalogItemsNoGeomerty);
			expect(raw).to.deep.equal(sampleResponseWithCatalogItemsNoGeometry);
			done();
		});

		server.respond();
	});

	it('should pass through arbitrary parameters', (done) => {
		const customTask = L.esri.identifyImage({
			url: imageServiceUrl,
			requestParams: {
				foo: 'bar'
			}
		}).at(latlng);

		server.respondWith('GET', `${imageServiceUrl  }identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&foo=bar&f=json`, JSON.stringify(sampleResponse));

		customTask.run((error, results, raw) => {
			expect(results).to.deep.equal(sampleResults);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});
});

