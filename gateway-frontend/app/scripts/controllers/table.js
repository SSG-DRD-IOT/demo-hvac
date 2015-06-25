
'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')

  .controller('TableCtrl',['$scope','$http', function($scope,$http) {
         $http.get('http://localhost:3000/listActuator').success(function(data,satus) {
            $scope.actuators = data;
     });

}]);