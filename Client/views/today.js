if (Meteor.isClient) {
	Template.today.helpers({
		current: function () {
			return Current.find();
		}
	})
}