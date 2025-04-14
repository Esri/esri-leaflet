/* eslint-env mocha */

describe("L.esri request helpers", () => {
  let xhr;
  let requests = [];

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  afterEach(() => {
    requests = [];
  });

  const sampleResponse = {
    currentVersion: 10.2,
    fullVersion: "10.2.0",
    soapUrl: "http://services.arcgisonline.com/arcgis/services",
    secureSoapUrl: "https://services.arcgisonline.com/arcgis/services",
    authInfo: {
      isTokenBasedSecurity: "false",
    },
  };

  const sampleError = {
    error: {
      code: 500,
      message: "Error",
    },
  };

  it("should be able to make a GET request with CORS", (done) => {
    L.esri.get.CORS(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {},
      function (error, response) {
        expect(this.foo).to.equal("bar");
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
      {
        foo: "bar",
      },
    );

    expect(requests[0].url).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/info?f=json",
    );
    expect(requests[0].method).to.equal("GET");
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });

  it("should be able to make a GET request with CORS and credentials", (done) => {
    L.esri.get.CORS(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {},
      function (error, response) {
        expect(this.foo).to.equal("bar");
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
      {
        foo: "bar",
        options: {
          withCredentials: true,
        },
      },
    );

    expect(requests[0].url).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/info?f=json",
    );
    expect(requests[0].method).to.equal("GET");
    expect(requests[0].withCredentials).to.equal(true);
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });

  it("should be able to make a GET request with JSONP", (done) => {
    const request = L.esri.get.JSONP(
      "http://example.com/foo",
      {},
      function (error, response) {
        expect(this.foo).to.equal("bar");
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
      {
        foo: "bar",
      },
    );

    window._EsriLeafletCallbacks[request.id](sampleResponse);
  });

  it("should callback with an error on non-JSON reponses", (done) => {
    const request = L.esri.get.JSONP("http://example.com/foo", {}, (error) => {
      expect(error).to.deep.equal({
        error: {
          code: 500,
          message: "Expected array or object as JSONP response",
        },
      });
      done();
    });

    window._EsriLeafletCallbacks[request.id]("foo");
  });

  it("should callback with an error when an error is recived from the server", (done) => {
    const request = L.esri.get.JSONP("http://example.com/foo", {}, (error) => {
      expect(error).to.deep.equal(sampleError);
      done();
    });

    window._EsriLeafletCallbacks[request.id](sampleError);
  });

  it("should be able to make a POST request with CORS", (done) => {
    L.esri.post(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {},
      (error, response) => {
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
    );

    expect(requests[0].requestBody).to.equal("f=json");
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });

  it("should make a request with a token", (done) => {
    L.esri.request(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      { token: "foo" },
      (error, response) => {
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
    );

    expect(requests[0].url).to.contain("token=foo");
    expect(requests[0].withCredentials).to.equal(false);
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });

  it("should serialize arrays of objects as JSON", (done) => {
    L.esri.get.CORS(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {
        object: [{ foo: "bar" }],
      },
      (error, response) => {
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
    );

    expect(requests[0].url).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/info?object=%5B%7B%22foo%22%3A%22bar%22%7D%5D&f=json",
    );
    expect(requests[0].method).to.equal("GET");
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });

  it("should serialize arrays of non objects as comma seperated strings", (done) => {
    L.esri.get.CORS(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {
        array: ["foo", "bar"],
      },
      (error, response) => {
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
    );

    expect(requests[0].url).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/info?array=foo%2Cbar&f=json",
    );
    expect(requests[0].method).to.equal("GET");
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });

  it("should serialize Objects as JSON", (done) => {
    L.esri.get.CORS(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {
        object: {
          foo: "bar",
        },
      },
      (error, response) => {
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
    );

    expect(requests[0].url).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/info?object=%7B%22foo%22%3A%22bar%22%7D&f=json",
    );
    expect(requests[0].method).to.equal("GET");
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });

  it("should serialize Dates as seconds", (done) => {
    const now = new Date();
    const stamp = now.valueOf();

    L.esri.get.CORS(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {
        time: now,
      },
      (error, response) => {
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
    );

    expect(requests[0].url).to.equal(
      `http://services.arcgisonline.com/ArcGIS/rest/info?time=${stamp}&f=json`,
    );
    expect(requests[0].method).to.equal("GET");
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });

  it("should throw errors when response is not a JSON object", (done) => {
    L.esri.get.CORS(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {},
      (error) => {
        expect(error).to.deep.equal({
          message:
            "Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.",
          code: 500,
        });
        done();
      },
    );

    expect(requests[0].url).to.equal(
      "http://services.arcgisonline.com/ArcGIS/rest/info?f=json",
    );
    expect(requests[0].method).to.equal("GET");
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      "foo",
    );
  });

  it("should callback with an error when an XMLHttpRequest error is encountered", (done) => {
    const request = L.esri.post(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      {},
      (error) => {
        expect(error).to.deep.equal({
          error: {
            message: "XMLHttpRequest error",
            code: 500,
          },
        });
        done();
      },
    );

    request.onerror();
  });

  it("should setup an alias for L.esri.get", () => {
    expect(L.esri.get).to.be.a("function");
  });

  it("should setup an alias for L.esri.post", () => {
    expect(L.esri.post).to.be.a("function");
  });

  it("should encode params for a request with params with apostrophes", (done) => {
    const quotedString = "'id123'";

    L.esri.request(
      "http://services.arcgisonline.com/ArcGIS/rest/info",
      { id: quotedString },
      (error, response) => {
        expect(response).to.deep.equal(sampleResponse);
        done();
      },
    );

    const quotedStringEncoded = quotedString.replaceAll("'", "%27");
    expect(requests[0].url).to.contain(quotedStringEncoded);
    requests[0].respond(
      200,
      { "Content-Type": "text/plain; charset=utf-8" },
      JSON.stringify(sampleResponse),
    );
  });
});
