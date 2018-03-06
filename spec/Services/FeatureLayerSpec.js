/* eslint-env mocha */
describe('L.esri.FeatureLayer', function () {
  var featureServiceUrl = 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0';
  var service;

  beforeEach(function () {
    fetchMock.config.warnOnFallback = false;

    service = L.esri.featureLayerService({url: featureServiceUrl});
  });

  afterEach(function () {
    fetchMock.restore();
  });

  it('should be able to add a feature to the layer', function (done) {
    var callback = sinon.spy();

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseOpts.method).to.equal('POST');
      var requestBody = window.decodeURIComponent(responseOpts.body);
      expect(requestBody).to.equal('f=json&features=[{"geometry":{"x":45,"y":-121,"spatialReference":{"wkid":4326}},"attributes":{"foo":"bar"}}]');
      return JSON.stringify({
        'addResults': [{
          'objectId': 1,
          'success': true
        }]
      });
    });

    service.addFeature({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [45, -121]
      },
      properties: {
        foo: 'bar'
      }
    }, callback);

    service.on('requestend', function (e) {
      callback.should.have.been.calledWith(undefined, {
        'objectId': 1,
        'success': true
      });
      done();
    });
  });

  it('should be able to add a feature to the layer without a callback', function () {
    fetchMock.catch(function (responseUrl, responseOpts) {
      return JSON.stringify({
        'addResults': [{
          'objectId': 1,
          'success': true
        }]
      });
    });

    expect(function () {
      service.addFeature({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [45, -121]
        },
        properties: {
          foo: 'bar'
        }
      });
    }).to.not.throw(Error);
  });

  it('should be able to update a feature on the layer', function (done) {
    var callback = sinon.spy();
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseOpts.method).to.equal('POST');
      var requestBody = window.decodeURIComponent(responseOpts.body);
      expect(requestBody).to.equal('f=json&features=[{"geometry":{"x":45,"y":-121,"spatialReference":{"wkid":4326}},"attributes":{"foo":"bar","OBJECTID":1}}]');
      return JSON.stringify({
        'updateResults': [{
          'objectId': 1,
          'success': true
        }]
      });
    });

    service.updateFeature({
      type: 'Feature',
      id: 1,
      geometry: {
        type: 'Point',
        coordinates: [45, -121]
      },
      properties: {
        foo: 'bar'
      }
    }, callback);

    service.on('requestend', function (e) {
      callback.should.have.been.calledWith(undefined, {
        'objectId': 1,
        'success': true
      });
      done();
    });
  });

  it('should be able to update a feature on the layer without a callback', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      return JSON.stringify({
        'updateResults': [{
          'objectId': 1,
          'success': true
        }]
      });
    });
    expect(function () {
      service.updateFeature({
        type: 'Feature',
        id: 1,
        geometry: {
          type: 'Point',
          coordinates: [45, -121]
        },
        properties: {
          foo: 'bar'
        }
      });
    }).to.not.throw(Error);
    fetchMock.flush().then(function (responses) {
      done();
    });
  });

  it('should be able to remove a feature from the layer', function (done) {
    var callback = sinon.spy();

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseOpts.method).to.equal('POST');
      var requestBody = window.decodeURIComponent(responseOpts.body);
      expect(requestBody).to.equal('f=json&objectIds=1');
      return JSON.stringify({
        'deleteResults': [{
          'objectId': 1,
          'success': true
        }]
      });
    });

    service.deleteFeature(1, callback);

    service.on('requestend', function (e) {
      callback.should.have.been.calledWith(undefined, {
        'objectId': 1,
        'success': true
      });
      done();
    });
  });

  it('should be able to remove features from the layer without a callback', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      return JSON.stringify({
        'deleteResults': [{
          'objectId': 1,
          'success': true
        }]
      });
    });
    expect(function () {
      service.deleteFeature(1);
    }).to.not.throw(Error);

    fetchMock.flush().then(function (responses) {
      done();
    });
  });

  it('should be able to remove features from the layer', function (done) {
    var callback = sinon.spy();

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseOpts.method).to.equal('POST');
      var requestBody = window.decodeURIComponent(responseOpts.body);
      expect(requestBody).to.equal('f=json&objectIds=1,2');
      return JSON.stringify({
        'deleteResults': [{
          'objectId': 1,
          'success': true
        }, {
          'objectId': 2,
          'success': true
        }]
      });
    });

    service.deleteFeatures([1, 2], callback);

    service.on('requestend', function (e) {
      callback.should.have.been.calledWith(undefined, [{
        'objectId': 1,
        'success': true
      }, {
        'objectId': 2,
        'success': true
      }]);
      done();
    });
  });
});
