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
    
    $scope.getSensorData = function(actuatorId){
              var data = "{\"sensorId\":\"1\"}";
              $http.post( 'http://localhost:3000/getSensorData',data).success(function (data, status, headers, config) {
                     $scope.sensorData = data;
            });    
    };
    
    
    $http.get('http://172.16.21.85:4000/api/v0001/historic/data?id=123').success(function(data,status) {
            $scope.line1 = data;
     });
    
  }]);
