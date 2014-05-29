if (Meteor.isClient) {
  
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
        $.getJSON(baseURL + request.term, function (data) {
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
        $('#input').val(selectedObj.label);
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
        Session.set('lon', Address.lon);
        Meteor.call('updateData');
        GoogleReverseLookup.setAddress();
        Forecast.getLatestWeather(Session.get('lat'),Session.get('lon'));

        return false;
      },
      open: function () {
        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
      },
      close: function () {
        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
      }
    });

    $('#input').hover(function(){
      $(this).autocomplete({source: function(request,response){
        response(["apples","oranges","pears"]);
      }});
      $(this).autocomplete('search',' ');

      $(this).click(function(){
        $(this).autocomplete({source: function(request,response){
          $.getJSON(baseURL + request.term, function (data) {
            for (var i = 0; i < data.length; i++) {
            searchRes[i] = data[i];
            dataArr.push(data[i].display_name);
            }
          });
          response(dataArr);
          dataArr = [];
          searchRes = {};
        }});
      });
    },function(){});
  });
}