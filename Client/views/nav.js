if (Meteor.isClient) {

  Meteor.subscribe('current');

  Template.nav.events({
    //user should activate after they press enter to submit search
    'mouseover #input': function () {
      $('#input').autocomplete({
        source: function(request,response){
          response([foo]); //change to reactive source
        },
        delay: 300,
        minLength: 4
      });

      $('#input').autocomplete('search'," ");

      $('#input').click(function () {
        $('#input').autocomplete({
          source: function(request,response) {
            MS.GetNominatim(request.term).then(function(data){
              MS.SetLatLon(data);
              response(Session.get('DataArr'));
            }).done();
          },
          select: function(even,ui){
            Session.set('previousSearch', ui.item.label);
            Session.set('currentSearch', ui.item.label);
            MS.Address.display_name = ui.item.label;

            MS.GetNominatim(Session.get('currentSearch')).then(function(data){
                MS.SetLatLon(data);
                MS.SetCoordinates(); //Session lat and lon are set
              }).then(function() {
                return MS.GoogleReverseLookup();
              }).then(function(googData){
                Session.set('cityStateZip',googData.results[1].formatted_address);
              }).then(function() {
                MS.Address.cityStateZip = Session.get('cityStateZip');
                MS.Address.lat = Session.get('lat');
                MS.Address.lon = Session.get('lon');
                Meteor.call('removeData');
                return MS.GetLatestWeather(Session.get('lat'),Session.get('lon'));
              }).then(function(weatherData){
                Meteor.call('insertCurrent',weatherData.currently,Session.get('cityStateZip'),Session.get('lat'),Session.get('lon'));
                Meteor.call('insertFuture', weatherData.daily.data);
              }).done();
              $(this).val('');
              return false;
          }
        });
      });  
    }
  });
} 