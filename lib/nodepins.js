var http =	require('http'),
	sys = require('sys'),
	static = require('node-static/lib/node-static'),
	faye = require('faye/'),
	url = require('url');
	
function Nodepins(options) {
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	};

	var self = this;

	self.settings = {
		port: options.port

	};
	
	self.init();
};

Nodepins.prototype.init = function() {
	var self = this;

	self.bayeux = self.createBayeuxServer();
	self.httpServer = self.createHTTPServer();
	
	self.bayeux.attach(self.httpServer);	
	self.httpServer.listen(self.settings.port);
	sys.log('Server started on Port ' + self.settings.port);
};

Nodepins.prototype.createBayeuxServer = function() {
  var self = this;
  
  var bayeux = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
  });
  
  return bayeux;
};


Nodepins.prototype.createHTTPServer = function() {
	var self = this;
	
	var server = http.createServer(function(request, response) {
		var file = new static.Server('./public', {
			cache: false
		});
		
		request.addListener('end', function() {
			file.serve(request, response, function (e, res) {
                if (e && (e.status === 404)) { // If the file wasn't found
                    file.serveFile('./404.html', 404, {}, request, response);
					
					};
				});
		});
		
		
		
		// response.writeHead(200, {
		// 			'Content-Type': 'text/plain'
	
		// 		});
	
	var ip = "";
	
	try {
		ip = request.headers["x-real-ip"];
	} catch (e) {
		ip = request.client.remoteAddress; 
	}
	
	//sys.log(ip);	
	
	
	});
	return server;
};

module.exports = Nodepins;

	// var express = require('express'),
	// 	io = require('./node_modules/socket.io');
	// 
	// var app = express.createServer();
	// var clients = [];
	// 
	// 
	// app.configure(function() {
	// 	app.use(express.logger());
	// 	app.use(express.static(__dirname + '/public'));
	// });
	// 
	// app.get('/',function(req,res) {
	// 	res.send(public/index.html);
	// });
	// 
	// app.listen(4000);
	// 
	// var socket = io.listen(app, {flashPolicyServer: false});
	// 
	// var objSize = function(obj) {
	//     var size = 0, key;
	//     for (key in obj) {
	//         if (obj.hasOwnProperty(key)) size++;
	//     }
	//     return size;
	// };
	// 
	// function clientsN(obj) {
	// 	return objSize(obj.clients)
	// } 
	// 
	// socket.on('connection',function(client) {
	// 
	// 	var message = JSON.stringify({clients: clientsN(this), sessionId: client.sessionId});
	// 	var self = this;
	// 	socket.broadcast(message);
	// 
	// 
	// 
	// 
	// 	client.on('disconnect',function() {
	// 			var message = JSON.stringify({clients: (clientsN(socket)-1)});
	// 		client.broadcast(message);
	// 	});
	// 
	// 
	// });
