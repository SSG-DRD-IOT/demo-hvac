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

  .controller('MainCtrl',['$scope', '$http', function($scope,$http,$position) {
    
    $http.get('http://172.16.21.235:3000/noOfSensor').success(function(data,satus) {
            $scope.noOfSensor = data;
     });
    $http.get('http://172.16.21.235:3000/noOfActuator').success(function(data,satus) {
            $scope.noOfActuator = data;
     });
    $http.get('http://172.16.21.235:3000/noOfTrigger').success(function(data,satus) {
            $scope.noOfTrigger = data;
     });
    
    $scope.getSensorData = function(actuatorId){
              var data = "{\"sensorId\":\"1\"}";
              $http.post( 'http://172.16.21.235:3000/getSensorData',data).success(function (data, status, headers, config) {
                     $scope.sensorData = data;
            });    
    };
    
    
    $http.get('http://172.16.21.235:4000/api/v0001/azure/historic/data?id=b506768ce1e2353fe063d344e89e53e5').success(function(data,status) {
            $scope.line1 = data;
     });
    
  }]);
