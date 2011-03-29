
	//var socket = new io.Socket('192.168.3.108',{port:4000});		
function NodePinsClient() {
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}
	
	var self = this;
	
	this.backRect = {};
	this.subText = {};
	this.timeoutID = [] ;
	//this.workData = {};
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
	
	this.mergeBigData = function(dataTarget,dataSrc) {
		for (key in dataTarget) {
			for (key2 in dataTarget[key]) {
				if (dataTarget[key][key2] == "")
					{
					dataTarget[key][key2] = dataSrc[key][key2];

					}
			}
		}
		//callback(dataTarget);
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
			// console.log("outgoing: " + message.channel);
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
			// console.log("incoming: " + message.channel);
				if (message.extInt) {
					if (message.extInt.bigData) {
						var regex = /(^").*("(?!.))/m;
						workData = message.extInt.bigData;
 						workData = JSON.parse(workData);
						//workData = workData.replace(regex,"");
						self.mergeBigData(aut,workData.aut);
						// console.log(workData);
						//var dataBig = JSON.parse(workData);
						//dataBig = dataBig.replace(/(").+(")/,"");
						//console.log(dataBig);
					}
				}
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
		
	
		self.gemId = self.map.text(80,336, "").attr({"font-family": "Orbitron","font-size":8, stroke: "#050", fill: "#050",'stroke-width': 0.1}).toBack();
	};
	
	
	
	this.init();
};


var nodePinsClient;
$(function() {
  nodePinsClient = new NodePinsClient();
	//init();
  $(window).resize(function() {
    nodePinsClient.viewDidResize();
  });
});

