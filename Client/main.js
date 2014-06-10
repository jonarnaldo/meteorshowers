MS = {
  Round: function (num) { 
    return Math.round(num);  
  },
  GetCurrentDay: function (unix) {
    var currentDateArr = new Date(unix * 1000).toDateString().split(" ");
    return currentDateArr[0];
  },
  GetNominatim: function (stringval) {
    var nomdeferred = Q.defer();  
    var baseURL = "http://nominatim.openstreetmap.org/search?format=json&limit=3&q=";
    Session.set('stringval', stringval);
    console.log(baseURL + stringval);
    $.getJSON(baseURL + stringval, nomdeferred.resolve);
    return nomdeferred.promise;
  },
  SetLatLon: function (data) { 
    var searchRes = {}, dataArr = [];
    for (var i = 0; i < data.length; i++) {
      searchRes[i] = data[i];
      dataArr.push(data[i].display_name);
    }

    Session.set('DataArr',dataArr); //for jquery autocomplete
    Session.set('SearchRes',searchRes); 
  },
  //call after SetLatLon is resolved
  SetCoordinates: function (){
    var currentSearch = Session.get('SearchRes');
    var stringval = Session.get('stringval');
    for (var key in currentSearch) {
      var obj = currentSearch[key];
      for (var prop in obj) {
        if (obj[prop] == stringval) {
          Session.set('lat', obj.lat);
          Session.set('lon', obj.lon); 
        }
      } 
    }
  },
  GoogleReverseLookup: function () {
    var googdeferred = Q.defer();

    var lat = Session.get('lat'), lon = Session.get('lon');
    var APIkey =  "AIzaSyDb7R_MQT2cX6vHsbFRoweKMiM9KvocxWM",
    URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&sensor=true_or_false&key=";

    $.getJSON(URL + APIkey, googdeferred.resolve);
    return googdeferred.promise;
  },
  Address: {
    display_name: "",
    cityStateZip: "",
    lat: 0,
    lon: 0,
    prev: "" 
  },
  GetLatestWeather: function (latitude, longitude) {
    var forecastdeferred = Q.defer();
    var apiKey = "d1d066174bbcfed66db995ace8e1b671";
    var url = "https://api.forecast.io/forecast/" + apiKey + "/" + latitude + "," + longitude + "?callback=?";
    var current = {}, daily = {};

    $.getJSON(url, forecastdeferred.resolve);
    return forecastdeferred.promise;
  },
  updateCurrent: function(func) {
      var data = null;
      arr = Current.find({}).fetch();
      return func(arr);
  }
  /*
  supply array of previous searches to autosearch
  previousSearch: function() {
    return function(func){
      var buffer = null;
      buffer = Previous.find({},{ sort: { search: -1 }, limit: 3 });
      func(buffer);
    }
  }
  */
};

if(Meteor.isClient){
  Meteor.startup(function(){
    var currentInfo = function () {
      var timeoutDefer = Q.defer();
    
      Meteor.setTimeout(function(){
        if (Meteor.status().status === "connected") {
          timeoutDefer.resolve('ok');
          var data = Current.find().fetch()[0];
          Session.set('lat', data.lat);
          Session.set('lon', data.lon);
          Session.set('cityStateZip', data.cityStateZip);
        }
      }, 1000);  
      return timeoutDefer.promise;
    };
       

    /*insert promise here to give lat, lon, cityStateZip to MS.GetLatestWeather*/
    currentInfo().then(function(){
      MS.GetLatestWeather(Session.get('lat'), Session.get('lon')).then(function(data){
        Meteor.call('removeData');
        var lat = Session.get('lat'), lon = Session.get('lon'), cityStateZip = Session.get('cityStateZip');
        Meteor.call('insertCurrent', data.currently, cityStateZip, lat, lon);
        Meteor.call('insertFuture', data.daily.data);
      })
    }).done();
  });
}


Meteor.methods({

  removeData: function () {
    return Current.remove({}),Future.remove({}); 
  },

  insertCurrent: function (obj,cityStateZip,lat,lon) {
    
    Current.insert({
      cityStateZip: cityStateZip,
      lat: lat,
      lon: lon,
      temperature: MS.Round(obj.temperature),
      apparentTemperature: MS.Round(obj.apparentTemperature),
      humidity: obj.humidity,
      windspeed: obj.windSpeed,
      visibility: obj.visibility,
      icon: obj.icon,
      summary: obj.summary,
      precipProbability: obj.precipProbability,
    });
  },

  insertFuture: function(dailyArr){
    for (var i = 1; i < 5; i++) {
      Future.insert({  //refactor to .update instead of .insert
        day: MS.GetCurrentDay(dailyArr[i].time),
        icon: dailyArr[i].icon,
        temperatureMin: MS.Round(dailyArr[i].temperatureMin),
        temperatureMax: MS.Round(dailyArr[i].temperatureMax),
        apparentTemperatureMin: MS.Round(dailyArr[i].apparentTemperatureMin),
        apparentTemperatureMax: MS.Round(dailyArr[i].apparentTemperatureMax),
        summary: dailyArr[i].summary,
        precipProbability: dailyArr[i].precipProbability,
      });
    }    
  },

  getCurrent: function(){
    console.log(Current.find().fetch());
  }

});

if (Meteor.isServer){
  Meteor.publish('current', function() {
    return Current.find();
  });

  Meteor.publish('future', function(){
    return Future.find();
  });

  //Meteor.publish('previous', function(){
  //  return Previous.find({},{ sort: { search: -1 }, limit: 3 });
  //});
}

/*
myHue = {
    username: "newdeveloper",
    ip: "10.0.1.24",
    id: "001788fffe11e541",
    macAddress: "00:17:88:11:e5:41",
    
    lightSwitch: function (lightNum, onOff) {
      var url = 'http://' + myHue.ip + '/api/' + myHue.username + '/lights/' + lightNum + '/state';
      var params = {
        on: true,
      };

      $.ajax({
        type: "PUT",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(params)
      });
  }
};

buttonSwitch = function (e, num) {
  var thisButton = e.currentTarget;
  var switchVal = $(thisButton).attr('value');
      
  if (switchVal == 'true') {
    myHue.lightSwitch(num, true);
    $(thisButton).attr('value','false');
  } else if (switchVal == 'false') {
    myHue.lightSwitch(num, false);
    $(thisButton).attr('value','true');
  };       
};
*/
