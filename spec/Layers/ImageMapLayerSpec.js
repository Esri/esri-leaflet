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

  var sampleResponse = {
    'objectId' : 0,
    'name' : 'Pixel',
    'value' : '-17.5575',
    'location' :
    {
      'x': -122.81,
      'y': 45.48,
      'spatialReference' : {
        'wkid': 4326
      }
    }, 'properties' : null,
    'catalogItems' : null,
    'catalogItemVisibilities' : []
  };

  beforeEach(function(){
    clock = sinon.useFakeTimers();
    server = sinon.fakeServer.create();
    server.respondWith('GET',new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=Image1'
    }));
    layer = L.esri.imageMapLayer({
      url: url,
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
    expect(L.esri.Layers.imageMapLayer({
      url: url
    })).to.be.instanceof(L.esri.Layers.ImageMapLayer);
  });

  it('should display an attribution if one was passed', function(){
    L.esri.Layers.imageMapLayer({
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
      server.respondWith('GET',new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=json/), JSON.stringify({
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

  it('should expose the identify method on the underlying service', function(){
    var spy = sinon.spy(layer._service, 'identify');
    var identify = layer.identify();
    expect(identify).to.be.an.instanceof(L.esri.Tasks.IdentifyImage);
    expect(identify._service).to.equal(layer._service);
  });

  it('should bind a popup to the layer', function(){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/identify\?returnGeometry=false&geometry=%7B%22x%22%3A-?\d+.\d+%2C%22y%22%3A-?\d+.\d+%2C%22spatialReference%22%3A%7B%22wkid%22%3A\d+%7D%7D&geometryType=esriGeometryPoint&f=json/), JSON.stringify(sampleResponse));

    layer.bindPopup(function(error, results){
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    layer.addTo(map);

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('Pixel value: -17.5575');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should bind a popup to the layer if the layer is already on a map', function(){
     server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/identify\?returnGeometry=false&geometry=%7B%22x%22%3A-?\d+.\d+%2C%22y%22%3A-?\d+.\d+%2C%22spatialReference%22%3A%7B%22wkid%22%3A\d+%7D%7D&geometryType=esriGeometryPoint&f=json/), JSON.stringify(sampleResponse));

    layer.addTo(map);

    layer.bindPopup(function(error, results){
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('Pixel value: -17.5575');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
  });

  it('should unbind a popup from the layer', function(){
    var spy = sinon.spy(map, 'off');
    layer.addTo(map);
    layer.bindPopup(function(error, results){
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    layer.unbindPopup();

    expect(layer._popup).to.equal(false);
    expect(spy).to.have.been.calledWith('click', layer._getPopupData, layer);
    expect(spy).to.have.been.calledWith('dblclick', layer._resetPopupState, layer);
  });

  it('should unbind the popup events when the layer is removed', function(){
    var spy = sinon.spy(map, 'off');

    layer.addTo(map);
    layer.bindPopup(function(error, results){
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    map.removeLayer(layer);

    expect(spy).to.have.been.calledWith('click', layer._getPopupData, layer);
    expect(spy).to.have.been.calledWith('dblclick', layer._resetPopupState, layer);
  });

  it('should bind a popup to a layer with a mosaic rule', function(){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/identify\?returnGeometry=false&geometry=%7B%22x%22%3A-?\d+.\d+%2C%22y%22%3A-?\d+.\d+%2C%22spatialReference%22%3A%7B%22wkid%22%3A\d+%7D%7D&geometryType=esriGeometryPoint&mosaicRule=%7B%22mosaicMethod%22%3A%22esriMosaicLockRaster%22%2C%22lockRasterIds%22%3A%5B8%5D%7D&f=json/), JSON.stringify(sampleResponse));

    layer.bindPopup(function(error, results){
      return 'Pixel value: ' + results.pixel.properties.value;
    });

    layer.addTo(map);
    layer.setMosaicRule({mosaicMethod:'esriMosaicLockRaster','lockRasterIds':[8]});

    map.fire('click', {
      latlng: map.getCenter()
    });

    server.respond();

    clock.tick(301);

    expect(layer._popup.getContent()).to.equal('Pixel value: -17.5575');
    expect(layer._popup.getLatLng()).to.equal(map.getCenter());
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

  it('should get and set rendering rule', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&renderingRule=%7B%22rasterFunction%22%3A%22RFTAspectColor%22%7D&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithRenderingRule'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithRenderingRule');
      done();
    });

    layer.setRenderingRule({rasterFunction : 'RFTAspectColor'});
    expect(layer.getRenderingRule()).to.deep.equal({'rasterFunction' : 'RFTAspectColor'});
    layer.addTo(map);
    server.respond();
  });

  it('should get and set mosaic rule', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&mosaicRule=%7B%22mosaicMethod%22%3A%22esriMosaicLockRaster%22%2C%22lockRasterIds%22%3A%5B8%5D%7D&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithMosaicRule'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithMosaicRule');
      done();
    });

    layer.setMosaicRule({mosaicMethod:'esriMosaicLockRaster','lockRasterIds':[8]});
    expect(layer.getMosaicRule()).to.deep.equal({mosaicMethod:'esriMosaicLockRaster','lockRasterIds':[8]});
    layer.addTo(map);
    server.respond();
  });

  it('should get and set time ranges', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&time=1389254400000%2C1389513600000&f=json/), JSON.stringify({
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

  it('should get and set bandIds as an array param', function(done){
     server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&bandIds=3%2C0%2C1&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithBandIds'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithBandIds');
      done();
    });

    layer.setBandIds([3,0,1]);
    expect(layer.getBandIds()).to.deep.equal('3,0,1');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set bandIds as a string param', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&bandIds=3%2C0%2C1&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithBandIds'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithBandIds');
      done();
    });

    layer.setBandIds('3,0,1');
    expect(layer.getBandIds()).to.deep.equal('3,0,1');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set noData as a numeric param', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&noData=0&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithNoData'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithNoData');
      done();
    });

    layer.setNoData(0);
    expect(layer.getNoData()).to.equal('0');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set noData as an array', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&noData=58%2C128%2C187&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithNoDataArray'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithNoDataArray');
      done();
    });

    layer.setNoData([58,128,187]);
    expect(layer.getNoData()).to.deep.equal('58,128,187');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set noDataInterpretation', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&noData=0&noDataInterpretation=esriNoDataMatchAll&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithNoDataInterpretation'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithNoDataInterpretation');
      done();
    });

    layer.setNoData(0, 'esriNoDataMatchAll');
    expect(layer.getNoDataInterpretation()).to.equal('esriNoDataMatchAll');
    layer.addTo(map);
    server.respond();
  });

  it('should get and set pixelType', function(done){
    server.respondWith('GET', new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&pixelType=U8&f=json/), JSON.stringify({
      href: 'http://placehold.it/500&text=WithPixelType'
    }));

    layer.once('load', function(){
      expect(layer._currentImage._url).to.equal('http://placehold.it/500&text=WithPixelType');
      done();
    });

    layer.setPixelType('U8');
    expect(layer.getPixelType()).to.deep.equal('U8');
    layer.addTo(map);
    server.respond();
  });

  it('should be able to request an image directly from the export service', function(){
    layer = L.esri.imageMapLayer({
      url: url,
      f: 'image'
    });
    var spy = sinon.spy(layer, '_renderImage');
    layer.addTo(map);
    expect(spy.getCall(0).args[0]).to.match(new RegExp(/http:\/\/services.arcgis.com\/mock\/arcgis\/rest\/services\/MockImageService\/ImageServer\/exportImage\?bbox=-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+%2C-?\d+\.\d+&size=500%2C500&format=jpgpng&transparent=true&bboxSR=3857&imageSR=3857&f=image/));
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
