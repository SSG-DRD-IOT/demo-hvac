
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
	  
         $http.get('http://172.16.21.235:3000/listActuator').success(function(data,status) {
            $scope.actuators = data;
     });
         $http.get('http://172.16.21.235:3000/listSensor').success(function(data,status) {
            $scope.sensors = data;
     });
         $http.get('http://172.16.21.235:3000/listTrigger').success(function(data,status) {
            $scope.triggers = data;
     });
         
       $scope.removeRow = function(triggerId){
              var data = "{\"id\":\""+triggerId+ "\"}";
              $http.post( 'http://172.16.21.235:3000/removeTrigger',data).success(function (data, status, headers, config) {
              $window.location.reload();
            });
    };
    
    $scope.getApi = function(actuatorId){
              var data = "{\"id\":\""+actuatorId+ "\"}";
              $http.post( 'http://172.16.21.235:3000/getApi',data).success(function (data, status, headers, config) {
                     $scope.api = data;
            });    
    };
    
     $scope.saveData = function(data){
              $http.post( 'http://172.16.21.235:3000/addTrigger',data).success(function (data, status, headers, config) {
            $window.location.reload();
            });      
    };
    
    $http.get('http://172.16.21.235:3000/getCustomizeCloud').success(function(data,status) {
            $scope.customizeCloud = data;
     });
    
}]);