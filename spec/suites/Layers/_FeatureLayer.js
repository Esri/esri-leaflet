/* globals L, describe, beforeEach, afterEach, it, expect, Terraformer*/

describe('L.esri.FeatureLayer', function () {
  var map,
      container,
      sandbox,
      url = 'http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/';

  beforeEach(function () {
    // create container
    container = document.createElement('div');

    // give container a width/height
    container.setAttribute("style","width:500px; height: 500px;");

    // add contianer to body
    document.body.appendChild(container);

    // create map
    map = L.map(container).setView([37.75, -122.45], 12);

    // create sandbox
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('#constructor', function () {
    describe('when a FeatureLayer is first created', function () {
      it('will have an spatial index (rbush)', function () {
        var rbush = sandbox.spy(L.esri, '_rbush'),
            featLayer = L.esri.featureLayer(url);
        expect(rbush.calledOnce).to.be.ok();
        expect(featLayer.index).to.be.ok();
      });
    });
  });

  describe('#onAdd, #onRemove, #updateFeatures', function () {
    describe('when a FeatureLayer is added to the map', function () {
      it('should generate a feature grid with 4 cells', function(){
        var featLayer = L.esri.featureLayer(url);

        featLayer.addTo(map);

        expect(featLayer._previousCells.length).to.equal(4);
      })
    });
  });
});