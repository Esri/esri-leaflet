describe('L.esri.Layers.FeatureGrid', function () {
  var MockGrid;
  var grid;
  var map;
  var clock;

  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container);
  }

  beforeEach(function(){
    MockGrid = L.esri.Layers.FeatureGrid.extend({
      createCell: sinon.spy(),
      cellEnter: sinon.spy(),
      cellLeave: sinon.spy()
    });
    grid = new MockGrid();
    map = createMap();
    clock = sinon.useFakeTimers();
  });

  afterEach(function(){
    clock.restore();
    map.remove();
  });

  it('should create cells based on the view of the map', function(){
    map.setView([0,0,], 1);
    grid.addTo(map);
    expect(grid.createCell.getCall(0).args[1].equals(L.point([0,0]))).to.equal(true);
  });

  it('should create cells when the map zooms in', function(){
    map.setView([0,0], 1);
    grid.addTo(map);
    map.zoomIn();
    clock.tick(1000);
    expect(grid.cellLeave.getCall(0).args[1].equals(L.point([0,0,1]))).to.equal(true);
    expect(grid.cellLeave.getCall(1).args[1].equals(L.point([1,0,1]))).to.equal(true);
    expect(grid.cellLeave.getCall(2).args[1].equals(L.point([0,1,1]))).to.equal(true);
    expect(grid.cellLeave.getCall(3).args[1].equals(L.point([1,1,1]))).to.equal(true);

    expect(grid.createCell.getCall(4).args[1].equals(L.point([0,0,2]))).to.equal(true);
    expect(grid.createCell.getCall(5).args[1].equals(L.point([1,0,2]))).to.equal(true);
    expect(grid.createCell.getCall(6).args[1].equals(L.point([0,1,2]))).to.equal(true);
    expect(grid.createCell.getCall(7).args[1].equals(L.point([1,1,2]))).to.equal(true);
  });

  it('should create cells when the map is panned', function(){
    map.setView([0,0], 4);

    grid.addTo(map);

    map.panBy([256,256], {
      animate: false,
      duration: 0
    });

    clock.tick(1000);

    expect(grid.createCell.getCall(4).args[1].equals(L.point([5,4,4]))).to.equal(true);
    expect(grid.createCell.getCall(5).args[1].equals(L.point([4,5,4]))).to.equal(true);
  });

});