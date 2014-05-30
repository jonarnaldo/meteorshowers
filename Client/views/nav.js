if (Meteor.isClient) {
  
  DataArr = []; //wrap this in Global Var
  SearchRes = {}; //wrap this in Global Var

  GetNominatim = function (stringval) {
    var baseURL = "http://nominatim.openstreetmap.org/search?format=json&limit=5&q=";
    $.getJSON(baseURL + stringval, function (data) {
      for (var i = 0; i < data.length; i++) {
        SearchRes[i] = data[i];
        DataArr.push(data[i].display_name);
      }
    
      for (var key in SearchRes) {
        var obj = SearchRes[key];
        for (var prop in obj) {
          if (obj[prop] == Address.display_name) {
            Address.lat = obj.lat;
            Address.lon = obj.lon;
          }
        } 
      }
    });      
  };


 
  $(function () {
    $('#input').autocomplete({
      source: function(request,response){
        var prev = Session.get('previousSearch');
        response([prev]);
      },
      delay: 500,
      minLength: 1
    }); //initialize

    $('#input').hover(function(){
    $(this).autocomplete('search'," ");

    $(this).autocomplete({
      source: function(request,response) {
        var prev = Session.get('previousSearch');
        response([prev]);
      },
      select: function(even,ui){
        var prev = ui.item.value;
        Session.set('previousSearch', prev);
        console.log(ui.item.value);
        Meteor.call('removeData');
        Address.display_name = ui.item.label;
        GetNominatim(Address.display_name);

        Session.set('lat', Address.lat);
        Session.set('lon', Address.lon);
        GoogleReverseLookup.setAddress();
        Forecast.getLatestWeather(Session.get('lat'),Session.get('lon'));

        return false;
      }
    }); //on hover, show recent searches

    $(this).click(function(){
      $(this).autocomplete({
        source: function(request,response){
          GetNominatim(request.term);
          response(DataArr);
          DataArr = [];
          SearchRes = {};
        },
        select: function(event,ui){
          var prev = ui.item.value;
          Session.set('previousSearch', prev);
          console.log(ui.item.value);
          Meteor.call('removeData');
          Address.display_name = ui.item.label;
          GetNominatim(Address.display_name);

          Session.set('lat', Address.lat);
          Session.set('lon', Address.lon);
          GoogleReverseLookup.setAddress();
          Forecast.getLatestWeather(Session.get('lat'),Session.get('lon'));

          return false;
        }
      });
    }); //on click, initialize search

    },function(){
     //hover out
    });
  });
}
