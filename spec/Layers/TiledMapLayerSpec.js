/* eslint-env mocha */

describe("L.esri.TiledMapLayer", () => {
  function createMap() {
    // create container
    const container = document.createElement("div");

    // give container a width/height
    container.setAttribute("style", "width:500px; height: 500px;");

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container).setView([37.75, -122.45], 12);
  }

  const url =
    "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer";
  const urlWithParams =
    "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer?foo=bar";
  const subdomainsUrl =
    "http://{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer";
  const subdomainsArray = ["server", "services"];
  let layer;
  let server;
  let map;

  beforeEach(() => {
    server = sinon.fakeServer.create();
    layer = L.esri.tiledMapLayer({
      url,
    });
    map = createMap();
  });

  afterEach(() => {
    server.restore();
  });

  it("will assign a tile scheme to the url", () => {
    expect(layer.tileUrl).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}",
    );
  });

  it("will modify url for old tiles.arcgisonline.com services", () => {
    const layer = L.esri.tiledMapLayer({
      url: "http://tiles.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
    });
    expect(layer.tileUrl).to.equal(
      "http://tiles{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}",
    );
    expect(layer.options.subdomains).to.deep.equal(["1", "2", "3", "4"]);
  });

  it("will modify url for new tiles.arcgis.com services", () => {
    const layer = L.esri.tiledMapLayer({
      url: "http://tiles.arcgis.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer",
    });
    expect(layer.tileUrl).to.equal(
      "http://tiles{s}.arcgis.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}",
    );
    expect(layer.options.subdomains).to.deep.equal(["1", "2", "3", "4"]);
  });

  it("will modify url for service with subdomains", () => {
    const layer = L.esri.tiledMapLayer({
      url: subdomainsUrl,
      subdomains: subdomainsArray,
    });

    expect(layer.options.url).to.equal(
      "http://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/",
    );
  });

  it("should expose the authenticate method on the underlying service", () => {
    const spy = sinon.spy(layer.service, "authenticate");
    layer.authenticate("foo");
    expect(spy).to.have.been.calledWith("foo");
  });

  it("should expose the query method on the underlying service", () => {
    // var spy = sinon.spy(layer.service, 'identify');
    const identify = layer.identify();
    expect(identify).to.be.an.instanceof(L.esri.IdentifyFeatures);
    expect(identify._service).to.equal(layer.service);
  });

  it("should propagate events from the service", () => {
    server.respondWith(
      "GET",
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer&f=json",
      JSON.stringify({
        currentVersion: 10.2,
      }),
    );

    const requeststartSpy = sinon.spy();
    const requestendSpy = sinon.spy();

    layer.on("requeststart", requeststartSpy);
    layer.on("requestend", requestendSpy);

    layer.metadata(() => {});

    server.respond();

    expect(requeststartSpy.callCount).to.be.above(0);
    expect(requestendSpy.callCount).to.be.above(0);
  });

  it("should have a L.esri.tiledMapLayer alias", () => {
    layer = L.esri.tiledMapLayer({
      url,
    });
    expect(layer).to.be.instanceof(L.esri.TiledMapLayer);
  });

  it("should use a token passed in options", () => {
    layer = L.esri.tiledMapLayer({
      url,
      token: "foo",
    });

    expect(layer.tileUrl).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?token=foo",
    );
  });

  it("should store additional params passed in url", () => {
    layer = L.esri.tiledMapLayer({
      url: urlWithParams,
    });

    expect(layer.options.requestParams).to.deep.equal({ foo: "bar" });
    expect(layer.tileUrl).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?foo=bar",
    );
  });

  it("should use additional params passed in options", () => {
    layer = L.esri.tiledMapLayer({
      url,
      requestParams: {
        foo: "bar",
      },
    });

    expect(layer.tileUrl).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?foo=bar",
    );
  });

  it("should use an apikey passed in options", () => {
    layer = L.esri.tiledMapLayer({
      url,
      apikey: "abc123",
    });

    expect(layer.tileUrl).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?token=abc123",
    );
  });

  it("should use a token passed with authenticate()", () => {
    layer = L.esri.tiledMapLayer({
      url,
    });

    layer.authenticate("foo");

    expect(layer.tileUrl).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?token=foo",
    );
  });

  it("should reauthenticate with a token authenticate()", () => {
    layer = L.esri.tiledMapLayer({
      url,
      token: "foo",
    });

    layer.authenticate("bar");

    expect(layer.tileUrl).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}?token=bar",
    );
  });

  it("should display an attribution if one was passed", () => {
    L.esri
      .tiledMapLayer({
        url,
        attribution: "Esri",
      })
      .addTo(map);

    expect(map.attributionControl._container.innerHTML).to.contain("Esri");
  });

  it("should display a metadata attribution if one is present and no attribution option was passed", () => {
    server.respondWith(
      "GET",
      "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/?f=json",
      JSON.stringify({
        copyrightText: "foo",
        spatialReference: {
          wkid: 102100,
          latestWkid: 3857,
        },
        tileInfo: {
          rows: 256,
          cols: 256,
          dpi: 96,
          format: "JPEG",
          compressionQuality: 90,
          origin: {
            x: -20037508.342787,
            y: 20037508.342787,
          },
          spatialReference: {
            wkid: 102100,
            latestWkid: 3857,
          },
          lods: [
            {
              level: 0,
              resolution: 156543.03392800014,
              scale: 5.91657527591555e8,
            },
            {
              level: 1,
              resolution: 78271.51696399994,
              scale: 2.95828763795777e8,
            },
            {
              level: 2,
              resolution: 39135.75848200009,
              scale: 1.47914381897889e8,
            },
          ],
        },
      }),
    );

    layer = L.esri
      .tiledMapLayer({
        url,
      })
      .addTo(map);

    server.respond();
    expect(map.attributionControl._container.innerHTML).to.contain("foo");
  });
});
