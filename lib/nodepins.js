var http =	require('http'),
	sys = require('sys'),
	staticFile = require('node-static/lib/node-static'),
	faye = require('faye/'),
	url = require('url'),
	fs = require('fs'),
	buffer = require('buffer'),
	buf;
    

//sys.puts('After: ' + sys.inspect(process.memoryUsage()));

function Nodepins(options) {
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	};

	var self = this;

	self.settings = {
		port: options.port

	};
	self.subscriber = {};
	self.init();
};



Nodepins.prototype.init = function() {
	var self = this;
		

	self.bayeux = self.createBayeuxServer();
	self.httpServer = self.createHTTPServer();
	
	self.loadToken(function() {
		self.serverExtensions();
	});
	self.bayeux.attach(self.httpServer);	
	self.httpServer.listen(self.settings.port);
	sys.log('Server started on Port ' + self.settings.port);
	//self.checkNewClient();
	self.loadImageData(function() {
		sys.log("InageData Callback");
	});
	sys.puts('Inside: ' + sys.inspect(process.memoryUsage()));
};

Nodepins.prototype.loadImageData = function(callback) {
	var self = this;
	fs.readFile('./lib/images.json','utf8',function(err, content) {
		if (err) throw err;
		//sys.log(content.toString());
		buf = content.toString();
		//self.token = registry[subscription];
		//sys.log("content length: " + content.length);
		// buf = new Buffer(content.length);
		// 		buf.len = buf.write(content, 0 ,'utf8');
		// 		
		// 		//buf = new Buffer(imageDataJson, encoding='utf8');
		// 		sys.log(buf.len + "bytes in buf");
		//sys.log("image File loadet " + self.buf.toString('utf8',0,len));
		return callback();
		
	});
	
};

Nodepins.prototype.loadToken = function(callback) {
	var self = this;
	fs.readFile('./lib/token.json','utf8',function(err, content) {
		if (err) throw err;
		self.tokenRegistry = JSON.parse(content.toString());

		//self.token = registry[subscription];
		sys.log("Token loaded");
		return callback();
	});
};

Nodepins.prototype.serverExtensions = function() {
	var self = this;
	self.serverAuth ={
		incoming: function(message,callback) {
			//Let non-subscribe message through
			console.log("message incoming: " + message.clientId);
			
			if (message.channel === '/meta/disconnect')
				{
			//	sys.log('Disconnected ' + ' Client: ' + message.clientId);
				delete self.subscriber[message.clientId];
				sys.log('Disconnected ' + ' Client: ' + message.clientId);
				for (var index in self.subscriber) {
					sys.log('Remaining ' + ' Client: ' + index);	
				}

				}
			if (message.channel !== '/meta/subscribe')
				return callback(message);
			//sys.log("incoming serverAuth " + message.channel + "\nClientID " + message.clientId);
			//Get subscribed channel and auth token			

			var subscription = message.subscription,
				msgToken	 = message.ext && message.ext.authToken || "false";
						
				token = self.tokenRegistry[subscription];
	
				// Add an error if the token don´t match
				if (token !== msgToken)
					message.error = 'Invalid subscription auth token';
				else{
				console.log("tocken ok");
				// Call the server back now we'er done
				// var tmp = message.clientId
				// // timestamp (Date.now())
				// //self.subscriber = {};
				if (!self.subscriber[message.clientId])
				 	{
				 	self.subscriber[message.clientId] = {timestamp:(Date.now()), bigData: false};
				 	}
				
				//if (!message.ext) message.ext = {};	
				//massage.ext.bigData = "juhu";
				 	//sys.log(self.subscriber.tmp);
				}
				callback(message);
		},
	
		outgoing: function(message,callback) {
		//	sys.log("Outgoing: " + message.channel + "\n" + message.successful + "\n" + message.advice.interval + "\n" + message.advice.timeout + "\n" + message.advice.reconnect);
		console.log("outgoing: " + message.channel + " clientID: " + message.clientId);
		if (message.channel === '/meta/subscribe')
			return callback(message);
		
			if (self.subscriber[message.clientId]) {
				var tmpSubscriber = self.subscriber[message.clientId];
				var blabla = (self.subscriber[message.clientId]).bigData;
				if (!tmpSubscriber.bigData) {
				if (!message.extInt) {
					message.extInt = {};	
					console.log("Outgoing big data");
					message.extInt.bigData = buf;
					tmpSubscriber.bigData = true;
					self.subscriber[message.clientId] = tmpSubscriber;
					callback(message);
					}
				}
			}
				
		
			for (var key in self.subscriber) {
				var tmpsubscr = self.subscriber[key];
				var ms = (Date.now()) - tmpsubscr.timestamp;
				sys.log("Subscriber: " + key + " online since : " + Math.round((ms/1000)) + " Sek");
			}
			
			return callback(message);
		}
		
	}
	
	self.bayeux.addExtension(self.serverAuth);
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
		var file = new staticFile.Server('./public', {
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
