var adapp = angular.module('adminApp', []);

adapp.controller('adCtrl', function($scope){
	$scope.toilets = [
		{_id: 0001,lat: 10,lng: 10, style: "Japanese"},
		{_id: 0002,lat: 20,lng: 20, style: "Japanese"},
		{_id: 0003,lat: 30,lng: 30, style: "Western"},
		{_id: 0004,lat: 40,lng: 40, style: "Western"}
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
	]
	$scope.rowLimit = 3;

});
