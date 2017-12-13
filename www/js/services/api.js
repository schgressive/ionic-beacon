angular.module('beaconDemo.services', [])
  .service('apiService', function($q, $http, CONFIG) {
    var deferred;
    var service = {
      getAllBeacons: function() {
        return $http({
          method: 'GET',
          url: CONFIG.apiURL + '/beacons/get-all-beacons'
        }).then(function(response) {
          return response.data;
        });
      },
      getById: function(beaconId){
        return $http({
          method: 'GET',
          url: CONFIG.apiURL + '/beacons/get-beacon',
          params: {
            uuid: beaconId
          }
        }).then(function(response) {
          return response.data;
        });
      },
      getUserInfo: function (rut) {
        return $http({
          method: 'GET',
          url: CONFIG.apiURL + '/usuarios',
          params: {
            rut: rut
          }
        }).then(function(response) {
          return response.data;
        });
      }
    };
    return service;
});
