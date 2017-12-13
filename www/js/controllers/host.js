(function() {
    'use strict';

    angular
        .module('beaconDemo.controllers')
        .controller('HostCtrl', HostCtrl);
        
    function HostCtrl ($scope, realTimeService, $localStorage, $timeout, apiService) {
        var beaconUnWatch = false;
        var loadBeacons = function () {
            apiService.getAllBeacons().then(function (data) {
                $scope.allBeacons = _.where(data, {TYPE: 1});
                $scope.showChooseBeacon = true;
            });
        };

        var showLightboxContent = function (content) {
            $scope.lightboxContent = content
            $scope.showUserInfo = true;
            $scope.showLightbox = true;
            $timeout(function() {
                $scope.showLightbox = false;
                $scope.showUserInfo = false;
            }, 5000);
        }

        $scope.ejecutivoId = "EJ1234";
        $scope.asEjecutivo = false;

        $scope.setBeacon = function (beaconId) {
            console.log(beaconId)
            var beaconInfo = realTimeService.setActiveBeacon(beaconId)

            beaconUnWatch = beaconInfo.$watch(function(newValue) {
                console.log("new", beaconInfo)
                if (beaconInfo.hostContent) {
                    showLightboxContent(beaconInfo.hostContent)
                };
            });
            $localStorage.currentHost = beaconId
            $scope.showChooseBeacon = false;
            console.log("Escuchando BEACON: ", $localStorage.currentHost)
        }

        $scope.setHostAsEjecutivo = function (ejecutivoId) {
            var beaconInfo = realTimeService.setActiveEjecutivo(ejecutivoId)

            beaconUnWatch = beaconInfo.$watch(function(newValue) {
                console.log("new", beaconInfo)
                if (beaconInfo.hostContent) {
                    showLightboxContent(beaconInfo.hostContent)
                };
            });
            $localStorage.currentHost = ejecutivoId
            $scope.showChooseBeacon = false;
            $scope.asEjecutivo = true;
            console.log("Escuchando BEACON: ", $localStorage.currentHost)
        }

        $scope.cancelWatch = function () {
            console.log("reset")
            if (beaconUnWatch) {
                beaconUnWatch();
                beaconUnWatch = false;
            }
            $scope.selectedBeacon = null;
            $localStorage.currentHost = null
            $scope.showChooseBeacon = true;
            $scope.showLightbox = true;
            $scope.asEjecutivo = false;
            loadBeacons();
        }

        $scope.$on("$ionicView.beforeEnter", function () {
            $scope.showUserInfo = false;
            if (!$localStorage.currentHost) {
                $scope.selectedBeacon = null;
                $scope.showLightbox = true
                loadBeacons();
            } else {
                $scope.setBeacon($localStorage.currentHost)
                $scope.selectedBeacon = $localStorage.currentHost
                $scope.showLightbox = false
            }            
        })
    }

}).call(this);