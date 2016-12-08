var app = angular.module('myApp', ['ui.bootstrap']);

// 1. Google Map // 
app.controller('myCtrl', function($scope,$window,$http) {
//initlize
	var lat = 50;
	var lng = -50;
	$window.navigator.geolocation.getCurrentPosition(function(position){
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		var options = {
			zoom: 9,
			center: new google.maps.LatLng(lat, lng)
		}
		$scope.map = new google.maps.Map(document.getElementById('map_canvas'), options);
	});
//google map apiはここまで

	$scope.doSearch = function(){
		$http({
			method: "GET",
			url: '/test1'
		}).success(function(data, status, headers, config){
			$scope.results = data;
			console.log(status);
			console.log(data);
		}).error(function(data, status, headers, config){
			console.log(status);
		})
	}
	$scope.createNew = function(){
		$http({
			method: "POST",
			url: '/test2'
		}).success(function(data, status, headers, config){
			$scope.results = data;
			console.log(status);
			console.log(data);
		}).error(function(data, status, headers, config){
			console.log(status);
		})
	}
});

//open search modal window ===========================================
app.controller('ModalWindows', function($scope, $uibModal){
	$scope.open = function(size){
		var modalInstance = $uibModal.open({
			size: size,
			templateUrl: 'searchModal.html' ,
			controller: "modalInsatnceCtrl"
		});
	}
});

//in the search modal window ===========================================
app.controller('modalInsatnceCtrl', function($scope,$uibModalInstance){
	$scope.cancel = function(){
		$uibModalInstance.dismiss("cancel");
	}
});
