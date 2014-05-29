Address = {
  display_name: "",
  cityStateZip: "",
  zipcode: "999999",
  lat: 37.785745,
  lon: -122.395849
};

Round = function (num) { 
  return Math.round(num);  
};

GetCurrentDay = function (unix) {
  var currentDateArr = new Date(unix * 1000).toDateString().split(" ");
  return currentDateArr[0];
};

GoogleReverseLookup = {
  setAddress: function () {
    var APIkey =  "AIzaSyDb7R_MQT2cX6vHsbFRoweKMiM9KvocxWM",
    URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + Address.lat + "," + Address.lon + "&sensor=true_or_false&key=";
    console.log(URL);
    $.getJSON(URL + APIkey, function(data) {
        Address.cityStateZip = data.results[data.results.length-5].formatted_address;
      });
  }
};

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

if (Meteor.isClient) {
  Forecast = {
    getLatestWeather: function (latitude, longitude) {
      var apiKey = "d1d066174bbcfed66db995ace8e1b671";
      var url = "https://api.forecast.io/forecast/" + apiKey + "/" + latitude + "," + longitude + "?callback=?";

      $.getJSON(url, function (data) {
          var current = data.currently;
          var daily = data.daily.data;

          Meteor.call('insertCurrent',Address.cityStateZip, current);
          Meteor.call('insertFuture', daily); 
      });
    }
  };  
}


Meteor.methods({

  updateData: function () {
    return Current.remove({}),Future.remove({}); //refactor to .update instead of remove
  },

  insertCurrent: function (cityStateZip,obj) {
  
    Current.insert({
      cityStateZip: cityStateZip,
      temperature: Round(obj.temperature),
      apparentTemperature: Round(obj.apparentTemperature),
      humidity: obj.humidity,
      windspeed: obj.windspeed,
      visibility: obj.visibility,
      icon: obj.icon,
      summary: obj.summary,      
    });
  },

  insertFuture: function(dailyArr){
    for (var i = 1; i < 5; i++) {
      Future.insert({  //refactor to .update instead of .insert
        day: GetCurrentDay(dailyArr[i].time),
        icon: dailyArr[i].icon,
        temperatureMin: Round(dailyArr[i].temperatureMin),
        temperatureMax: Round(dailyArr[i].temperatureMax),
        apparentTemperatureMin: Round(dailyArr[i].apparentTemperatureMin),
        apparentTemperatureMax: Round(dailyArr[i].apparentTemperatureMax),
      });
    }    
  }
});

if (Meteor.isServer){
  Meteor.publish('current', function() {
    return Current.find();
  });

  Meteor.publish('future', function(){
    return Future.find();
  });

  Meteor.publish('previous', function(){
    return Previous.find({},{ sort: { search: -1 }, limit: 3 });
  });
}