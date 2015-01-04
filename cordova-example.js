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
    },
    'click #push' : function ( e ) {
      console.log ( 'test' );
      Push.send({
        from: 'Test',
        title: 'Hello',
        text: 'World',
        badge: 12,
        query: {}
      });
    }
  });
}

Push.debug = true;

if ( Meteor.isServer ) {
  // cert/key placed in the private folder
  var apnsProdCert = Assets.getText('DevChatCert.pem');
  var apnsProdKey = Assets.getText('DevChatKey.pem');

  var optionsProduction = {
    apn: {    
      'passphrase': '',
      'certData': apnsProdCert,
      'keyData': apnsProdKey
    },
    "production": false,
    "badge": true,
    "sound": true,
    "alert": true,
    "vibrate": true
  };

  Push.init( optionsProduction );
}

if ( Meteor.isClient ) {

  Push.init({
        apn: {
            pushId: 'com.mantarayar.cordova',
            webServiceUrl: 'http://192.168.0.10:3000'
        },
        bagde: true,
        sound: true,
        alert: true
    });
  // Internal events
  Push.addListener('token', function(token) {
      // Token is { apn: 'xxxx' } or { gcm: 'xxxx' }
      alert( JSON.stringify( token ) )
  });

  Push.addListener('error', function(err) {
      if (error.type == 'apn.cordova') {
          console.log(err.error);
      }
  });

  Push.addListener('register', function(evt) {
      // Platform specific event - not really used
      alert( JSON.stringify( evt ) )
  });

  Push.addListener('alert', function(notification) {
      // Called when message got a message in forground
      alert( JSON.stringify( notification ) )
  });

  Push.addListener('sound', function(notification) {
      // Called when message got a sound
      alert( JSON.stringify( notification ) )
  });

  Push.addListener('badge', function(notification) {
      // Called when message got a badge
      alert( JSON.stringify( notification ) )
  });

  Push.addListener('startup', function(notification) {
      // Called when message recieved on startup (cold+warm)
      alert( JSON.stringify( notification ) )
  });

  Push.addListener('message', function(notification) {
      // Called on every message
      alert( JSON.stringify( notification ) )
  });
}
