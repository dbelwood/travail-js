var Travail = 	require('../travail'),
	assert = 	require('assert'),
	redis = 	require('redis'),
	vows = 		require('vows'),
	assert = 	require('assert');

vows.describe('Travail').addBatch({
	'Logging': {
		topic: function() {
			logging = new Travail.Logging(new Travail.Configuration('http://localhost:6379'));
			return logging;
		},
		'it should log a message': function(topic) {assert.ok(false);},
		'it should log an info message': function(topic) {assert.ok(false);},
		'it should log an error message': function(topic) {assert.ok(false);},
		'it should log a debug message': function(topic) {assert.ok(false);},
	}
}).export(module);