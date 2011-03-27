require.paths.unshift(__dirname + "node_modules");

process.addListener('uncaughtException', function(err, stack) {
	console.log('------------------');
	console.log('Exception: ' + err);
	console.log(err.stack);
	console.log('------------------');
});
// var pathRoot = __dirname,
// 	fs = require('fs'),
// 	sys = require('sys');
// 
// 	
// 	// concatenate files, ahead of server start for better performance
// 	// for high concurrency servers this step's callback must init the
// 	// server or the files being requested might not be ready.
// 	// read and merge jquery and js/script.js
// 	   
// 	
// 	
// 
// fs.readFile(pathRoot+'/public/js/lib/jquery.js', 'utf8', function (err, jquery) {
// 	if (err) throw err;
// 	fs.readFile(pathRoot+'/public/js/lib/raphael2.js', 'utf8', function (err, raphael) {
// 		if (err) throw err;
// 		fs.readFile(pathRoot+'/public/js/images.js', 'utf8', function (err, images) {
// 			if (err) throw err;
// 			fs.writeFile(pathRoot+'/public/js/lib/bundle.js', jquery + raphael + images, 'utf8', function (err) {
// 				if (err) throw err;
// 			sys.log("file is written");
// 			});
// 		});
// 	});
// });


var Nodepins = require('./lib/nodepins');

new Nodepins({
	port:4001
});