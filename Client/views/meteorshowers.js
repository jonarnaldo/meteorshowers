if(Meteor.isClient){
	var randomMeteor = function() {  
    var windowWidth = $(document).width();
    var randomLeftstart = Math.floor(Math.random()*windowWidth-100);
    var randomLeftend = randomLeftstart + 100;
   
    $('.shower').css({ top: '-20px', left: randomLeftstart, backgroundColor: 'black'});
    $('.shower').animate({ top: '80px', left: randomLeftend, backgroundColor: 'white' },400);
  }

  Meteor.setInterval(function(){ randomMeteor() }, 1000);
}