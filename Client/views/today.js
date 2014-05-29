if (Meteor.isClient) {
	Meteor.subscribe('current');

	Template.today.helpers({
		current: function () {
			return Current.find();
		}
	})
}