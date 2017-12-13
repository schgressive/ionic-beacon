// Ionic Starter App

// TEST BEACONS
// yellow:
//    mayor: 22774 - minor: 5668
// pink:
//    mayor: 33600 - minor: 37309

angular.module('beaconDemo', [
    'ionic',
    'ngCordovaBeacon',
    'ngStorage',
    'ngRaven',
    'firebase',
    'beaconDemo.services',
    'beaconDemo.controllers',
    'beaconDemo.firebase',
    'beaconDemo.filters'
])
 
.run(function($ionicPlatform, $state) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.constant('CONFIG', {
    env: (window.location.hostname == "localhost") ? {dev : true} : {dev: false},
    apiURL: (window.location.hostname == "localhost") ? 'http://localhost:8100/api' : "https://8kbydbo3i8.execute-api.us-east-1.amazonaws.com/dev",
    regionId: 'b9407f30-f5f8-466e-aff9-25556b57fe6d'//'40d9ec3f-4f90-4e03-aa3f-8a2db2949b48' // "b9407f30-f5f8-466e-aff9-25556b57fe6d"
})

.config([
    '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        
        $urlRouterProvider.otherwise('/m/home');
        
        $stateProvider
        .state('main', {
            url: '/m',
            abstract: true,
            templateUrl: 'templates/sidebar.html'
        })
        .state('main.home', {
            url: '/home',
            cache: false,
            views: {
                MainView: {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('main.login', {
            url: '/login',
            cache: false,
            views: {
                MainView: {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        .state('host', {
            url: '/host',
            controller: 'HostCtrl',
            templateUrl: 'templates/host.html'
        })
        ;

        // IONIC CONFIG
        //$ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.navBar.alignTitle('center');

        var config = {
            apiKey: "AIzaSyDPseWGvxcwYGRHXHPOl3syb9N1HLke_lc",
            authDomain: "beacondemo-7772f.firebaseapp.com",
            databaseURL: "https://beacondemo-7772f.firebaseio.com",
            projectId: "beacondemo-7772f",
            storageBucket: "",
            messagingSenderId: "742663325928"
        };

        firebase.initializeApp(config);
    }
]);

angular.module('beaconDemo.controllers', []);

Raven
  .config('https://2c766e92957b4eda88b95351497a8141@sentry.io/241183')
  .addPlugin(Raven.Plugins.Angular)
  .install();
