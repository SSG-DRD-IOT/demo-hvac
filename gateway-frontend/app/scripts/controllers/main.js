'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')

  .controller('MainCtrl',['$scope', '$http', function($scope,$http,$position) {
    
    $http.get('http://localhost:3000/noOfSensor').success(function(data,satus) {
            $scope.noOfSensor = data;
     });
    $http.get('http://localhost:3000/noOfActuator').success(function(data,satus) {
            $scope.noOfActuator = data;
     });
    $http.get('http://localhost:3000/noOfTrigger').success(function(data,satus) {
            $scope.noOfTrigger = data;
     });
    
    
  }]);
