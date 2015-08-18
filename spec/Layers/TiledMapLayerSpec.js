describe('L.esri.TiledMapLayer', function () {
  var url = 'http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer';
  var layer;
  var server;

  beforeEach(function(){
    server = sinon.fakeServer.create();
    layer = L.esri.tiledMapLayer({
      url: url
    });
  });

  afterEach(function(){
    server.restore();
  });

  it('will assign a tile scheme to the url', function () {
    expect(layer.tileUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}');
  });

  it('will modify url for old tiles.arcgisonline.com services', function () {
    var layer = L.esri.tiledMapLayer({
      url: 'http://tiles.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer'
    });
    expect(layer.tileUrl).to.equal('http://tiles{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}');
    expect(layer.options.subdomains).to.deep.equal(['1','2','3','4']);
  });

  it('will modify url for new tiles.arcgis.com services', function () {
    var layer = L.esri.tiledMapLayer({
      url: 'http://tiles.arcgis.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer'
    });
    expect(layer.tileUrl).to.equal('http://tiles{s}.arcgis.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}');
    expect(layer.options.subdomains).to.deep.equal(['1','2','3','4']);
  });

  it('should expose the authenticate method on the underlying service', function(){
    var spy = sinon.spy(layer.service, 'authenticate');
    layer.authenticate('foo');
    expect(spy).to.have.been.calledWith('foo');
  });

  it('should expose the query method on the underlying service', function(){
    var spy = sinon.spy(layer.service, 'identify');
    var identify = layer.identify();
    expect(identify).to.be.an.instanceof(L.esri.IdentifyFeatures);
    expect(identify._service).to.equal(layer.service);
  });

  it('should propagate events from the service', function(){
    server.respondWith('GET', 'http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer&f=json', JSON.stringify({
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

  it('should have a L.esri.tiledMapLayer alias', function(){
    layer = L.esri.tiledMapLayer({
      url: url
    });
    expect(layer).to.be.instanceof(L.esri.TiledMapLayer);
  });

  it('should use a token passed in options', function(){
    layer = L.esri.tiledMapLayer({
      url: url,
      token: 'foo'
    });

    expect(layer.tileUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?token=foo');
  });

  it('should use a token passed with authenticate()', function(){
    layer = L.esri.tiledMapLayer({
      url: url
    });

    layer.authenticate('foo');

    expect(layer.tileUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?token=foo');
  });

  it('should reauthenticate with a token authenticate()', function(){
    layer = L.esri.tiledMapLayer({
      url: url,
      token: 'foo'
    });

    layer.authenticate('bar');

    expect(layer.tileUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?token=bar');
  });
});
