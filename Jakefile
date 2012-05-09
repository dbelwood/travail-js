desc('Run all tests');
namespace('tests', function() {
	task('runTests', ['tests:setupTests'], function() {
		var tests = [
		'vows test/test-*.js'
		];
		jake.exec(tests, function() {
			console.log("All tests passed.");
			jake.Task['tests:teardownTests'].invoke();
			complete();
		}, {stdout: true});
	});
	task('setupTests', function() {
		var startCommands = [
		'redis-server test/redis.conf'
		//, 'rabbitmq-server &'
		]
		jake.exec(startCommands, function() {
			complete();
		}, {stdout: true});
	});
	task('teardownTests', function() {
		console.log("Tearing down.");
		var stopCommands = [
		'killall redis-server'
		//, 'rabbitmqctl stop'
		]
		jake.exec(stopCommands, function() {
			console.log("Services stopped.");
			complete();
		}, {stdout: true});
	});
});
task('test', ['tests:runTests']);