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

.controller('MainCtrl',['$scope','$location','$http', '$window',function($scope,$location,$http,$window) {

  // To get Number of Sensors for Main Page
  $http.get('/noOfSensor').success(function(data,satus) {
    $scope.noOfSensor = data;
  });
  // To get number of actuators for main page
  $http.get('/noOfActuator').success(function(data,satus) {
    $scope.noOfActuator = data;
  });
  // To get number of triggers for main page
  $http.get('/noOfTrigger').success(function(data,satus) {
    $scope.noOfTrigger = data;
  });

  $http.get('/noOfError').success(function(data,satus) {
    $scope.noOfError = data;
  });

  // To get Sensor details for particular sensor Id
  $scope.getSensorData = function(actuatorId){
    var data = "{\"sensorId\":\"1\"}";
    $http.post( '/getSensorData',data).success(function (data, status, headers, config) {
      $scope.sensorData = data;
    });
  };

  // To get data for customization of cloud
  $http.get('/getCustomizeCloud').success(function(data,status) {
    $scope.customizeCloud = data;
  });






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

  // To get data for graph display
  $http.get('http://localhost:4000/api/v0001/azure/historic/data?id=temperature').success(function(data,status) {
    //  alert(angular.toJson(data));
    $scope.temperature = angular.toJson(data);
  });

  $scope.url = $scope.swaggerUrl = 'http://10.246.15.211:10010';

  $scope.removeRow = function(triggerId){
    var data = "{\"id\":\""+triggerId+ "\"}";
    $http.post( '/removeTrigger',data).success(function (data, status, headers, config) {
      $window.location.reload();
    });
  };

  // To get Api from particular actuator
  $scope.getApi = function(actuatorId){
    var data = "{\"id\":\""+actuatorId+ "\"}";
    $http.post( '/getApi',data).success(function (data, status, headers, config) {
      $scope.api = data;
    });
  };

  // To Save data for trigger
  $scope.saveData = function(data){
    $http.post( '/addTrigger',data).success(function (data, status, headers, config) {
      $window.location.reload();
    });
  };

  $scope.options2 = {
    renderer: 'line'
  };
  $scope.features2 = {
    hover: {
      xFormatter: function(x) {
        return 't=' + x;
      },
      yFormatter: function(y) {
        return y;
      }
    }
  };
  $scope.temperature = [{
    name: 'Series 1',
    color: 'steelblue',
    data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}, {x: 3, y: 31}, {x: 4, y: 60}]
  }];


  // To remove row from trigger

  // To get historic data from cloud
  //$http.get('http://172.16.21.235:4000/api/v0001/historic/data?id=123').success(function(data,status) {
  //       $scope.line1 = data;
  // });

}]);
