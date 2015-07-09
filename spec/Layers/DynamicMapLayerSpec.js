describe('L.esri.Layers.DynamicMapLayer', function () {
  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container).setView([37.75, -122.45], 12);
  }

  var url = 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer';
  var layer;
  var server;
  var map;
  var clock;

  var sampleResponse = {
    'results': [
      {
        'layerId': 0,
        'layerName': 'Features',
        'displayFieldName': 'Name',
        'value': '0',
        'attributes': {
          'OBJECTID': 1,
          'Name': 'Site'
        },
        'geometryType': 'esriGeometryPoint',
        'geometry': {
          'x': -122.81,
          'y': 45.48,
          'spatialReference': {
            'wkid': 4326
          }
        }
      }
    ]
  };

  beforeEach(function(){
    clock = sinon.useFakeTimers();
    server = sinon.fakeServer.create();
    server.respondWith('GET',new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=Image1'
    }));
    layer = L.esri.dynamicMapLayer({
      url: url
    });
    map = createMap();
  });

  afterEach(function(){
    clock.restore();
    server.restore();
    map.remove();
  });

 it('should have a L.esri.Layers.dynamicMapLayer alias', function(){
    expect(L.esri.Layers.dynamicMapLayer({
      url: url
    })).to.be.instanceof(L.esri.Layers.DynamicMapLayer);
  });

 it('should display an attribution if one was passed', function(){
    L.esri.Layers.dynamicMapLayer({
      url: url,
      attribution: 'Esri'
    }).addTo(map);

    expect(map.attributionControl._container.innerHTML).to.contain('Esri');
 });

  it('will fire a loading event when it starts loading', function(done){
    layer.on('loading', function(e){
      expect(e.type).to.equal('loading');
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('will fire a load event when it completes loading', function(done){
    layer.on('load', function(e){
      expect(e.type).to.equal('load');
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('will load a new image when the map moves', function(done){
    layer.addTo(map);

    layer.once('load', function(){
      layer.once('load', function(){
        expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=Image2');
        done();
      });
      clock.tick(151);
      map.setView([ 37.30, -121.96], 10);
      server.respondWith('GET',new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
        href: 'http://placehold.it/500&text=Image2'
      }));
      server.respond();
    });
    server.respond();
  });

  it('can be added to a map', function(done){
    layer.on('load', function(){
      expect(layer._currentImage).to.be.an.instanceof(L.ImageOverlay);
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=Image1');
      expect(layer._currentImage._bounds).to.deep.equal(map.getBounds());
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('can be removed from a map', function(done){
    layer.on('load', function(){
      layer.removeFrom(map);
      expect(map.hasLayer(layer._currentImage)).to.equal(false);
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should expose the authenticate method on the underlying service', function(){
    var spy = sinon.spy(layer._service, 'authenticate');
    layer.authenticate('foo');
    expect(spy).to.have.been.calledWith('foo');
  });

  it('should expose the identify method on the underlying service', function(){
    var spy = sinon.spy(layer._service, 'identify');
    var identify = layer.identify();
    expect(identify).to.be.an.instanceof(L.esri.Tasks.IdentifyFeatures);
    expect(identify._service).to.equal(layer._service);
  });

  it('should propagate events from the service', function(){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer&f=json', JSON.stringify({
      currentVersion: 10.2
    }));

    var requeststartSpy = sinon.spy();
    var requestendSpy = sinon.spy();

    layer.on('requeststart', requeststartSpy);
    layer.on('requestend', requestendSpy);

    layer.metadata(function(){});

    server.respond();

    expect(requeststartSpy.callCount).to.be.above(0);
    expect(requestendSpy.callCount).to.be.above(0);
  });

  it('should bring itself to the front', function(done){
    layer.on('load', function(){
      var spy = sinon.spy(layer._currentImage, 'bringToFront');
      layer.bringToFront();
      expect(spy.callCount).to.be.above(0);
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should bring itself to the front', function(done){
    layer.on('load', function(){
      var spy = sinon.spy(layer._currentImage, 'bringToBack');
      layer.bringToBack();
      expect(spy.callCount).to.be.above(0);
      done();
    });
    layer.addTo(map);
    server.respond();
  });

  it('should get and set opacity', function(done){
    expect(layer.getOpacity()).to.equal(1);

    layer.on('load', function(){
      var spy = sinon.spy(layer._currentImage, 'setOpacity');
      layer.setOpacity(0.5);
      expect(layer.getOpacity()).to.equal(0.5);
      expect(spy.callCount).to.be.above(0);
      done();
    });

    layer.addTo(map);
    server.respond();
  });

  it('should get and set visible layers', function(done){

    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&layers=show%3A0%2C1%2C2&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithLayers'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithLayers');
      done();
    });

    layer.setLayers([0, 1, 2]);
    expect(layer.getLayers()).to.deep.equal([0, 1, 2]);
    layer.addTo(map);
    server.respond();
  });

  it('should get and set time ranges', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&time=1389254400000%2C1389513600000&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithTime'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithTime');
      done();
    });

    layer.setTimeRange(new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800'));
    expect(layer.getTimeRange()).to.deep.equal([new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800')]);
    layer.addTo(map);
    server.respond();
  });

  it('should get and set extra time options', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&timeOptions=%7B%22foo%22%3A%22bar%22%7D&time=1389254400000%2C1389513600000&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithTime&TimeOptions'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithTime&TimeOptions');
      done();
    });

    layer.setTimeRange(new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800'));
    expect(layer.getTimeRange()).to.deep.equal([new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800')]);
    layer.setTimeOptions({ foo: 'bar' });
    expect(layer.getTimeOptions()).to.deep.equal({ foo: 'bar' });
    layer.addTo(map);
    server.respond();
  });

  it('should get and set layer definitions', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&layerDefs=%7B%221%22%3A%22Foo%3DBar%22%7D&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithDefs'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithDefs');
      done();
    });

    layer.setLayerDefs({ 1: 'Foo=Bar' });
    expect(layer.getLayerDefs()).to.deep.equal({ 1: 'Foo=Bar' });

    layer.addTo(map);
    server.respond();
  });

  it('should pass a token if one is set', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&token=foo&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithToken'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithToken');
      done();
    });

    layer.authenticate('foo');
    layer.addTo(map);
    server.respond();
  });

  it('should be able to request an image directly from the export service', function(){
    layer = L.esri.dynamicMapLayer({
      url: url,
      f: 'image'
    });
    var spy = sinon.spy(layer, '_renderImage');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/export\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&dpi=96&format=png24&transparent=true&bboxSR=3857&imageSR=3857&f=image/));
  });

  it('should bind a popup to the layer', function(){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/identify\?sr=4326&layers=visible&tolerance=3&returnGeometry=true&imageDisplay=500%2C500%2C96&mapExtent=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&geometry=-?\d+\.\d+%2C-?\d+\.\d+&geometryType=esriGeometryPoint&f=json/), JSON.stringify(sampleResponse));

    layer.bindPopup(function(error, featureCollection){
      return featureCollection.features.length  + ' Feature(s)';
    });

    layer.addTo(map);

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('1 Feature(s)');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should bind a popup to the layer if the layer is already on a map', function(){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockMapService\/MapServer\/identify\?sr=4326&layers=visible&tolerance=3&returnGeometry=true&imageDisplay=500%2C500%2C96&mapExtent=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&geometry=-?\d+\.\d+%2C-?\d+\.\d+&geometryType=esriGeometryPoint&f=json/), JSON.stringify(sampleResponse));

    layer.addTo(map);

    layer.bindPopup(function(error, featureCollection){
      return featureCollection.features.length  + ' Feature(s)';
    });

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('1 Feature(s)');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should unbind a popup from the layer', function(){
    var spy = sinon.spy(map, 'off');
    layer.addTo(map);
    layer.bindPopup(function(error, featureCollection){
      return featureCollection.features.length  + ' Feature(s)';
    });

    layer.unbindPopup();

    expect(layer._popup).to.equal(false);
    expect(spy).to.have.been.calledWith('click', layer._getPopupData, layer);
    expect(spy).to.have.been.calledWith('dblclick', layer._resetPopupState, layer);
  });

  it('should unbind the popup events when the layer is removed', function(){
    var spy = sinon.spy(map, 'off');

    layer.addTo(map);

    layer.bindPopup(function(error, featureCollection){
      return featureCollection.features.length  + ' Feature(s)';
    });

    map.removeLayer(layer);

    expect(spy).to.have.been.calledWith('click', layer._getPopupData, layer);
    expect(spy).to.have.been.calledWith('dblclick', layer._resetPopupState, layer);
  });

  it('should render an images at the back if specified', function(done){
    layer.bringToBack();
    var spy = sinon.spy(layer, 'bringToBack');
    layer.on('load', function(){
      expect(spy.callCount).to.equal(1);
      done();
    });
    layer.addTo(map);
    server.respond();
  });

});
