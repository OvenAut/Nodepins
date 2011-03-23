
// Thanks to Mathias Pettersson for the initial inspiration: 
//   http://github.com/mape
// See also the PeepCode Screencast on Node.js
//   https://peepcode.com/products/nodejs-i

function LiveStatsClient() {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  this.init = function() {
    self.drawMap();
    self.viewDidResize();

    // Sample locations:
    self.drawMarker({  latitude:'47'
                     , longitude:'-122'
                     , city:"Seattle"
                     , title:'21ºC'});
    self.drawMarker({  latitude:'-23.5'
                     , longitude:'-46.6'
                     , city:"Sao Paulo"
                     , title:'27ºC'});
    self.drawMarker({  latitude:'51.5'
                     , longitude:'-0.1'
                     , city:"London"
                     , title:'14ºC'});
    self.drawMarker({  latitude:'40.7'
                     , longitude:'-74.0'
                     , city:"New York City"
                     , title:'33ºC'});
    self.drawMarker({  latitude:'-37.8'
                     , longitude:'145.0'
                     , city:"Melbourne"
                     , title:'8ºC'});
    self.drawMarker({  latitude:'35.685'
                     , longitude:'139.75'
                     , city:"Tokyo"
                     , title:'28ºC'});
  };

  this.drawMap = function () {
    self.map = Raphael('map', 0, 0);
    self.map.canvas.setAttribute('viewBox', '0 0 567 369');

    self.map.path(mapPath).attr({
        stroke: '#010'
      , fill: '#121'
      , 'stroke-width': 0.7
    });
  }

  this.viewDidResize = function () {
    var width = $('body').width(),
      windowHeight = $(window).height(),
      mapCanvasHeight = width * (369.0 / 567.0);

    self.map.setSize(width, mapCanvasHeight);
    $('#map').css({
      'margin-top': (windowHeight - mapCanvasHeight) / 2.0
    });
  }

  this.geoCoordsToMapCoords = function (latitude, longitude) {
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    var mapWidth = 567,
      mapHeight = 369,
      x, y, mapOffsetX, mapOffsetY;

    x = (mapWidth * (180 + longitude) / 360) % mapWidth;

    latitude = latitude * Math.PI / 180;
    y = Math.log(Math.tan((latitude / 2) + (Math.PI / 4)));
    y = (mapHeight / 2) - (mapWidth * y / (2 * Math.PI));

    mapOffsetX = mapWidth * 0.026;
    mapOffsetY = mapHeight * 0.141;

    return {
      x: (x - mapOffsetX) * 0.97,
      y: (y + mapOffsetY + 15),
      xRaw: x,
      yRaw: y
    };
  }

  this.drawMarker = function (message) {
    var latitude = message.latitude,
      longitude = message.longitude,
      text = message.title,
      city = message.city,
      x, y;

    var mapCoords = this.geoCoordsToMapCoords(latitude, longitude);
    x = mapCoords.x;
    y = mapCoords.y;

    var person = self.map.path(personPath);
    person.scale(0.01, 0.01);
    person.translate(-255, -255); // Reset location to 0,0
    person.translate(x, y);
    person.attr({
        fill: '#ff9'
      , stroke: 'transparent'
    });

    var title = self.map.text(x, y + 11, text);
    title.attr({
        fill: 'white'
      , "font-size": 10
      , "font-family": "'Helvetica Neue', 'Helvetica', sans-serif"
      , 'font-weight': 'bold'
    });
    var subtitle = self.map.text(x, y + 21, city);
    subtitle.attr({
        fill: '#999'
      , "font-size": 7
      , "font-family": "'Helvetica Neue', 'Helvetica', sans-serif"
    });

    var hoverFunc = function () {
      person.attr({
        fill: 'white'
      });
      $(title.node).fadeIn('fast');
      $(subtitle.node).fadeIn('fast');
    };
    var hideFunc = function () {
      person.attr({
        fill: '#ff9'
      });
      $(title.node).fadeOut('slow');
      $(subtitle.node).fadeOut('slow');
    };
    $(person.node).hover(hoverFunc, hideFunc);

    person.animate({
      scale: '0.02, 0.02'
    }, 2000, 'elastic', function () {
      $(title.node).fadeOut(5000);
      $(subtitle.node).fadeOut(5000);
    });
  }

  this.init();
};

var liveStatsClient;
jQuery(function() {
  liveStatsClient = new LiveStatsClient();

  $(window).resize(function() {
    liveStatsClient.viewDidResize();
  });
});

