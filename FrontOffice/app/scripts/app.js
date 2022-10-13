'use strict';

/**
 * @ngdoc overview
 * @name frontOfficeApp
 * @description
 * # frontOfficeApp
 *
 * Main module of the application.
 */
angular
  .module('frontOfficeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
      .when('/commerce', {
        templateUrl: 'views/commerce.html',
        controller: 'CommerceCtrl',
        controllerAs: 'commerce' 
      })
      .when('/community', {
        templateUrl: 'views/community.html',
        controller: 'CommunityCtrl',
        controllerAs: 'community'
      })
      .when('/services', {
        templateUrl: 'views/services.html',
        controller: 'ServicesCtrl',
        controllerAs: 'services'
      })
      .otherwise({
        redirectTo: '/community'
      });
  })
  .controller('mainCtrl', function($scope,$rootScope){
    $rootScope.userLogged = '';
    $rootScope.logged = false;
    $rootScope.isAdmin = false;

    $scope.logout = function(){
      localStorage.removeItem('logged');
      $rootScope.userLogged = '';
      location.reload();
    }

    $scope.load = function(){
      $rootScope.isAdmin = admin();
      $rootScope.userLogged = user();
      $rootScope.logged = hasLogged();
    };
});
