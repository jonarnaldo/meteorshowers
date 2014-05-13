if (Meteor.isClient){

	Template.lookAhead.days = function(){
		return Weather.find({});




	};

}