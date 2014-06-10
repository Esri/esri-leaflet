describe('L.esri.Layers.ClusteredFeatureLayer', function () {
  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container, {
      minZoom: 1,
      maxZoom: 19
    }).setView([45.51, -122.66], 5);
  }

  var layer;
  var map = createMap();
  var features = [{
    type: 'Feature',
    id: 1,
    geometry: {
      type: 'Point',
      coordinates: [-122, 45]
    },
    properties: {
      time: new Date('January 1 2014').valueOf()
    }
  },{
    type: 'Feature',
    id: 2,
    geometry: {
      type: 'Point',
      coordinates: [-123, 46]
    },
    properties: {
      time: new Date('Febuary 1 2014').valueOf()
    }
  }];
  beforeEach(function(){
    layer = L.esri.clusteredFeatureLayer('http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0', {
      timeField: 'time',
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng);
      }
    });

    layer.createLayers(features);
  });

  it('should create features on a cluster', function(){
    expect(layer.cluster.hasLayer(layer.getFeature(1))).to.equal(true);
    expect(layer.cluster.hasLayer(layer.getFeature(2))).to.equal(true);
  });

  it('should remove features on a cluster', function(){
    layer.removeLayers([1]);

    expect(layer.cluster.hasLayer(layer.getFeature(1))).to.equal(false);
    expect(layer.cluster.hasLayer(layer.getFeature(2))).to.equal(true);
  });

  it('should add features back to a cluster', function(){
    layer.removeLayers([1]);
    layer.addLayers([1]);

    expect(layer.cluster.hasLayer(layer.getFeature(1))).to.equal(true);
    expect(layer.cluster.hasLayer(layer.getFeature(2))).to.equal(true);
  });

  it('should not add features outside the time range', function(){
    layer.setTimeRange(new Date('January 1 2014'), new Date('Febuary 1 2014'));

    layer.createLayers([{
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'Point',
        coordinates: [-123, 47]
      },
      properties: {
        time: new Date('March 1 2014').valueOf()
      }
    }]);

    expect(layer.cluster.hasLayer(layer.getFeature(1))).to.equal(true);
    expect(layer.cluster.hasLayer(layer.getFeature(2))).to.equal(true);
    expect(layer.cluster.hasLayer(layer.getFeature(3))).to.equal(false);
  });

  it('should be able to add itself to a map', function(){
    layer.addTo(map);

    expect(map.hasLayer(layer)).to.equal(true);
    expect(map.hasLayer(layer.cluster)).to.equal(true);
  });

  it('should be remove itself from a map', function(){
    layer.addTo(map);
    map.removeLayer(layer);

    expect(map.hasLayer(layer)).to.equal(false);
    expect(map.hasLayer(layer.cluster)).to.equal(false);
  });

  it('should bind popups to existing features', function(){
    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    });
    expect(layer.getFeature(1)._popup.getContent()).to.equal('ID: 1');
    expect(layer.getFeature(2)._popup.getContent()).to.equal('ID: 2');
  });

  it('should bind popups to new features', function(){
    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    });

    layer.createLayers([{
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'Point',
        coordinates: [-123, 46]
      },
      properties: {
        time: new Date('Febuary 24 2014').valueOf()
      }
    }]);

    expect(layer.getFeature(3)._popup.getContent()).to.equal('ID: 3');
  });

  it('should unbind popups on features', function(){
    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    });
    layer.unbindPopup();
    expect(layer.getFeature(1)._popup).to.equal(null);
    expect(layer.getFeature(2)._popup).to.equal(null);
  });

  it('should iterate over each feautre', function(){
    var spy = sinon.spy();
    layer.eachFeature(spy);
    expect(spy).to.have.been.calledWith(layer.getFeature(1));
    expect(spy).to.have.been.calledWith(layer.getFeature(2));
  });

  it('should run a function against every feature', function(){
    var spy = sinon.spy();
    layer = L.esri.featureLayer('http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0', {
      onEachFeature: spy
    }).addTo(map);
    layer.createLayers(features);
    expect(spy.callCount).to.equal(2);
  });

  it('should iterate over each feautre', function(){
    var spy = sinon.spy();
    layer.eachFeature(spy);
    expect(spy).to.have.been.calledWith(layer.getFeature(1));
    expect(spy).to.have.been.calledWith(layer.getFeature(2));
  });

  it('should change styles on features with an object', function(){
    layer.setStyle({
      fill: 'red'
    });

    expect(layer.getFeature(1).options.fill).to.equal('red');
    expect(layer.getFeature(2).options.fill).to.equal('red');
  });

  it('should change styles on feautres with a function', function(){
    layer.setStyle(function(){
      return {
        fill: 'red'
      };
    });

    expect(layer.getFeature(1).options.fill).to.equal('red');
    expect(layer.getFeature(2).options.fill).to.equal('red');
  });

});