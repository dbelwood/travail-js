var URL = require('url'),
	redis = require('redis');

var Travail = {};
Travail.Configuration = function(url) {
	url = URL.parse(url);
	this.client = redis.createClient(url.port, url.hostname);
	this.keyPrefix = "Cfg:";
}
Travail.Configuration.prototype.quit = function() {
	this.client.quit()
}
Travail.Configuration.prototype.get = function(key, callback) {
	this.client.get(this.keyPrefix+key, function(err, reply) {
		callback(err, reply);
	});
}
Travail.Configuration.prototype.getJson = function(key, callback) {
	this.client.get(this.keyPrefix+key, function(err, reply) {
		callback(err, JSON.parse(reply));
	});
}

Travail.Configuration.prototype.getAll = function(keys, callback) {
	keys = keys.map(function(value){
		return this.keyPrefix + value;
	}, this);
	this.client.mget(keys, function(err, replies) {
		callback(err, replies);
	});
}

Travail.Configuration.prototype.set = function(key, value, callback) {
	this.client.set(this.keyPrefix+key, value, function(err, reply) {
		callback(err, reply);
	});
}

Travail.Configuration.prototype.setJson = function(key, object, callback) {
	this.set(key, JSON.stringify(object), callback);
}

Travail.Logging = function(configuration) {

}

Travail.Messaging = function(configuration) {

}

module.exports = Travail;