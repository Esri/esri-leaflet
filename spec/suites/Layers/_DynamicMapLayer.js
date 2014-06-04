/* globals L, describe, it, expect, beforeEach*/

describe('L.esri.DynamicMapLayer', function () {
  var map;
  var sandbox;
  var container;
  var url = 'http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Recent/MapServer';

  beforeEach(function () {
    container = document.createElement('div');
    container.setAttribute("style","width:500px; height: 500px;");
    document.body.appendChild(container);
    map = L.map(container).setView([37.75, -122.45], 12);
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('DynamicMapLayer', function () {
    it('can be assigned some non-default parameters', function () {
      var layer = L.esri.dynamicMapLayer(url, {
        format: 'jpg',
        opacity: 0.5,
        position: 'back'
      });
      expect(layer._layerParams.format).to.eql('jpg');
      expect(layer.options.opacity).to.eql(0.5);
      expect(layer.options.position).to.eql('back');
    });

    it('will not set opacity when transparent parameter is false', function () {
      var layer = L.esri.dynamicMapLayer(url, {
        transparent: false,
        opacity: 0.5
      });
      expect(layer._layerParams.transparent).to.eql(false);
      expect(layer.options.opacity).to.eql(1);
    });
  });

  it("will fire a loading event when it starts loading", function(done){
    var layer = L.esri.dynamicMapLayer(url).addTo(map);
    layer.on("loading", function(e){
      expect(e.bounds).to.be.ok;
      done();
    });
    map.panBy([50,50], {
      animate: false
    });
  });

  it("will fire a load event when it completes loading", function(){
    var layer = L.esri.dynamicMapLayer(url).addTo(map);
    layer.on("load", function(e){
      expect(e.bounds).to.be.ok;
      done();
    })
    map.panBy([50,50], {
      animate: false
    });
  });

  it("will load a new image when the map moves", function(){
    var layer = L.esri.dynamicMapLayer(url).addTo(map);
    var originalUrl;
    // listen for the first image load
    layer.once("load", function(e){
      // remember our original image url
      var originalUrl = layer._currentImage._url;

      // when the next image loads evaluate the tests
      layer.once("load", function(){
        expect(originalUrl).not.to.eql(layer._currentImage._url);
        done();
      });

      //pan the map to trigger the next load
      map.panBy([50,50], {
        animate: false
      });
    });

  });

  it("can be added to a map", function(){
    var layer = L.esri.dynamicMapLayer(url).addTo(map);
    layer.on('load', function(){
      expect(layer._currentImage).to.be.an.instanceof(L.ImageOverlay)
      expect(layer._currentImage._image._url).to.be.a('string');
      expect(layer._currentImage.bounds.equals(map.getBounds())).to.be.true;
      done();
    });
  });

  it("can be removed from a map", function(){
    var layer = L.esri.dynamicMapLayer(url).addTo(map);
    layer.on('load', function(){
      map.removeLayer(layer);
      expect(map.hasLayer(layer._currentImage)).to.be.false;
      done();
    });
  });
});