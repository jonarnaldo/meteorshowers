if (Meteor.isClient){

	Meteor.subscribe('future');

	Template.lookAhead.days = function(){
		return Future.find();		
	};
}
