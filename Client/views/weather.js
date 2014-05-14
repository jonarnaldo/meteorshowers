if (Meteor.isClient) {
	Template.weather.events({
		'click .btn': function (){
			Meteor.call('removeAllData')
			Forecast.getLatestWeather(37.785745, -122.395849);
		}
	})
}

	




