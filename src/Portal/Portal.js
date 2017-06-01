import { Service } from '../Services/Service';
import { cleanUrl } from '../Util';

export var Portal = Service.extend({
	portalUrls: {},
	  options: {
	    url: "https://www.arcgis.com",
	    f: 'json'
	  },
	  on: function(type, handler){
	  		switch (type) {
	      case 'portal-loaded':
	      		L.Evented.prototype.on.call(this, 'portal-loaded', handler);
	        break; 
	      default: 
	        return;
	  		}
	  },
	  initialize: function(options) {
	  	  var portal = this;
	    var token = options.token ? options.token : null;
	    if (!token) return console.log("Portal::initalize is missing token");
	    this.options.url = options.url ? cleanUrl(options.url) : options.url;
	    if ((options.proxy || options.token) && options.f !== 'json') {
	      options.f = 'json';
	    }
	    L.Util.setOptions(this, options);
	    return this.self({
	      'token': token
	    }, function(error, response) {
	      if (options.callback) {
	        options.callback.call(this, error, response);
	        if (response) {
	        	  portal.updatePortalPaths(response);
	          L.Evented.prototype.fire.call(portal, 'portal-loaded');
	        }
	      }
	    });
	  },
	  updatePortalPaths: function(self) {
	  	  this.portalUrls.sharing = '/sharing/rest/';
	    this.portalUrls.portals = '/sharing/rest/portals/';
	    this.portalUrls.portal = '/sharing/rest/portals/' + self.id + '/';
	    this.portalUrls.servers = '/sharing/rest/portals/' + self.id + '/servers/'; //http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Servers/02r300000218000000/
	    this.portalUrls.content = '/sharing/rest/content/';
	    this.portalUrls.usercontent = '/sharing/rest/content/users/' + self.user.username + '/';
	    this.portalUrls.useritems = '/sharing/rest/content/users/' + self.user.username + '/items/';
	    this.portalUrls.itemurl = '/sharing/rest/content/items/';
	    this.portalUrls.community = '/sharing/rest/community/';
	    this.portalUrls.groups = '/sharing/rest/community/groups/';
	    this.portalUrls.notifications = '/sharing/rest/content/users/' + self.user.username + '/notifications/';
	  },
	  message: function(text) {
	    console.log(this.options.format);
	  },
	  self: function(opts, callback, context) {
	    var path = '/sharing/rest/portals/self';
	    var token = opts.token ? opts.token : function() {
	      console.log("Portal::self is missing token");
	      return;
	    }
	    return this.post(path, {
	      token: token
	    }, function(error, response) {
	      var result = (response) ? response : undefined;
	      if (callback) {
	        callback.call(context, error, result);
	      }
	    }, context);
	  },
	  query: function(opts){
		  var path = this.portalUrls.sharing + 'search';
      var token = opts.token ? opts.token : function() {
        console.log("Portal::query is missing token");
        return;
      }
      return this.get(path, {
        token: token,
        q:opts.where,
        start:opts.start
      }, function(error, response) {
        if (opts.callback) {
          opts.callback.call(this, error, response);
        }
     });
	}
});
export function portal (options) {
  return new Portal(options);
}

export default portal;
