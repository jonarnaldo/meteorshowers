

if (Meteor.isClient) {
  /*Template.nav.events({
    
    'click #btn': function (){
      
      var stringToAddress = function(str) {
        var strArr = str.split(" ");
        var newStr = strArr.join("+");
        return newStr;
      }

      Address.street = stringToAddress($('#street').val());
      Address.city = stringToAddress($('#city').val());
      Address.state = stringToAddress($('#state').val());
      Address.zipcode = stringToAddress($('#zipcode').val());
      
      var url = "https://api.smartystreets.com/street-address?street=" + Address.street + "&city=" + Address.city + "&state=" + Address.state + "&zipcode=" + Address.zipcode + "&candidates=5&auth-token=3051264452507986245&callback=?"; 

      if (Address.street == "") { alert("Please enter street address");}
      else if (Address.city == "") {alert("Please enter city");}
      else if (Address.state =="") {alert("Please enter state");}
      else if (Address.zipcode =="") {alert("Please enter zipcode");}
      else {
        var jqxhr = $.getJSON(url, function(response) { 
          if ($.isEmptyObject(response) === true) {
            alert("address not found! Try Again!");
          } else {
            Address.latitude = response[0].metadata.latitude; //global var, move to main.js
            Address.longitude = response[0].metadata.longitude; //global var, move to main.js
            console.log("json lat/long: " + Address.latitude + ", " + Address.longitude);
          }
        })
      }

      Meteor.call('updateData');
      console.log(Address.latitude, Address.longitude);
      Forecast.getLatestWeather(Address.latitude, Address.longitude);
    }
  });
  */
  var dataArr = [];
  var searchRes = {};
  var baseURL = "http://nominatim.openstreetmap.org/search?format=json&limit=5&q=";

  var searchAddress = {
    lat: 0,
    lon: 0,
    display_name: {}
  };

  $(function () {
    $('#input').autocomplete({
      source: function (request, response) {
        jQuery.getJSON(baseURL + request.term, function (data) {
          for (var i = 0; i < data.length; i++) {
            searchRes[i] = data[i];
            dataArr.push(data[i].display_name);
          }
        });
        response(dataArr);
        dataArr = [];
        searchRes = {};
      },
      minLength: 1,
      select: function (event, ui) {
        var selectedObj = ui.item;
        jQuery('#input').val(selectedObj.label);
        Address.display_name = ui.item.label;
        

        for (var key in searchRes) {
          var obj = searchRes[key];
          for (var prop in obj) {
            if (obj[prop] == Address.display_name) {
              Address.lat = obj.lat;
              Address.lon = obj.lon;
            }
          } 
        }

        console.log("address: " + Address.display_name + ", lat: " + Address.lat + ", lon: " + Address.lon);
        Session.set('lat', Address.lat);
        Session.set('lon', Address.lon)
        Meteor.call('updateData');
        GoogleReverseLookup.setAddress();
        Forecast.getLatestWeather(Session.get('lat'),Session.get('lon'));

        return false;
      },
      open: function () {
        jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
      },
      close: function () {
        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
      }
    });
  });
}