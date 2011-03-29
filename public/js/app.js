
	//var socket = new io.Socket('192.168.3.108',{port:4000});		
function NodePinsClient() {
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}
	
	var self = this;
	
	this.backRect = {};
	this.subText = {};
	this.timeoutID = [] ;
	this.init = function() {		
		self.setupBayeuxHandler();
		self.drawMap();
		self.drawText();
		self.drawGem();
	    self.viewDidResize();
		
	};
	
	this.getAttributeByIndex = function(obj, index) {
		var i = 0;
		for (var attr in obj){
			if (index === i) {
				return obj[attr];
			}
			i++;
		}
		return null;
	};
	
	
	this.setupBayeuxHandler = function() {
		//var self = this;
		$.getJSON("/config.json", function(config) {
		self.client = new Faye.Client("http://" + window.location.hostname + ':' + config.port + '/faye', {
			timeout: 120
		});
		
	
		
		var clientAuth = {
			outgoing: function(message, callback) {
			//leav non-subscribe messages alone
			console.log("outgoing: " + message.channel);
			if (message.channel !== '/meta/subscribe')
			return callback(message);
			
			// Add ext field if it is not present
			if (!message.ext) message.ext = {};	
			
			// Set the auth token
			message.ext.authToken = 'rt6utrb';
			
			//Carry on and send the message to the server
			
			callback(message);
			},

			incoming: function(message, callback) {
			console.log("incoming: " + message.channel);
				
			if (message.channel === '/meta/connect' && message.successful)
				{
				self.gemId.node.textContent = self.client._0;
				self.gemWs.attr({fill: "#0f0", stroke :"#0f0"});
				self.gemWs.animate({fill:"#000", stroke: "#000"},45000);
				}				
			callback(message);	
			}
		
		};
		
		self.client.addExtension(clientAuth);
		
		// function showClient() {
		// 	//console.log(self.client._0);
		// //	self.drawID(self.client._0);
		// };
		// setTimeout(showClient,2000);
		
		self.client.subscribe('/stat',function(message) {

			if (message.bigData)
			console.log("Big Data incoming");
			
		});
		
		});
	};
	
	this.viewDidResize = function() {
    var width = $(window).width(),
		height = $(window).height();
     // windowHeight = $(window).height(),
     // mapCanvasHeight = $(window).height(); //width * (1000 / 2000);

    self.map.setSize(width , height * 0.99);
    //$('#map').css({
     // 'margin-top': (windowHeight - mapCanvasHeight) / 2.0
    //});
	}
  	
	
	this.drawMap = function () {
	   // self.map.canvas.setAttribute('viewBox', '0 0 567 369');
		self.map = Raphael('map', "100%", "100%");
		self.map.canvas.setAttribute('viewBox', '0 0 640 340');
		var attr = {
		   stroke: '#00fe00',
		 	fill: '#000',
		   'stroke-width': 0.7
		};
		

	   	for (var state in aut) {
		
	   		//var region = new Array;
	   		var bund = self.map.path(aut[state].path).attr(attr);
			var textstate = "sry no Data";
			// bund.style.cursor = "pointer";
		
		bund.mouseover(function() {
			this.attr({fill: "#050"});
			self.subText.node.textContent = (self.getAttributeByIndex(aut, this.id)).name;
			this[0].style.cursor = "pointer";
			//self.getDataImage();
		});

		bund.click(function() {
			// jobpins.clone = this.clone();
			if(!self.backRect.node) {
			self.drawBackRect(this);
			this.animate({path: (self.getAttributeByIndex(aut, this.id)).big},500).toFront();
			};
		});

   		 bund.mouseout(function() {
			
			this.attr({fill: "#000"});
			self.subText.node.textContent = "Austria";
			
		});
		};
	};

	this.drawText = function() {

		var maintext = self.map.text(100,20, "Welcome").attr({"font-family": "Orbitron","font-size":24, stroke: "#00ff00", fill: "#0d0",'stroke-width': 0.7}).toFront();

		self.subText = self.map.text(110,40, "Austria").attr({"font-family": "Orbitron","font-size":14, stroke: "#00ff00", fill: "#0d0",'stroke-width': 0.7});

		var serverText = self.map.text(20,40, "").attr({"font-family": "Orbitron","font-size":6, stroke: "#00FF00", fill: "#0F0",'stroke-width': 0.5}).toFront();

		function changeText() {
			maintext.animate({fill:"#000",stroke:"#000"},2000,function() {
				maintext.node.textContent = "Jobpins";	
				maintext.animate({fill:"#0d0",stroke:"#00fe00"},2000,function() {
					self.map.ellipse(100,32,40,3).attr({fill:"#010"}).toBack();	
				});
			});
			clearTimeout(self.timeoutID[0]);
		};

		self.timeoutID[0] = setTimeout(changeText,2000);

		//changeText();



  }
	
	this.drawBackRect = function(objThis) {
		self.backRect = self.map.rect(0,0,640,340).attr({fill:"black","fill-opacity": 0.5}).toFront();
		self.backRect.click(function() {
			this.remove();
			objThis.animate({path: (self.getAttributeByIndex(aut, objThis.id)).path},500);
		});
	};
	
	this.drawGem = function() {
		
		var attr = {
		   stroke: '#00fe00',
		 	fill: '#000',
		   'stroke-width': 0.7
		};
		
		self.gemWs = self.map.path(html5Svg.connectivity).attr(attr);
		
	// };
	// 
	// 
	// this.drawID = function() {
	
	
	
	
		self.gemId = self.map.text(80,336, "").attr({"font-family": "Orbitron","font-size":8, stroke: "#050", fill: "#050",'stroke-width': 0.1}).toBack();
	};
	
	
	
	this.init();
};


	// var self = this,
	// 	jobpins = { 
	// 	autor: "oliver",
	// 	map: Raphael('map', "100%", "100%"),
	// 	drawText: function(text) {
	// 		return text;
	// 	},
	// 	subText: {},
	// 	backRect: {},
	// 	bund: {},
	// 	clone : {},
	// 	fm1: false,
	// 	fm2: false,
	// 	fm3: false,
	// 	gemWs: {},
	// 	timeoutID : [],
	// 	serverText: {},
	// 	sessionId: ""	
	// 	};
		

		//console.log(jobpins.drawText("Hello"));
		
	// function SocketConnect() {
	// 		console.log('connecting...');			
	// 		clearTimeout(jobpins.timeoutID[1]);
	// 		socket.connect();
	// 	}
	// 	
	// 	socket.on('disconnect',function() {
	// 		console.info('disconnect');
	// 		jobpins.timeoutID[1] = setTimeout(SocketConnect,5000);
	// 		jobpins.gemWs.attr({fill:"black"});
	// 	});
	// 	
	// 	socket.on('connect',function() {
	// 		console.info('connect');
	// 	//	console.markTimeline('connected'); //google chrome Monitor
	// 		jobpins.gemWs.attr({fill:"green"});
	// 	});
	// 	
	// 	socket.on('message',function(message) {
	// 		var obj = $.parseJSON(message);
	// 		if (!jobpins.sessionId){jobpins.sessionId=obj.sessionId;};
	// 		jobpins.serverText.node.textContent = "Clients: " + obj.clients;	
	// 		console.log(jobpins.sessionId);
	// 	});
		

	// function drawText(text) {
	//  return text;
	// 	}; 

	
	

		

   		//console.log(bund);

