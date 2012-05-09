var Travail = 	require('../travail'),
	amqp = 		require('amqp'),
	vows = 		require('vows'),
	assert = 	require('assert'),
	sinon =		require('sinon');

vows.describe('Travail').addBatch({
	'Messaging': {
		topic: function() {
			self = this;
			var configuration = new Travail.Configuration('http://localhost:6379');
			configuration.set('Messaging:AMQP_URL', 'amqp://127.0.0.1:5672', function(err, reply) {
				var messaging = new Travail.Messaging(configuration);
			
				messaging.on('ready', function() {
					self.callback(null, messaging);
				});
			});
		},
		'publish messages to the default exchange': function(err, messaging) {
			var spy = sinon.spy(amqp.Connection.prototype, "publish");
			messaging.publish('test-route', 'test-value');
			assert.isTrue(amqp.Connection.prototype.publish.calledOnce);
			assert.equal('test-route', amqp.Connection.prototype.publish.getCall(0).args[0]);
			assert.equal('test-value', amqp.Connection.prototype.publish.getCall(0).args[1]);
			amqp.Connection.prototype.publish.restore();
		},
		'publish messages to a specific exchange': function(err, messaging) {assert.ok(false);},
		'publish JSON to the default exchange': function(err, messaging) {
			var callback = sinon.spy(amqp.Connection.prototype, "publish");
			var obj = new Object();
			obj.a = 1;
			obj.b = 2;
			obj.c = 3;
			messaging.publishJson('test-route', obj);
			assert.isTrue(amqp.Connection.prototype.publish.calledOnce);
			assert.equal(amqp.Connection.prototype.publish.getCall(0).args[0], 'test-route');
			assert.equal(amqp.Connection.prototype.publish.getCall(0).args[1], '{"a":1,"b":2,"c":3}');	
			amqp.Connection.prototype.publish.restore();
		},
		'subscribe to a queue': function(err, messaging) {
			var callback = sinon.spy();
			var stub = sinon.stub(amqp.Connection.prototype, "publish", function(routingKey, message) {
				callback(message, {}, {});
			});
			messaging.subscribe('test-queue', callback);
			messaging.publish('test-queue', 'test-value');
			assert.isTrue(callback.calledOnce);
			assert.equal('test-value', callback.getCall(0).args[0]);
			amqp.Connection.prototype.publish.restore();	
		},
		'do work based on a subscription': function(err, messaging) {
			var callback = sinon.spy();
			var stub = sinon.stub(amqp.Connection.prototype, "publish", function(routingKey, message) {
				callback(message, {}, {});
			});
			messaging.subscribe('test-queue', callback);
			messaging.publish('test-queue', 'test-value');
			assert.isTrue(callback.calledOnce);
			assert.equal('test-value', callback.getCall(0).args[0]);
			amqp.Connection.prototype.publish.restore();
		},
	}
}).export(module);