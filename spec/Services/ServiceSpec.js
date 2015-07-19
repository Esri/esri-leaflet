describe('L.esri.Service', function () {
  var serviceUrl = 'http://services.arcgis.com/mock/arcgis/rest/services/MockService';
  var service;
  var server;

  beforeEach(function(){
    server = sinon.fakeServer.create();
    service = L.esri.Services.service({url: serviceUrl});
  });

  afterEach(function(){
    server.restore();
  });

  it('should make GET requests', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json', JSON.stringify({
      foo: 'bar'
    }));

    service.get('route', {}, function(error, response){
      expect(response).to.deep.equal({foo:'bar'});
      done();
    });

    server.respond();
  });

  it('should make GET requests w/ JSONP', function(done){
    service.options.useCors = false;

    var request = service.get('route', {}, function(error, response){
      expect(response).to.deep.equal({foo:'bar'});
      done();
    });

    window._EsriLeafletCallbacks[request.id]({foo:'bar'});
  });

  it('should make POST requests', function(done){
    server.respondWith('POST', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route', JSON.stringify({
      foo: 'bar'
    }));

    service.post('route', {}, function(error, response){
      expect(response).to.deep.equal({foo:'bar'});
      done();
    });

    server.respond();
  });

  it('should get service metadata', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/?f=json', JSON.stringify({
      foo: 'bar'
    }));

    service.metadata(function(error, response){
      expect(response).to.deep.equal({foo:'bar'});
      done();
    });

    server.respond();

  });

  it('should fire a requeststart event', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?foo=bar&f=json', JSON.stringify({
      foo: 'bar'
    }));

    service.on('requeststart', function(e){
      expect(e.type).to.equal('requeststart');
      expect(e.url).to.equal('http://services.arcgis.com/mock/arcgis/rest/services/MockService/route');
      expect(e.params).to.deep.equal({foo: 'bar'});
      done();
    });

    service.get('route', {
      foo: 'bar'
    }, function(){});

    server.respond();
  });

  it('should fire a requestend event', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?foo=bar&f=json', JSON.stringify({      foo: 'bar'
    }));

    service.on('requestend', function(e){
      expect(e.type).to.equal('requestend');
      expect(e.url).to.equal('http://services.arcgis.com/mock/arcgis/rest/services/MockService/route');
      expect(e.params).to.deep.equal({
        foo: 'bar',
        f: 'json'
      });
      done();
    });

    service.get('route', {
      foo: 'bar'
    }, function(){});

    server.respond();
  });

  it('should fire a requestsuccess event', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?foo=bar&f=json', JSON.stringify({
      foo: 'bar'
    }));

    service.on('requestsuccess', function(e){
      expect(e.type).to.equal('requestsuccess');
      expect(e.url).to.equal('http://services.arcgis.com/mock/arcgis/rest/services/MockService/route');
      expect(e.params).to.deep.equal({
        foo: 'bar',
        f: 'json'
      });
      expect(e.response).to.deep.equal({foo: 'bar'});
      done();
    });

    service.get('route', {
      foo: 'bar'
    }, function(){});

    server.respond();
  });

  it('should fire a requesterror event', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?foo=bar&f=json', JSON.stringify({
      error: {
        code: 500,
        message: 'Error'
      }
    }));

    service.on('requesterror', function(e){
      expect(e.type).to.equal('requesterror');
      expect(e.url).to.equal('http://services.arcgis.com/mock/arcgis/rest/services/MockService/route');
      expect(e.code).to.equal(500);
      expect(e.message).to.equal('Error');
      expect(e.params).to.deep.equal({
        foo: 'bar',
        f: 'json'
      });
      done();
    });

    service.get('route', {
      foo: 'bar'
    }, function(){});

    server.respond();
  });

  it('should use a proxy', function(done){
    service.options.proxy = '/proxy';

    server.respondWith('GET', '/proxy?http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json', JSON.stringify({
      foo: 'bar'
    }));

    service.get('route', {}, function(error, response){
      expect(response).to.deep.equal({foo:'bar'});
      done();
    });

    server.respond();
  });

  it('should fire an authenticationrequired event and reauthenticate', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json', JSON.stringify({
      error: {
        code: 499,
        message: 'Auth'
      }
    }));

    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json&token=foo', JSON.stringify({
      foo: 'bar'
    }));

    service.on('authenticationrequired', function(e){
      e.authenticate('foo');
      server.respond();
    });

    service.get('route', {}, function(error, response){
      expect(response).to.deep.equal({foo:'bar'});
      done();
    });

    server.respond();
  });

  it('should allow users to authenticate on an authentication error', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json', JSON.stringify({
      error: {
        code: 499,
        message: 'Auth'
      }
    }));

    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json&token=foo', JSON.stringify({
      foo: 'bar'
    }));


    service.get('route', {}, function(error, response){
      if(error && error.authenticate) {
        error.authenticate('foo');
        server.respond(); // authenticate will trigger another request we should respond to
        return;
      };
      expect(response).to.deep.equal({foo:'bar'});
      done();

    });

    server.respond();
  });


  it('should queue requests and run them when authenticated', function(done){
    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json', JSON.stringify({
      error: {
        code: 499,
        message: 'Auth'
      }
    }));

    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/route?f=json&token=foo', JSON.stringify({
      foo: 'bar'
    }));

    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/other/route?token=foo&f=json', JSON.stringify({
      foo: 'bar'
    }));

    service.on('authenticationrequired', function(e){
      service.get('other/route', {}, function(error, response){
        expect(response).to.deep.equal({foo:'bar'});
        done();
      });

      e.authenticate('foo');

      server.respond();
    });

    service.get('route', {}, function(){});

    server.respond();
  });

});
