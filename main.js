myHue = {
    username: "newdeveloper",
    ip: "10.0.1.24",
    id: "001788fffe11e541",
    macAddress: "00:17:88:11:e5:41",
    lightSwitch: function (lightNum, onOff) {
	    var url = 'http://' + myHue.ip + '/api/' + myHue.username + '/lights/' + lightNum + '/state';
	    var params = {
	        on: onOff,
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


    $.getJSON(url, function (data) {
        var current = data.currently;
        Weather.insert({
        		apparentTemperature: current.apparentTemperature,
        		humidity: current.humidity,
        		icon: current.icon,
        		pressure: current.pressure,
        		summary: current.summary,
        		temperature: current.temperature,
        		windSpeed: current.windSpeed
        });
    });
	}
};

