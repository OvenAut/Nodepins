require.paths.unshift(__dirname + "node_modules");

process.addListener('uncaughtException', function(err, stack) {
	console.log('------------------');
	console.log('Exception: ' + err);
	console.log(err.stack);
	console.log('------------------');
});

var Nodepins = require('./lib/nodepins');

new Nodepins({
	port:4001
});