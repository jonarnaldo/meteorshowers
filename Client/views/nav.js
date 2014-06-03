if (Meteor.isClient) {
 
  Template.nav.events({

    //user should activate after they press enter to submit search
    
    'mouseover #input': function () {
      $('#input').autocomplete({
        source: function(request,response){
          response(Address.prev);
        },
        delay: 0,
        minLength: 4
      });

      $('#input').autocomplete('search'," ");

      $('#input').autocomplete({
        source: function(request,response) {
          response(Address.prev);
        },
        select: function(even,ui){
          Session.set('previousSearch', ui);
          console.log('autocomplete hover: ' + ui.item.value);
          Address.display_name = ui.item.label;

          GetNominatim(Session.get('currentSearch')).then(function(data){
            SetLatLon(data);
            SetCoordinates();
          }).then(function() {
            return GoogleReverseLookup.setAddress();
          }).then(function(googData){
            Session.set('cityStateZip',googData.results[4].formatted_address);
          }).then(function() {
            Address.cityStateZip = Session.get('cityStateZip');
            Address.lat = Session.get('lat');
            Address.lon = Session.get('lon');
            Meteor.call('removeData');
            return GetLatestWeather(Session.get('lat'),Session.get('lon'));
          }).then(function(weatherData){
            Meteor.call('insertCurrent',weatherData.currently,Session.get('cityStateZip'),Session.get('lat'),Session.get('lon'));
            Meteor.call('insertFuture', weatherData.daily.data);
          }).done();
          $(this).val('');
          return false;
        }
          
      });
    }, 

    'click #input': function () {
      console.log('clicked');
      $('#input').autocomplete({
        source: function(request,response){
          GetNominatim(request.term).then(function(data){
            SetLatLon(data);
          }).then(function(){
            response(Session.get('DataArr'));
          }).done();           
        },
        select: function(event,ui){
          Address.prev = ('previousSearch', ui);
          Session.set('currentSearch', ui.item.label);

          GetNominatim(Session.get('currentSearch')).then(function(data){
            SetLatLon(data);
            SetCoordinates();
          }).then(function() {
            return GoogleReverseLookup.setAddress();
          }).then(function(googData){
            Session.set('cityStateZip',googData.results[4].formatted_address);
          }).then(function() {
            Address.cityStateZip = Session.get('cityStateZip');
            Address.lat = Session.get('lat');
            Address.lon = Session.get('lon');
            Meteor.call('removeData');
            return GetLatestWeather(Session.get('lat'),Session.get('lon'));
          }).then(function(weatherData){
            Meteor.call('insertCurrent',weatherData.currently,Session.get('cityStateZip'),Session.get('lat'),Session.get('lon'));
            Meteor.call('insertFuture', weatherData.daily.data);
          }).done();
          $(this).val('');
          return false;
        }
      });
    }
  }); 
} 