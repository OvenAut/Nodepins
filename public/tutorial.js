window.onload = function() {
	var r = Raphael("map", 640, 480);
	
	
	for (var i=0; i < 10; i++) {
		//var circle = new Array;
		var circle = r.circle(Math.random() * 570 + 30,Math.random() * 420 + 30, 40+i).attr({fill: "#fc0", stroke: "#f00"});
		
		
		circle.mouseover(function() {
			this.animate({fill: "#f00", r:60}, 1000, "bounce");
		});
		circle.mouseout(function() {
			this.animate({fill: "#fc0", r:50}, 1000, "bounce");
		});
	
	};
	
	var textTest = r.text(50,50, "Oliver!").attr({"font-family": "Homemade Apple","font-size":20, stroke: "#fff", fill:"#fff"});
	textTest.click(function() {
		this.node.textContent= "BlaBla";//({fill:"red"});
	});
	r.circle(150,150,70).attr({fill: "#00f", stroke:"#0ef"});	
	r.text(150,150, "Test").attr({"font-family": "Permanent Marker","font-size":50, stroke: "#fff"});	
	
};