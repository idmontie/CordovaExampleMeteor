if (Meteor.isClient) {
  Session.setDefault( 'navigatorPosition', {
    latitude : 'loading...',
    longitude : 'loading...'
  } );

  Meteor.startup(function () {
    // The correct way
    navigator.geolocation.getCurrentPosition( function ( position ) {
      console.log( position )
      Session.set( 'navigatorPosition', position.coords );
    } );
  });


  Template.hello.helpers({
    navigatorPosition: function () {
      return Session.get( 'navigatorPosition' )
    },
    geolocationPosition: function () {
      var position = Geolocation.currentLocation();
      
      if ( position == null ) {
        return {
          latitude : 'loading...',
          longitude : 'loading...'
        }
      }

      return position.coords;
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
