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
    'click #take_photo' : function ( e ) {
      e.preventDefault();

      MeteorCamera.getPicture( function ( error, data ) {
        console.log( error, data )
        if ( error ) {
          alert( error );
        } else {
          $( '#photo' ).attr( 'src', data )
        }
      } )
    }
  });
}

