if (Meteor.isClient) {
  
  DataArr = [];
  SearchRes = {};
  var baseURL = "http://nominatim.openstreetmap.org/search?format=json&limit=5&q=";
  var getNominatim = function (stringval) {
    $.getJSON(baseURL + stringval, function (data) {
      for (var i = 0; i < data.length; i++) {
        SearchRes[i] = data[i];
        DataArr.push(data[i].display_name);
      }
    });      
  };

  var searchAddress = {
    lat: 0,
    lon: 0,
    display_name: {}
  };

  $(function () {
    $('#input').hover(function () {
      $(this).autocomplete({source: function(request,response){
         response(["Shanghai, Huangpu District, Shanghai, People's Republic of China","London, Greater London, England, United Kingdom"]); //this should be the address values of an array dervied from the Previous Collection
      }});
      $(this).autocomplete("search"," ");
      $(this).on('autocompleteselect', function (event,ui) { console.log(ui); });

      $('#input').click(function(){
        $(this).autocomplete({
          source: function (request, response) {
            getNominatim(request.term);
            response(DataArr); //supply display_name array to autocomplete pulldown
            DataArr = [];  //clear dataArr after each search
            SearchRes = {}; //clear searRes after each search
          },
          minLength: 1,
          
          select: function (event, ui) {
            var selectedObj = ui.item;
            $('#input').val(selectedObj.label);
            Address.display_name = ui.item.label;

            for (var key in SearchRes) {
              var obj = SearchRes[key];
              for (var prop in obj) {
                if (obj[prop] == Address.display_name) {
                  Address.lat = obj.lat;
                  Address.lon = obj.lon;
                }
              } 
            }
            
            //console.log("address: " + Address.display_name + ", lat: " + Address.lat + ", lon: " + Address.lon);
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
      });
    }, function () { 
      console.log('hover out'); 
    });
  });
}
