(function() {
  'use strict';
          
    function realTimeService ($firebaseArray, $firebaseObject) {
      var ref = firebase.database().ref();

      return {
        getAllBeacons: function(){
          return $firebaseArray(ref.child("beacons")).$loaded();
        },
        setActiveBeacon: function (beaconId) {
          return $firebaseObject(ref.child("beacons").child(beaconId));
        },
        setActiveEjecutivo: function (ejecutivoId) {
          return $firebaseObject(ref.child("ejecutivos").child(ejecutivoId));
        },
        setHostContent: function (beaconId, hostContent) {
          var currentBeacon = $firebaseObject(ref.child("beacons").child(beaconId));
          currentBeacon.$loaded().then(function(){
             currentBeacon.hostContent = hostContent
             currentBeacon.$save();
          });
        },
        setHostContentEjecutivo: function (ejecutivoId, hostContent) {
          var currentBeacon = $firebaseObject(ref.child("ejecutivos").child(ejecutivoId));
          currentBeacon.$loaded().then(function(){
             currentBeacon.hostContent = hostContent
             currentBeacon.$save();
          });
        }
      };
    }

  angular
    .module('beaconDemo.firebase', [])
    .service('realTimeService', ["$firebaseArray", "$firebaseObject", realTimeService]);

}).call(this);


