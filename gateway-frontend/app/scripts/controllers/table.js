
'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
 
 //var config = require('./config.json');
 angular.module('sbAdminApp')

 .controller('TableCtrl',['$scope','$location','$http', '$window', function($scope,$location,$http,$window) {

  // To get data from actuator table
  $http.get('/listActuator').success(function(data,status) {
    $scope.actuators = data;
  });

  // To get data from Sensor table
   $http.get('/listSensor').success(function(data,status) {
    $scope.sensors = data;
  });

   // To get data from Trigger table
   $http.get('/listTrigger').success(function(data,status) {
    $scope.triggers = data;
  });

   

 }]);