describe('L.esri.Layers.ImageMapLayer', function () {
  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container).setView([37.75, -122.45], 12);
  }

  var url = 'http://services.arcgis.com/mock/arcgis/rest/services/MockImageService/ImageServer';
  var layer;
  var server;
  var map;
  var clock;

  beforeEach(function(){
    clock = sinon.useFakeTimers();
    server = sinon.fakeServer.create();
    server.respondWith('GET',new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=Image1'
    }));
    layer = L.esri.imageMapLayer(url, {
      f: 'json'
    });
    map = createMap();
  });

  afterEach(function(){
    clock.restore();
    server.restore();
    map.remove();
  });

  it('should have a L.esri.Layers.imageMapLayer alias', function(){
    expect(L.esri.Layers.imageMapLayer(url)).to.be.instanceof(L.esri.Layers.ImageMapLayer);
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
      server.respondWith('GET',new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
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

  it('should propagate events from the service', function(){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockImageService/ImageServer&f=json', JSON.stringify({
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

  it('should bring itself to the back', function(done){
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

  it('should get and set time ranges', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng24&bboxSR=3857&imageSR=3857&time=1389254400000%2C1389513600000&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithTime'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithTime');
      done();
    });

    layer.setTimeRange(new Date('January 9 2014'), new Date('January 12 2014'));
    expect(layer.getTimeRange()).to.deep.equal([new Date('January 9 2014'), new Date('January 12 2014')]);
    layer.addTo(map);
    server.respond();
  });

  it('should be able to request an image directly from the export service', function(){
    layer = L.esri.imageMapLayer(url);
    var spy = sinon.spy(layer, '_renderImage');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&bboxSR=3857&imageSR=3857&f=image/));
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