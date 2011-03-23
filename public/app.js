
// Thanks to Mathias Pettersson for the initial inspiration: 
//   http://github.com/mape
// See also the PeepCode Screencast on Node.js
//   https://peepcode.com/products/nodejs-i

// function LiveStatsClient() {
//   if (! (this instanceof arguments.callee)) {
//     return new arguments.callee(arguments);
//   }
	var socket = new io.Socket('192.168.3.108');		
	var self = this,
		jobpins = { 
		autor: "oliver",
		map: Raphael('map', "100%", "100%"),
		drawText: function(text) {
			return text;
		},
		subText: {},
		backRect: {},
		bund: {},
		clone : {},
		fm1: false,
		fm2: false,
		fm3: false,
		gemWs: {},
		timeoutID : [],
		serverText: {},
		sessionId: ""	
		};
		
		//console.log(jobpins.drawText("Hello"));
		
	function SocketConnect() {
		console.log('connecting...');			
		clearTimeout(jobpins.timeoutID[1]);
		socket.connect();
	}
	
	socket.on('disconnect',function() {
		console.info('disconnect');
		jobpins.timeoutID[1] = setTimeout(SocketConnect,5000);
		jobpins.gemWs.attr({fill:"black"});
	});
	
	socket.on('connect',function() {
		console.info('connect');
	//	console.markTimeline('connected'); //google chrome Monitor
		jobpins.gemWs.attr({fill:"green"});
	});
	
	socket.on('message',function(message) {
		var obj = $.parseJSON(message);
		if (!jobpins.sessionId){jobpins.sessionId=obj.sessionId};
		jobpins.serverText.node.textContent = "Clients: " + obj.clients;	
		console.log(jobpins.sessionId);
	});
		
	function init() {
		SocketConnect();
    	drawMap();
		drawText();
		drawGem();
    	viewDidResize();
		};

	// function drawText(text) {
	//  return text;
	// 	}; 

	function getAttributeByIndex(obj, index) {
		var i = 0;
		for (var attr in obj){
			if (index === i) {
				return obj[attr];
			}
			i++;
		}
		return null;
	};
	
	drawBackRect = function(objThis) {
		jobpins.backRect = jobpins.map.rect(0,0,640,340).attr({fill:"black","fill-opacity": 0.5}).toFront();
		jobpins.backRect.click(function() {
			this.remove();
			objThis.animate({path: (getAttributeByIndex(aut, objThis.id)).path},500);
		});
	};
	
	 drawMap = function () {
	   // self.map.canvas.setAttribute('viewBox', '0 0 567 369');
		jobpins.map.canvas.setAttribute('viewBox', '0 0 640 340');
		var attr = {
		   stroke: '#00fe00',
		 	fill: '#000',
		   'stroke-width': 0.7
		};

	   	for (var state in aut) {
		
	   		//var region = new Array;
	   		jobpins.bund = jobpins.map.path(aut[state].path).attr(attr);
			var textstate = "sry no Data";
			// bund.style.cursor = "pointer";
   		 	jobpins.bund.mouseover(function() {
				this.attr({fill: "#050"});
				jobpins.subText.node.textContent = (getAttributeByIndex(aut, this.id)).name;
				this[0].style.cursor = "pointer";
		});

		jobpins.bund.click(function() {
			// jobpins.clone = this.clone();
			if(!jobpins.backRect.node) {
			drawBackRect(this);
			this.animate({path: (getAttributeByIndex(aut, this.id)).big},500).toFront();
			};
		});

		
		
   		 jobpins.bund.mouseout(function() {
			
			this.attr({fill: "#000"});
			jobpins.subText.node.textContent = "Austria";
			
			// if (jobpins.fm3) {
			//this.animate({path: (getAttributeByIndex(aut, this.id)).path},500);
			// jobpins.fm3 = false;
			// };
		});
		};
	};
		

   		//console.log(bund);

// mouseover(function() {
//    		 		this.animate({fill: "#f00"}, 1000, "bounce");
//    			console.log("hello");
//    		 	});
   		//aut[state].color = Raphael.getColor();
		//(function(st,state) {
			
		//})(aut[state], state);
	function drawText() {
	
		var maintext = jobpins.map.text(100,20, "Welcome").attr({"font-family": "Orbitron","font-size":24, stroke: "#00ff00", fill: "#0d0",'stroke-width': 0.7}).toFront();

		jobpins.subText = jobpins.map.text(110,40, "Austria").attr({"font-family": "Orbitron","font-size":14, stroke: "#00ff00", fill: "#0d0",'stroke-width': 0.7});
		
		jobpins.serverText = jobpins.map.text(120,60, "").attr({"font-family": "Orbitron","font-size":14, stroke: "#00ff00", fill: "#0d0",'stroke-width': 0.7}).toFront();
			
		function changeText() {
			maintext.animate({fill:"#000",stroke:"#000"},2000,function() {
				maintext.node.textContent = "Jobpins";	
				maintext.animate({fill:"#0d0",stroke:"#00fe00"},2000,function() {
					jobpins.map.ellipse(100,32,40,3).attr({fill:"#010"}).toBack();	
				});
			});
			clearTimeout(jobpins.timeoutID[0]);
		};
		
		jobpins.timeoutID[0] = setTimeout(changeText,2000);
		
		//changeText();
		
		 

  }


	function drawGem() {
		
		var attr = {
		   stroke: '#00fe00',
		 	fill: '#000',
		   'stroke-width': 0.7
		};
		
		jobpins.gemWs = jobpins.map.path(html5Svg.connectivity).attr(attr);
		
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
				
	};
	
	
  	function viewDidResize() {
    var width = $(window).width(),
		height = $(window).height();
     // windowHeight = $(window).height(),
     // mapCanvasHeight = $(window).height(); //width * (1000 / 2000);

    jobpins.map.setSize(width , height * 0.99);
    //$('#map').css({
     // 'margin-top': (windowHeight - mapCanvasHeight) / 2.0
    //});
  }



	socket.on("connect", function() {
		
		
	});
	

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

//var liveStatsClient;
$(function() {
  //liveStatsClient = new LiveStatsClient();
	init();
  $(window).resize(function() {
    viewDidResize();
  });
});

