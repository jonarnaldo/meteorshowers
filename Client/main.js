Address = {
  display_name: "",
  cityStateZip: "",
  zipcode: "999999",
  lat: 37.785745,
  lon: -122.395849
};

GoogleReverseLookup = {
  setAddress: function () {
    var APIkey =  "AIzaSyDb7R_MQT2cX6vHsbFRoweKMiM9KvocxWM",
    URL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + Address.lat + "," + Address.lon + "&sensor=true_or_false&key=";

    $.getJSON(URL + APIkey, function(data) {
        console.log(data);
        Address.cityStateZip = data.results[data.results.length-5].formatted_address;
      });
  }
};

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

Forecast = {

	getLatestWeather: function (latitude, longitude) {
    var apiKey = "d1d066174bbcfed66db995ace8e1b671";
    var url = "https://api.forecast.io/forecast/" + apiKey + "/" + latitude + "," + longitude + "?callback=?";
            
    var getCurrentDay = function (unix) {
      var currentDateArr = new Date(unix * 1000).toDateString().split(" ");
      return currentDateArr[0];
    };

    var round = function (num) { 
      return Math.round(num);  
    };

    $.getJSON(url, function (data) {
        var current = data.currently;
        var daily = data.daily.data;

        
         Current.insert({ //refactor to .update instead of .insert
            cityStateZip: Address.cityStateZip,
        		apparentTemperature: round(current.apparentTemperature),
        		icon: current.icon,
        		summary: current.summary,
        });

        for (var i = 1; i < 5; i++) {
          Future.insert({  //refactor to .update instead of .insert
            day: getCurrentDay(daily[i].time),
            icon: daily[i].icon,
            temperatureMin: round(daily[i].temperatureMin),
            temperatureMax: round(daily[i].temperatureMax)
          });
        }    
    });
	}
};

Meteor.methods({

  updateData: function () {
    return Current.remove({}),Future.remove({}); //refactor to .update instead of remove
  },
});