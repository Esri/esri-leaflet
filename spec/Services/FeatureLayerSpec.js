describe('L.esri.Services.FeatureLayer', function () {
  var url = 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0';
  var service;
  var xhr;
  var requests = [];

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };

    service = L.esri.Services.featureLayer(url);
  });

  afterEach(function(){
    requests = [];
  });

  it('should be able to add a feature to the layer', function(){
    var callback = sinon.spy();

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

    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify({
      'addResults' : [{
        'objectId' : 1,
        'success' : true
      }]
    }));

    var requestBody = window.decodeURIComponent(requests[0].requestBody);

    expect(requestBody).to.equal('features=[{"geometry":{"x":45,"y":-121,"spatialReference":{"wkid":4326}},"attributes":{"foo":"bar"}}]&f=json');

    callback.should.have.been.calledWith(undefined, {
      'objectId' : 1,
      'success' : true
    });
  });

  it('should be able to update a feature on the layer', function(){
    var callback = sinon.spy();

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

    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify({
      'updateResults' : [{
        'objectId' : 1,
        'success' : true
      }]
    }));

    var requestBody = window.decodeURIComponent(requests[0].requestBody);

    expect(requestBody).to.equal('features=[{"geometry":{"x":45,"y":-121,"spatialReference":{"wkid":4326}},"attributes":{"foo":"bar","OBJECTID":1}}]&f=json');

    callback.should.have.been.calledWith(undefined, {
      'objectId' : 1,
      'success' : true
    });
  });

  it('should be able to remove features from the layer', function(){
    var callback = sinon.spy();

    service.deleteFeature(1, callback);

    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify({
      'deleteResults' : [{
        'objectId' : 1,
        'success' : true
      }]
    }));

    var requestBody = window.decodeURIComponent(requests[0].requestBody);

    expect(requestBody).to.equal('objectIds=1&f=json');

    callback.should.have.been.calledWith(undefined, {
      'objectId' : 1,
      'success' : true
    });
  });
});