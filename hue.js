if (Meteor.isClient){

	Template.hue.events({
		'click #1': function (e) {
			buttonSwitch(e,1);
		},
		'click #2': function (e) {
			buttonSwitch(e,2);
		},
		'click #3': function (e) {
			buttonSwitch(e,3);
		},
	})
}