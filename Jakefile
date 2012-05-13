desc('Run all tests');
namespace('tests', function() {
	task('runTests', ['tests:setupTests'], function() {
		var tests = [
		'vows --spec test/test-*.js'
		];
		jake.exec(tests, function() {
			jake.Task['tests:teardownTests'].invoke();
			complete();
		}, {stdout: true});
	});
	task('setupTests', function() {
		console.log("Starting services...")
		var startCommands = [
		'redis-server test/redis.conf'
		, 'rabbitmq-server -detached'
		, 'rabbitmqctl wait'
		]
		jake.exec(startCommands, function() {
			console.log('done.')
			complete();
		}, {stdout: true});
	});
	task('teardownTests', function() {
		console.log("Tearing down.");
		var stopCommands = [
		'killall redis-server'
		, 'rabbitmqctl stop'
		]
		jake.exec(stopCommands, function() {
			console.log("Services stopped.");
			complete();
		}, {stdout: true});
	});
});
task('test', ['tests:runTests']);