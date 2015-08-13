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
    // $scope.temperature = angular.toJson(data);
  });

  $http.get('http://localhost:4000/api/v0001/bluemix/historic/data?id=light').success(function(data,status) {
    //  alert(angular.toJson(data));
    // $scope.light = angular.toJson(data);
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
    "name":"temperature",
    "color":"steelblue",
    "data":[{"x":1002594,"y":84},{"x":1006407,"y":64},{"x":1012870,"y":74},{"x":1014566,"y":64},{"x":1017182,"y":68},{"x":1017425,"y":70},{"x":1025387,"y":63},{"x":1043434,"y":88},{"x":1056571,"y":72},{"x":1070181,"y":61},
    {"x":1092980,"y":62},{"x":1129201,"y":69},{"x":1139220,"y":69},{"x":1167538,"y":79},{"x":1168384,"y":84},{"x":1169389,"y":79},{"x":1186464,"y":74},{"x":1188608,"y":67},{"x":1203005,"y":67},{"x":1206723,"y":78},
    {"x":1232770,"y":68},{"x":1243331,"y":75},{"x":1255712,"y":72},{"x":1273987,"y":66},{"x":1281625,"y":86},{"x":1287274,"y":84},{"x":1298500,"y":70},{"x":1306715,"y":63},{"x":1315939,"y":83},{"x":1318179,"y":65}]
  }];

  $scope.light = [{
    "name":"light",
    "color":"steelblue",
    "data":[{"x":0,"y":65.60606995364651},{"x":1,"y":76.48741307202727},{"x":2,"y":73.52375820977613},{"x":3,"y":73.38926550233737},{"x":4,"y":73.3366736350581},{"x":5,"y":71.35695379693061},{"x":6,"y":73.94725311314687},
    {"x":7,"y":69.32066617067903},{"x":8,"y":67.8627244150266},{"x":9,"y":64.95372299104929},{"x":10,"y":66.7796544637531},{"x":11,"y":72.81902870396152},{"x":12,"y":85.86864301236346},{"x":13,"y":74.84706577146426},
    {"x":14,"y":70.03292581764981},{"x":15,"y":63.61128306481987},{"x":16,"y":73.67417286615819},{"x":17,"y":83.42571099288762},{"x":18,"y":79.7671609162353},{"x":19,"y":71.67972742812708},{"x":20,"y":62.86496356828138},
    {"x":21,"y":89.64700524928048},{"x":22,"y":83.23826145613566},{"x":23,"y":74.6874109050259},{"x":24,"y":68.37850142503157},{"x":25,"y":73.48453153157607},{"x":26,"y":71.76276732701808},{"x":27,"y":83.49111506715417},
    {"x":28,"y":75.38891527801752},{"x":29,"y":73.19361909292638},{"x":30,"y":63.758313262369484},{"x":31,"y":67.99378209980205},{"x":32,"y":85.71157425642014},{"x":33,"y":83.20836280938238},{"x":34,"y":69.8840327351354},
    {"x":35,"y":69.04516048030928},{"x":36,"y":71.17114167194813},{"x":37,"y":66.67633372591808},{"x":38,"y":74.12685002200305},{"x":39,"y":76.98439663974568},{"x":40,"y":61.61606614245102},{"x":41,"y":72.18196250265464},
    {"x":42,"y":83.89702200656757},{"x":43,"y":76.64366534678265},{"x":44,"y":80.99208964733407},{"x":45,"y":65.40297521045431},{"x":46,"y":86.22650440782309},{"x":47,"y":72.79093668563291},{"x":48,"y":64.19532870640978},
    {"x":49,"y":67.82004923326895}]}];

  // $scope.temperature = [{
  //   name: 'Series 1',
  //   color: 'steelblue',
  //   data: [{x: 0, y: 23}, {x: 1, y: 15}, {x: 2, y: 79}, {x: 3, y: 31}, {x: 4, y: 60}]
  // }];


  // To remove row from trigger

  // To get historic data from cloud
  //$http.get('http://172.16.21.235:4000/api/v0001/historic/data?id=123').success(function(data,status) {
  //       $scope.line1 = data;
  // });

}]);
