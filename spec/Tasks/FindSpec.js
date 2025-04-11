/* eslint-env mocha */

describe('L.esri.Find', () => {
	let server;
	let task;

	// create map
	const mapServiceUrl = 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer/';

	const sampleResponse = {
		results: [
			{
				layerId: 0,
				layerName: 'Features',
				displayFieldName: 'Name',
				value: '0',
				attributes: {
					OBJECTID: 1,
					Name: 'Site'
				},
				geometryType: 'esriGeometryPoint',
				geometry: {
					x: -122.81,
					y: 45.48,
					spatialReference: {
						wkid: 4326
					}
				}
			}
		]
	};

	const sampleResponseWithSearchFields = {
		results: [
			{
				layerId: 0,
				layerName: 'Features',
				displayFieldName: 'Name',
				foundFieldName: 'Field',
				value: '0',
				attributes: {
					OBJECTID: 1,
					Name: 'Site'
				},
				geometryType: 'esriGeometryPoint',
				geometry: {
					x: -122.81,
					y: 45.48,
					spatialReference: {
						wkid: 4326
					}
				}
			}
		]
	};

	const sampleResponseWithoutGeometry = {
		results: [
			{
				layerId: 0,
				layerName: 'Features',
				displayFieldName: 'Name',
				value: '0',
				attributes: {
					OBJECTID: 1,
					Name: 'Site'
				}
			}
		]
	};

	const sampleFeatureCollectionWithoutGeometry = {
		type: 'FeatureCollection',
		features: [{
			type: 'Feature',
			geometry: null,
			properties: {
				OBJECTID: 1,
				Name: 'Site'
			},
			id: 1
		}]
	};

	const sampleFeatureCollection = {
		type: 'FeatureCollection',
		features: [{
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [-122.81, 45.48]
			},
			properties: {
				OBJECTID: 1,
				Name: 'Site'
			},
			id: 1
		}]
	};

	beforeEach(() => {
		server = sinon.fakeServer.create();
		task = L.esri.find({url: mapServiceUrl});
	});

	afterEach(() => {
		server.restore();
	});

	it('should find features with provided layer id and search text', (done) => {
		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json`, JSON.stringify(sampleResponse));

		const request = task.layers('0').text('Site').run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		expect(request).to.be.an.instanceof(XMLHttpRequest);

		server.respond();
	});

	it('should find features by specified search field', (done) => {
		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&searchFields=Field&f=json`, JSON.stringify(sampleResponseWithSearchFields));

		task.layers('0').text('Site').fields('Field').run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponseWithSearchFields);
			done();
		});

		server.respond();
	});

	it('should find an exact match for the search text', (done) => {
		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=false&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json`, JSON.stringify(sampleResponse));

		task.layers('0').text('Site').contains(false).run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});

	it('should fetch unformatted results from 10.5+', (done) => {
		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&returnUnformattedValues=true&f=json`, JSON.stringify(sampleResponse));

		task.layers('0').text('Site').format(false).run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});

	it('should find features and limit geometries to a given precision', (done) => {
		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&geometryPrecision=4&f=json`, JSON.stringify(sampleResponse));

		task.layers('0').text('Site').precision(4).run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});

	it('should find features without geometry', (done) => {
		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=true&returnGeometry=false&returnZ=true&returnM=false&layers=0&searchText=Site&f=json`, JSON.stringify(sampleResponseWithoutGeometry));

		task.layers('0').text('Site').returnGeometry(false).run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollectionWithoutGeometry);
			expect(raw).to.deep.equal(sampleResponseWithoutGeometry);
			done();
		});

		server.respond();
	});

	it('should identify features with a token', (done) => {
		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&token=foo&f=json`, JSON.stringify(sampleResponse));

		task.layers('0').text('Site').token('foo').run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		server.respond();
	});

	it('should use a service to execute the find task', (done) => {
		const service = L.esri.mapService({url: mapServiceUrl});

		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json`, JSON.stringify(sampleResponse));

		const request = service.find().layers('0').text('Site').run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		expect(request).to.be.an.instanceof(XMLHttpRequest);

		server.respond();
	});

	it('should use JSONP to execute without a service', (done) => {
		const myTask = L.esri.find({
			url: mapServiceUrl,
			useCors: false
		});

		const request = myTask.layers('0').text('Site').run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		window._EsriLeafletCallbacks[request.id](sampleResponse);
	});

	it('should pass through arbitrary request parameters', (done) => {
		const myTask = L.esri.find({
			url: mapServiceUrl,
			requestParams: {
				foo: 'bar'
			}
		});

		server.respondWith('GET', `${mapServiceUrl  }find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&foo=bar&f=json`, JSON.stringify(sampleResponse));

		const request = myTask.layers('0').text('Site').run((error, featureCollection, raw) => {
			expect(featureCollection).to.deep.equal(sampleFeatureCollection);
			expect(raw).to.deep.equal(sampleResponse);
			done();
		});

		expect(request).to.be.an.instanceof(XMLHttpRequest);

		server.respond();
	});
});

