'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('FormCtrl', function($scope) {
    
      $scope.listTable = {
         $http.get('http://localhost:3000/listActuator').success(function(data) {
            $scope.table = data;
        });
    };

}]);