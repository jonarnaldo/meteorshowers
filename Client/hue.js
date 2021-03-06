if (Meteor.isClient){
//Hue buttons
	Template.hue.events({
		'click #1': function (e) {
			//buttonSwitch(e,1);
		},

		'click #2': function (e) {
			//buttonSwitch(e,2);
		},

		'click #3': function (e) {
			//buttonSwitch(e,3);
		},


	})
}

//Global Variables added

myHue = {
    username: "newdeveloper",
    ip: //ip address goes here,
    id: //id goes here,
    macAddress: //madAddress goes here

};

buttonSwitch = function (e, num) {
 
    var thisButton = e.currentTarget;
	var switchVal = $(thisButton).attr('value');
			
    if (switchVal == true) {
	   //lightSwitch(num, true, 200);
		//$(thisButton).attr('value',true,200);
	} else if (switchVal == false) {
		//lightSwitch(num, false, 0);
		//$(thisButton).attr('value',true,100);
	};       
};

lightSwitch = function (lightNum, lightSwitchBool, brightness) {
    var url = 'http://' + myHue.ip + '/api/' + myHue.username + '/lights/' + lightNum + '/state';
    var params = {
        on: lightSwitchBool,
        bri: brightness
    };

    $.ajax({
        type: "PUT",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(params)
    });
};
