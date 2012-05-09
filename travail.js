var URL = 	require('url'),
	util = 	require('util'),
	events = require('events'),
	redis = require('redis'),
	amqp = 	require('amqp');

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

Travail.Messaging = function(configuration) {
	var self = this;
	configuration.get('Messaging:AMQP_URL', function(err, reply) {
		self.connection = amqp.createConnection({url: reply});
		self.connection.on('ready', function(err, reply) {
			self.emit('ready');	
		});
	});
	events.EventEmitter.call(this);
}
util.inherits(Travail.Messaging, events.EventEmitter);
module.exports = Travail;
Travail.Messaging.prototype.publish = function(routingKey, value) {
	this.connection.publish(routingKey, value);
}
Travail.Messaging.prototype.publishJson = function(routingKey, object) {
	this.publish(routingKey, JSON.stringify(object));
}
Travail.Messaging.prototype.subscribe = function(queue, subscriptionOptions, callback) {
	this.connection.queue(queue, function(queue) {
		queue.on('basicConsumeOk', function() {
			console.log('subscribed.');
		});
		if (callback === null) {
			if (subscriptionOptions instanceof Function) {
				callback = subscriptionOptions;
				queue.subscribe(callback);
			}
			else {
				console.error("subscriptionOptions is optional, but a callback function is required.");
			}
		}
		else {
			queue.subscribe(subscriptionOptions, callback);
		}
	});
}

Travail.Logging = function(configuration) {

}