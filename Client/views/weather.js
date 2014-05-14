if (Meteor.isClient) {
	Template.weather.helpers({
		current: function () {
			return Current.find();
		}
	})

	Template.weather.events({
		'click .btn': function (){
			Meteor.call('removeAllData')
			Forecast.getLatestWeather(37.785745, -122.395849);
		}
	})
}

	




