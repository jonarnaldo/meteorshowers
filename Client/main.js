//Global Variables added

myHue = {
    username: "newdeveloper",
    ip: "10.0.1.24",
    id: "001788fffe11e541",
    macAddress: "00:17:88:11:e5:41"

};

buttonSwitch = function (e, num) {
 
			var thisButton = e.currentTarget;
			var switchVal = $(thisButton).attr('value');

			
			if (switchVal == "true") {
				lightSwitch(num, true, 200);
				$(thisButton).attr('value','false');
			} else if (switchVal == "false") {
				lightSwitch(num, false, undefined);
				$(thisButton).attr('value','true');
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