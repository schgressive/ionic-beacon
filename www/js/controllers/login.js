(function() {
    'use strict';

    angular
        .module('beaconDemo.controllers')
        .controller('LoginCtrl', LoginCtrl);
        
    function LoginCtrl ($scope, apiService, $localStorage, $ionicPopup, $state) {
        $scope.rut = "";// 160958995

        $scope.getUserInfo = function (rut) {
            apiService.getUserInfo(rut.replace("-", "")).then(function (res) {
                console.log(res)
                if (res.length == 0) {
                    $ionicPopup.alert({
                        title: 'Usuario no encontrado',
                        template: 'Rut no está registrado'
                    });
                } else{
                    $localStorage.currentUser = {
                        name: res[0]["NOMBRE"],
                        last_name:  res[0]["APELLIDO"],
                        rut:  res[0]["RUT"],
                        type:  res[0]["TIPO_BANCA"],
                    }
                    $state.go("main.home")
                }
            })
        }
    
    }

}).call(this);