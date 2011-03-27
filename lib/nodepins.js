var http =	require('http'),
	sys = require('sys'),
	static = require('node-static/lib/node-static'),
	faye = require('faye/'),
	url = require('url'),
	fs = require('fs');


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
	
	
	
	
	
	
	
	
	
	
	self.serverAuth = {
		incoming: function(message,callback) {
			//Let non-subscribe message through

			if (message.channel !== '/meta/subscribe')
				return callback(message);
			sys.log("incoming serverAuth" + message);
			//Get subscribed channel and auth token
			var subscription = message.subscription,
				msgToken	 = message.ext && message.ext.authToken || "false";
				
			// Find the right token for the channel
			fs.readFile('./lib/token.json','utf8', function(err, content) {
				if (err) throw err;
				var registry = JSON.parse(content.toString()),
				token = registry[subscription];

				// Add an error if the token don´t match
				if (token !== msgToken)
					message.error = 'Invalid subscription auth token';

				// Call the server back now we'er done
				callback(message);
			});
		}
	}	
	

	self.bayeux = self.createBayeuxServer();
	self.httpServer = self.createHTTPServer();
	
	self.bayeux.addExtension(self.serverAuth);
	
	self.bayeux.attach(self.httpServer);	
	self.httpServer.listen(self.settings.port);
	sys.log('Server started on Port ' + self.settings.port);
	self.checkNewClient();
};

Nodepins.prototype.objSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
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
	
	var options = {
		key: fs.readFileSync('ssl.key'),
		cert: fs.readFileSync('ssl.crt')
	}
	
	var server = http.createServer(function(request, response) {
		var file = new static.Server('./public', {
			cache: false
		});
		
		request.addListener('end', function() {
			var location = url.parse(request.url, true);
			var clientIp = (request.headers["x-real-ip"]||request.client.remoteAddress)
			
			if (location.pathname == '/config.json' && request.method == "GET") {
				self.bayeux.getClient().publish('/stat',{
					
					ip: clientIp
				});
				sys.log(clientIp);
				var tmp = self.bayeux._server._connections
				// console.log(self.objSize(tmp));
				// 				for (name in tmp) {
				// 			        if (tmp.hasOwnProperty(name)) console.log(name);
				// 			    }
				response.writeHead(200, {
					'Content-Type': 'application/x-javascript'
				});
				var jsonString = JSON.stringify({
					port: self.settings.port
				});
				
				
				response.end(jsonString);
			} else {
			file.serve(request, response, function (e, res) {
                if (e && (e.status === 404)) { // If the file wasn't found
                    file.serveFile('./404.html', 404, {}, request, response);
					};
				});
			}
		});		
	});
	return server;
};  //end createHTTPServer

Nodepins.prototype.checkNewClient = function() {
	var self = this;
	
	//console.log(self.bayeux);
	
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
