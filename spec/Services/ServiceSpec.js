/* eslint-env mocha */

describe("L.esri.Service", () => {
  const serviceUrl =
    "http://services.arcgis.com/mock/arcgis/rest/services/MockService";
  let service;
  let server;

  beforeEach(() => {
    server = sinon.fakeServer.create();
    service = L.esri.service({ url: serviceUrl });
  });

  afterEach(() => {
    server.restore();
  });

  it("should make GET requests", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.get("route", {}, (error, response) => {
      expect(response).to.deep.equal({ foo: "bar" });
      done();
    });

    server.respond();
  });

  it("should make GET requests w/ JSONP", (done) => {
    service.options.useCors = false;

    const request = service.get("route", {}, (error, response) => {
      expect(response).to.deep.equal({ foo: "bar" });
      done();
    });

    window._EsriLeafletCallbacks[request.id]({ foo: "bar" });
  });

  it("should make POST requests", (done) => {
    server.respondWith(
      "POST",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.post("route", {}, (error, response) => {
      expect(response).to.deep.equal({ foo: "bar" });
      done();
    });

    server.respond();
  });

  it("should get service metadata", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/?f=json",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.metadata((error, response) => {
      expect(response).to.deep.equal({ foo: "bar" });
      done();
    });

    server.respond();
  });

  it("should fire a requeststart event", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?foo=bar&f=json",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.on("requeststart", (e) => {
      expect(e.type).to.equal("requeststart");
      expect(e.url).to.equal(
        "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route",
      );
      expect(e.params).to.deep.equal({ foo: "bar" });
      done();
    });

    service.get(
      "route",
      {
        foo: "bar",
      },
      () => {},
    );

    server.respond();
  });

  it("should fire a requestend event", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?foo=bar&f=json",
      JSON.stringify({ foo: "bar" }),
    );

    service.on("requestend", (e) => {
      expect(e.type).to.equal("requestend");
      expect(e.url).to.equal(
        "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route",
      );
      expect(e.params).to.deep.equal({
        foo: "bar",
        f: "json",
      });
      done();
    });

    service.get(
      "route",
      {
        foo: "bar",
      },
      () => {},
    );

    server.respond();
  });

  it("should fire a requestsuccess event", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?foo=bar&f=json",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.on("requestsuccess", (e) => {
      expect(e.type).to.equal("requestsuccess");
      expect(e.url).to.equal(
        "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route",
      );
      expect(e.params).to.deep.equal({
        foo: "bar",
        f: "json",
      });
      expect(e.response).to.deep.equal({ foo: "bar" });
      done();
    });

    service.get(
      "route",
      {
        foo: "bar",
      },
      () => {},
    );

    server.respond();
  });

  it("should fire a requesterror event", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?foo=bar&f=json",
      JSON.stringify({
        error: {
          code: 500,
          message: "Error",
        },
      }),
    );

    service.on("requesterror", (e) => {
      expect(e.type).to.equal("requesterror");
      expect(e.url).to.equal(
        "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route",
      );
      expect(e.code).to.equal(500);
      expect(e.message).to.equal("Error");
      expect(e.params).to.deep.equal({
        foo: "bar",
        f: "json",
      });
      done();
    });

    service.get(
      "route",
      {
        foo: "bar",
      },
      () => {},
    );

    server.respond();
  });

  it("should use a proxy", (done) => {
    service.options.proxy = "/proxy";

    server.respondWith(
      "GET",
      "/proxy?http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.get("route", {}, (error, response) => {
      expect(response).to.deep.equal({ foo: "bar" });
      done();
    });

    server.respond();
  });

  it("should fire an authenticationrequired event and reauthenticate", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json",
      JSON.stringify({
        error: {
          code: 499,
          message: "Auth",
        },
      }),
    );

    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json&token=foo",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.on("authenticationrequired", (e) => {
      e.authenticate("foo");
      server.respond();
    });

    service.get("route", {}, (error, response) => {
      expect(response).to.deep.equal({ foo: "bar" });
      done();
    });

    server.respond();
  });

  it("should allow users to authenticate on an authentication error", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json",
      JSON.stringify({
        error: {
          code: 499,
          message: "Auth",
        },
      }),
    );

    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json&token=foo",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.get("route", {}, (error, response) => {
      if (error && error.authenticate) {
        error.authenticate("foo");
        server.respond(); // authenticate will trigger another request we should respond to
        return;
      }
      expect(response).to.deep.equal({ foo: "bar" });
      done();
    });

    server.respond();
  });

  it("should queue requests and run them when authenticated", (done) => {
    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json",
      JSON.stringify({
        error: {
          code: 499,
          message: "Auth",
        },
      }),
    );

    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json&token=foo",
      JSON.stringify({
        foo: "bar",
      }),
    );

    server.respondWith(
      "GET",
      "http://services.arcgis.com/mock/arcgis/rest/services/MockService/other/route?token=foo&f=json",
      JSON.stringify({
        foo: "bar",
      }),
    );

    service.on("authenticationrequired", (e) => {
      service.get("other/route", {}, (error, response) => {
        expect(response).to.deep.equal({ foo: "bar" });
        done();
      });

      e.authenticate("foo");

      server.respond();
    });

    service.get("route", {}, () => {});

    server.respond();
  });
});