// mouseover(function() {
//    		 		this.animate({fill: "#f00"}, 1000, "bounce");
//    			console.log("hello");
//    		 	});
   		//aut[state].color = Raphael.getColor();
		//(function(st,state) {
			
		//})(aut[state], state);



		// var st = jobpins.map.set();
		// 		st.push(
		// 		    jobpins.map.ellipse(50, 100, 4, 1)
		// 		  //  map.ellipse(300, 200, 100, 10),
		// 		  //  map.ellipse(500, 400, 100, 10)
		// 		);
		// 		jobpins.map.circle(50,100,4).attr({stroke: "green"});
		// 		jobpins.map.circle(50,100,2).attr({fill: "black"});
		// 		
		// 		//map.circle(150,1000,40).attr({stroke: "green"});
		// 		st.attr({fill: "0-#0f0-#030:20-#000","fill-opacity": 0.0}).toBack();
		// 		var sty = jobpins.map.ellipse(50, 100, 4, 1).attr({fill: "0-#0f0-#030:20-#000","fill-opacity": 0.0}).toBack();
		// 		
		// 		 	$(document).mousemove(function(e) {
		// 		// 		var blop = (2000/map.width);
		// 		// 			//			height = $(window).height(),
		// 		// 			// width = $("body").width(),
		// 				st.animate({rotation:e.pageX},2000,"<").toBack();
		// 				sty.animate({rotation:e.pageY},2000,"<").toBack();
		// 		// 
		// 		// 		//console.log("cals " + 2000/map.width);
		// 		// 		//console.log("mouse " + width);
		// 		// 		//console.log("map " + map.width);
		// 		 	});
				

	
	



	

  // this.geoCoordsToMapCoords = function (latitude, longitude) {
  //   latitude = parseFloat(latitude);
  //   longitude = parseFloat(longitude);
  // 
  //   var mapWidth = 567,
  //     mapHeight = 369,
  //     x, y, mapOffsetX, mapOffsetY;
  // 
  //   x = (mapWidth * (180 + longitude) / 360) % mapWidth;
  // 
  //   latitude = latitude * Math.PI / 180;
  //   y = Math.log(Math.tan((latitude / 2) + (Math.PI / 4)));
  //   y = (mapHeight / 2) - (mapWidth * y / (2 * Math.PI));
  // 
  //   mapOffsetX = mapWidth * 0.026;
  //   mapOffsetY = mapHeight * 0.141;
  // 
  //   return {
  //     x: (x - mapOffsetX) * 0.97,
  //     y: (y + mapOffsetY + 15),
  //     xRaw: x,
  //     yRaw: y
  //   };
  // }
  // 
  // this.drawMarker = function (message) {
  //   var latitude = message.latitude,
  //     longitude = message.longitude,
  //     text = message.title,
  //     city = message.city,
  //     x, y;
  // 
  //   var mapCoords = this.geoCoordsToMapCoords(latitude, longitude);
  //   x = mapCoords.x;
  //   y = mapCoords.y;
  // 
  //   var person = self.map.path(personPath);
  //   person.scale(0.01, 0.01);
  //   person.translate(-255, -255); // Reset location to 0,0
  //   person.translate(x, y);
  //   person.attr({
  //       fill: '#ff9'
  //     , stroke: 'transparent'
  //   });
  // 
  //   var title = self.map.text(x, y + 11, text);
  //   title.attr({
  //       fill: 'white'
  //     , "font-size": 10
  //     , "font-family": "'Helvetica Neue', 'Helvetica', sans-serif"
  //     , 'font-weight': 'bold'
  //   });

  //   var subtitle = self.map.text(x, y + 21, city);
  //   subtitle.attr({
  //       fill: '#999'
  //     , "font-size": 7
  //     , "font-family": "'Helvetica Neue', 'Helvetica', sans-serif"
  //   });
  // 
  //   var hoverFunc = function () {
  //     person.attr({
  //       fill: 'white'
  //     });
  //     $(title.node).fadeIn('fast');
  //     $(subtitle.node).fadeIn('fast');
  //   };
  //   var hideFunc = function () {
  //     person.attr({
  //       fill: '#ff9'
  //     });
  //     $(title.node).fadeOut('slow');
  //     $(subtitle.node).fadeOut('slow');
  //   };
  //   $(person.node).hover(hoverFunc, hideFunc);
  // 
  //   person.animate({
  //     scale: '0.02, 0.02'
  //   }, 2000, 'elastic', function () {
  //     $(title.node).fadeOut(5000);
  //     $(subtitle.node).fadeOut(5000);
  //   });
  // }


//};

var nodePinsClient;
$(function() {
  nodePinsClient = new NodePinsClient();
	//init();
  $(window).resize(function() {
    nodePinsClient.viewDidResize();
  });
});

