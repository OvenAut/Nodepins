var express = require('express'),
	io = require('./node_modules/socket.io');

var app = express.createServer();
var clients = [];


app.configure(function() {
	app.use(express.logger());
	app.use(express.static(__dirname + '/public'));
});

app.get('/',function(req,res) {
	res.send(public/index.html);
});

app.listen(4000);

var socket = io.listen(app, {flashPolicyServer: false});

var objSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function clientsN(obj) {
	return objSize(obj.clients)
} 

socket.on('connection',function(client) {
	
	var message = JSON.stringify({clients: clientsN(this), sessionId: client.sessionId});
	var self = this;
	socket.broadcast(message);
	
	
	
	
	client.on('disconnect',function() {
			var message = JSON.stringify({clients: (clientsN(socket)-1)});
		client.broadcast(message);
	});
	
	
});



// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(8124, "127.0.0.1");
// console.log('Server running at http://127.0.0.1:8124/');