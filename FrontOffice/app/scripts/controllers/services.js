'use strict'

angular.module('frontOfficeApp')
  .controller('ServicesCtrl', function ($scope, $http) {
    $scope.mainView = true;
    $scope.vetDescr = false;
    $scope.dogSitDescr = false;
    $scope.psychoDescr = false;
    $scope.vetQuarters = [];
    $scope.psyQuarters = [];
    $scope.dogQuarters = [];

    $scope.veterinarian = function(){
      $scope.mainView = false;
      $scope.vetDescr = true;
    }
    $scope.dogsitter = function(){
      $scope.mainView = false;
      $scope.dogSitDescr = true;
    }
    $scope.psychologist = function(){
      $scope.mainView = false;
      $scope.psychoDescr = true;
    }
    $scope.headquarters = function(srvc){
      $http.get(frontRoute + '/headquarters', {
        params: {
          service: srvc
        }
      })
      .then((res) => {
        switch(srvc){
          case 'Veterinarian':
            $scope.vetQuarters = res.data.headquarters
            break;
          case 'Dog Sitter':
            $scope.dogQuarters = res.data.headquarters
            break;
          case 'Psychologist':
            $scope.psyQuarters = res.data.headquarters
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }

    $scope.backServices = function(){
      location.replace('https://site212223.tw.cs.unibo.it/BackOffice/#/services')
    };

    $scope.headquarters("Veterinarian");
    $scope.headquarters("Dog Sitter");
    $scope.headquarters("Psychologist");
  });
