/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri request helpers', function () {
  beforeEach(function () {
    fetchMock.config.warnOnFallback = false;
  });

  afterEach(function () {
    fetchMock.restore();
  });

  var sampleResponse = {
    currentVersion: 10.3,
    fullVersion: '10.3.0',
    soapUrl: 'http://services.arcgisonline.com/arcgis/services',
    secureSoapUrl: 'https://services.arcgisonline.com/arcgis/services',
    authInfo: {
      'isTokenBasedSecurity': false
    }
  };

  var sampleError = {
    error: {
      code: 500,
      message: 'Error'
    }
  };

  it('should be able to make a GET request with CORS', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?f=json');
      expect(responseOpts.method).to.equal('GET');
      return sampleResponse;
    });
    L.esri.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function (error, response) {
      expect(this.foo).to.equal('bar');
      expect(response).to.deep.equal(sampleResponse);
      done();
    }, {
      foo: 'bar'
    });
  });

  it('should be able to make a GET request with JSONP', function (done) {
    var request = L.esri.get.JSONP('http://example.com/foo', {}, function (error, response) {
      expect(this.foo).to.equal('bar');
      expect(response).to.deep.equal(sampleResponse);
      done();
    }, {
      foo: 'bar'
    });

    window._EsriLeafletCallbacks[request.id](sampleResponse);
  });

  it('should callback with an error on non-JSON reponses', function (done) {
    var request = L.esri.get.JSONP('http://example.com/foo', {}, function (error) {
      expect(error).to.deep.equal({
        error: {
          code: 500,
          message: 'Expected array or object as JSONP response'
        }
      });
      done();
    });

    window._EsriLeafletCallbacks[request.id]('foo');
  });

  it('should callback with an error when an error is recived from the server', function (done) {
    var request = L.esri.get.JSONP('http://example.com/foo', {}, function (error) {
      expect(error).to.deep.equal(sampleError);
      done();
    });

    window._EsriLeafletCallbacks[request.id](sampleError);
  });

  it('should be able to make a POST request with CORS', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseOpts.body).to.equal('f=json');
      return sampleResponse;
    });
    L.esri.post('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function (error, response) {
      expect(response).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should make a request with a token', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('token=foo');
      return sampleResponse;
    });
    L.esri.request('http://services.arcgisonline.com/ArcGIS/rest/info', { token: 'foo' }, function (error, response) {
      expect(response).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should serialize arrays of objects as JSON', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?f=json&object=%5B%7B%22foo%22%3A%22bar%22%7D%5D');
      expect(responseOpts.method).to.equal('GET');
      return sampleResponse;
    });
    L.esri.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      object: [{foo: 'bar'}]
    }, function (error, response) {
      expect(response).to.deep.equal(sampleResponse);
      fetchMock.restore();
      done();
    });
  });

  it('should serialize arrays of non objects as comma seperated strings', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?f=json&array=foo%2Cbar');
      expect(responseOpts.method).to.equal('GET');
      return sampleResponse;
    });
    L.esri.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      array: ['foo', 'bar']
    }, function (error, response) {
      expect(response).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should serialize Objects as JSON', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?f=json&object=%7B%22foo%22%3A%22bar%22%7D');
      expect(responseOpts.method).to.equal('GET');
      return sampleResponse;
    });
    L.esri.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      object: {
        foo: 'bar'
      }
    }, function (error, response) {
      expect(response).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should serialize Dates as seconds', function (done) {
    var now = new Date();
    var stamp = now.valueOf();

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?f=json&time=' + stamp);
      expect(responseOpts.method).to.equal('GET');
      return sampleResponse;
    });

    L.esri.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      time: now
    }, function (error, response) {
      expect(response).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should throw errors when response is not a JSON object', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?f=json');
      expect(responseOpts.method).to.equal('GET');
      return 'foo';
    });
    L.esri.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function (error) {
      expect(error).to.deep.equal({
        message: 'Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.',
        code: 500
      });
      done();
    });
  });

  it('should callback with an error when an XMLHttpRequest error is encountered', function (done) {
    var request = L.esri.post('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function (error, response) {
      expect(error).to.deep.equal({
        error: {
          message: 'XMLHttpRequest error',
          code: 500
        }
      });
      done();
    });

    request.onerror();
  });

  it('should setup an alias for L.esri.get', function () {
    expect(L.esri.get).to.be.a('function');
  });

  it('should setup an alias for L.esri.post', function () {
    expect(L.esri.post).to.be.a('function');
  });
});
/* eslint-enable handle-callback-err */
