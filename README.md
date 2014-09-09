#Meteorshowers

###What is it?
A weather app powered by the Meteor framework! You can try the app here:  http://meteorshowers.meteor.com/

###What's under the hood?<br>
- [the Meteor framework](https://www.meteor.com/)
- [jquery](http://jquery.com/)
- [jquery ui](http://jqueryui.com/)
- [Q.js promises](https://github.com/kriskowal/q)<br>
- [Bootstrap 3](http://getbootstrap.com/)
- [Iron Router](https://github.com/EventedMind/iron-router)
- [Animate.CSS](http://daneden.github.io/animate.css/)
- [Climacons by Adam Whitcroft](http://adamwhitcroft.com/climacons/)
-  and a bunch of API's...


###API's

- [Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim)<br>
Description: Gets object of all available lat. and long. for specified search<br>
Use: Used in conjunction with jquery autocomplete widget to supply users with available addresses

- [Google Reverse Geocoding (Address Lookup)](https://developers.google.com/maps/documentation/geocoding/)<br>
Description: Gets object of available addresses based on a given lat.,long.<br>
Use: Find closest match based on lat. and long. to be displayed

- [Google Maps](https://developers.google.com/maps/documentation/staticmaps/)<br>
Description: Gets image from google maps from supplied lat. and long. coordinates

- [Forecast.io](https://developer.forecast.io/)<br>
Description: Gets latest weather data from supllied lat. and long. coordinates

###Collections
- Current<br>
Description: Most current weather data given a certain lat. and long.<br>
Example:
```
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
      map: MS.GetMap(lat,lon)
      });
```
- Future<br>
Description: Most current weather prediction data for the proceeding four days<br>
Example:
````
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
````

###What's next?<br>
-  Rewrite using Underscore.js
-  Implement [HUE](http://www2.meethue.com/) API<br>
There's currently a working HUE API commented out.  Thinking about using Fitbit or some other sensor to turn lights on and off based on sleeping patterns as well as convey weather based on colors.

##Thanks for stopping by!
