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

        
         Current.insert({
        		apparentTemperature: round(current.apparentTemperature),
        		icon: current.icon,
        		summary: current.summary,
        });

        for (var i = 1; i < 5; i++) {
          Future.insert({
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

  removeAllData: function () {
    return Current.remove({}),Future.remove({});
  },

  /*randomMeteor: function() {  
    var windowWidth = $(document).width();
    var randomLeftstart = Math.floor(Math.random()*windowWidth-100);
    var randomLeftend = randomLeftstart + 100;
   
    $('.shower').css({ top: '-20px', left: randomLeftstart, backgroundColor: 'black'});
    $('.shower').animate({ top: '110px', left: randomLeftend, backgroundColor: 'white' },400);
  }*/
});








