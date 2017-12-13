(function() {
    'use strict';

    angular
        .module('beaconDemo.controllers')
        .controller('HomeCtrl', HomeCtrl);
        
    function HomeCtrl ($scope, $ionicPlatform, $cordovaBeacon, $rootScope, realTimeService, CONFIG, $ionicLoading, $ionicPopup, $timeout, apiService, $localStorage) {

        var showingPopup = false;
        var loadBeacons = function () {
            apiService.getAllBeacons().then(function (data) {
            // realTimeService.getAllBeacons().then(function (data) {
                $scope.allBeacons = data;
                console.log(JSON.stringify(data));
                if (CONFIG.env.dev) { // Si estamos en desarrollo - SIMULAR BEACON
                    $scope.currentBeacons = {}
                    // var testBeacon = data[2];
                    angular.forEach(data, function (testBeacon) {
                        $scope.currentBeacons[testBeacon.uuid || testBeacon.UUID] = {
                            uuid: testBeacon.uuid || testBeacon.UUID,
                            desc: testBeacon.desc || testBeacon.DESC,
                            accuracy: 15,
                            name: testBeacon.name || testBeacon.NAME,
                            type: testBeacon.type || testBeacon.TYPE,
                            color: $scope.beaconsColor[testBeacon.UUID]
                        };
                        console.log($scope.currentBeacons)
                        // body...
                    })
                }
            })
        }

        $scope.debugMode = CONFIG.env.dev;

        $scope.toggleMode = function () {
            $scope.debugMode = !$scope.debugMode
        }

        $scope.userName = $localStorage.currentUser ? $localStorage.currentUser.name : "Invitado"

        $scope.allBeaconsName = {
            "33600E37309": "MESA1", // ROSADO
            "22774E5668": "LCD1", // AMARILLO
            "36462E13212": "LCD2" // VIOLETA
        }

        $scope.beaconsColor = {
            "33600E37309": "#e08fbf", // ROSADO
            "22774E5668": "#d8c617", // AMARILLO
            "36462E13212": "#720d4e" // VIOLETA
        }

        $scope.allBeacons = []

        $scope.isEmpty = function (obj) {
            if (obj) return Object.keys(obj).length === 0;;
            return true;
        }

        $scope.showTVinfo = function (beacon) {
            if (showingPopup) return false;
            showingPopup = true;
            realTimeService.setHostContent(beacon.uuid, {
                user: $localStorage.currentUser || false, 
                text: "Enviado desde el Beacon: " + beacon.name,
                sendAt: Date.now()
            })
            $ionicLoading.show({
                template: 'Mostrando Info en Pantalla',
                duration: 5000
            })
            $timeout(function() {
                showingPopup = false;
            }, 4000);
        }

        $scope.showInfoToEjecutivo = function (beacon) {
            console.log("setHostContentEjecutivo")
            realTimeService.setHostContentEjecutivo("EJ1234", {
                user: $localStorage.currentUser || false, 
                text: "Enviado desde el Beacon: " + beacon.name,
                sendAt: Date.now()
            })
        }

        $scope.showContactar = function (beacon) {
            if (showingPopup) return false;
            showingPopup = true;
            $scope.currentMesa = beacon.desc;
            var confirmPopup = $ionicPopup.show({
                templateUrl: 'templates/contact.html',
                scope: $scope,
                cssClass: 'contact-ejecutivo',
                buttons: [
                    { 
                        text: 'Si',
                        onTap: function(e) {
                            return true;
                        }
                    },
                    { text: 'No' },
                ]
            });
            confirmPopup.then(function (answer) {
                if (answer) {
                    $scope.showInfoToEjecutivo(beacon);
                    $ionicLoading.show({
                      template: 'Un ejecutivo viene en camino a atenderte.',
                      duration: 10000
                    })
                };
                showingPopup = false;
            })
        }

        $scope.showHorario = function () {
            if (showingPopup) return false;
            showingPopup = true;
            var confirmPopup = $ionicPopup.show({
                templateUrl: 'templates/horario.html',
                scope: $scope,
                cssClass: 'contact-ejecutivo',
                buttons: [
                     { text: 'Ok' },
                ]
            });
            confirmPopup.then(function () {
                showingPopup = false;
            })
        }

        $scope.$on("$ionicView.beforeEnter", function(){
            loadBeacons();
            $scope.currentBeacons = {}
        });
 
        $ionicPlatform.ready(function() {

            if (ionic.Platform.isWebView()) { // Si es APP
                $cordovaBeacon.requestWhenInUseAuthorization();
                $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", CONFIG.regionId));
                $scope.currentBeacons = {}
            }
     
            $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
                var uniqueBeaconKey;
                for(var i = 0; i < pluginResult.beacons.length; i++) {
                    var beacon = pluginResult.beacons[i];
                    uniqueBeaconKey = beacon.major + "E" + beacon.minor;
                    console.log("searching", uniqueBeaconKey)
                    var beaconInfo = _.findWhere($scope.allBeacons, {uuid: uniqueBeaconKey}) || _.findWhere($scope.allBeacons, {UUID: uniqueBeaconKey}) || {name: "<Sin Nombre>"}
                    var formattedBeacon = {
                        test: false,
                        uuid: uniqueBeaconKey,
                        proximity: beacon.proximity,
                        rssi: beacon.rssi,
                        accuracy: beacon.accuracy,
                        color: $scope.beaconsColor[uniqueBeaconKey.toString()],
                        name: beaconInfo.name || beaconInfo.NAME,
                        type: beaconInfo.type || beaconInfo.TYPE
                    };
                    beacon.name = formattedBeacon.name
                    if (beacon.accuracy > 0 && beacon.accuracy < 1) {
                         if (formattedBeacon.type == 1){
                            $scope.showTVinfo(beacon); // MOSTRAR INFO EN TV
                         }
                        if (formattedBeacon.type == 2) {
                            $scope.showContactar(beacon) // EJECUTIVO SI-NO
                        }
                         if (formattedBeacon.type == 3) {
                            $scope.showHorario(beacon) // HORARIO
                        }
                    }
                    console.log(JSON.stringify(formattedBeacon))
                    if (beacon.accuracy > 0) {
                        $scope.currentBeacons[uniqueBeaconKey] = formattedBeacon
                    } else {
                        delete $scope.currentBeacons[uniqueBeaconKey];
                    }
                }
                $scope.$apply();
            });
     
        });


        // if (accuracy < 0) {
        //     return "ProximityUnknown";
        //     // is this correct?  does proximity only show unknown when accuracy is negative?  I have seen cases where it returns unknown when
        //     // accuracy is -1;
        // }
        // if (accuracy < 0.5) {
        //     return "ProximityImmediate";
        // }
        // // forums say 3.0 is the near/far threshold, but it looks to be based on experience that this is 4.0
        // if (accuracy <= 4.0) {
        //     return "ProximityNear";
        // }
        // // if it is > 4.0 meters, call it far
        // return "ProximityFar";


    }

}).call(this);