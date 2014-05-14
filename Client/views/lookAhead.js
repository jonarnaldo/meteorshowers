if (Meteor.isClient){

	Template.lookAhead.days = function(){
		return Future.find();		
	};
}
