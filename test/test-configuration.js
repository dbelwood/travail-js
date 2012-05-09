var Travail = 	require('../travail'),
	redis = 	require('redis'),
	vows = 		require('vows'),
	assert = 	require('assert');

vows.describe('Travail').addBatch({
	'Configuration': {
		topic: function() {
			configuration = new Travail.Configuration('http://localhost:6379');
			obj = new Object();
			obj.a = 1;
			obj.b = 2;
			obj.c = 3;
			return {configuration: configuration, obj: obj};
		},
		'sets a key with a string value': function(topic) {
			topic.configuration.set('test-key', 'test-value', function(err, reply) {
				if (err != null) {
					console.log(err);
				}
				assert.equal(err, null);
				assert.equal(reply, 'OK');
			});
		},
		'sets a key with a JSON object': function(topic) {
			topic.configuration.setJson('test-json', topic.obj, function(err, reply) {
				if (err != null) {
					console.log(err);
				}
				assert.equal(err, null);
				assert.equal(reply, 'OK');
			});
		},
		'gets a string value': function(topic) {
			topic.configuration.get('test-key', function(err, reply) {
				if (err != null) {
					console.log(err);
				}
				assert.equal(err, null);
				assert.equal(reply, 'test-value');
			});
		},
		'gets a JSON object': function(topic) {
			topic.configuration.getJson('test-json', function(err, reply) {
			if (err != null) {
				console.log(err);
			}
			assert.equal(err, null);
			assert.ok(reply instanceof Object);
			assert.equal(reply.a, topic.obj.a);
			assert.equal(reply.b, topic.obj.b);
			assert.equal(reply.c, topic.obj.c);
		});
		},
		'gets a series of values based on an array of keys': function(topic) {
			topic.configuration.getAll(['test-key', 'test-json'], function(err, replies) {
				if (err != null) {
					console.log(err);
				}
				assert.equal(err, null);
				assert.equal(replies.length, 2);
				assert.equal(replies[0], 'test-value');
				assert.equal(replies[1], JSON.stringify(topic.obj));
			});
		},
		'quits gracefully': function(topic) {
			topic.configuration.quit();
		}
	}
}).export(module);