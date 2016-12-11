var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('mainController', function($scope,$window,$http,connectionService, Map) {
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
		Map.addMarker(options.center, $scope.map);

		connectionService.getAllItem('/test1')
			.then(function(res){
				//success
				$scope.results = connectionService.items;
				console.log($scope.results[0]);
				Map.addMarker(
					new google.maps.LatLng($scope.results[0].lat, $scope.results[0].lng),
					$scope.map,
					false
				);
				Map.addInfoWindow(new google.maps.LatLng($scope.results[0].lat, $scope.results[0].lng));
			})

	});
//google map apiはここまで

	$scope.doSearch = function(){
		connectionService.getAllItem('/test1')
			.then(function(res){
				//success
				$scope.results = connectionService.items;
			})
	//	$http({
	//		method: "GET",
	//		url: '/test1'
	//	}).success(function(data, status, headers, config){
	//		$scope.results = data;
	//		console.log(status);
	//		console.log(data);
	//	}).error(function(data, status, headers, config){
	//		console.log(status);
	//	})
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

//in the search modal window =========================================
app.controller('modalInsatnceCtrl', function($scope,$uibModalInstance){
	$scope.cancel = function(){
		$uibModalInstance.dismiss("cancel");
	}
});

//define services ====================================================
//service to connect server ==========================================
app.factory('connectionService', function($http, $q){
	var connect = this;
	connect.items = {};
	var defer = $q.defer();

	connect.getAllItem =function(url){
		$http({
			method: 'GET',
			url: url
		})
		.success(function(data, status, headers, config){
			connect.items = data
			defer.resolve(data);
		})
		.error(function(data, status, headers, config){
			defer.reject(err);
		})
		return defer.promise;
	}
	return connect;
});

//service to use google map api ======================================
app.factory('Map', function(){
//	var map = this;
//	map.addMarker = function(position, map){
//		new google.maps.Marker({
//			position: position,
//			map: map,
//		})
//	}
//	return map;
	return{
		addMarker: function(position, map, bool){
			new google.maps.Marker({
				position: position,
				map: map,
				draggable: bool
			})
		},
		
		addInfoWindow: function(position){
			new google.maps.InfoWindow({
				content: 'sample',
				position: position
			})
		}
	};
});


//app.run(function($rootScope){
//	$rootScope.endPoint = 'http://localhost:3000';
//});
//
//
//app.service('task', function($http, $q, $rootScope){
//	var task = this;
//	task.getAllTasks = function(){
//		var defer = $q.defer();
//		$http.get($rootScope.endPoint + '/tasks')
//		.success(function(res){
//			task.tasklist = res;
//			defer.resolve(res);
//		})
//		.error(err, status){
//			defer.reject(err);
//		}
//		return defer.promise;
//	}
//
//	task.creatTask = function(task){
//		var defer = $.defer
//		$http.post($rootScope.endPoint + '/newTask',task)
//		.success(function(res){
//			defer.resolve(res);
//		})
//		.error(function(err, status){
//			defer.reject(err);
//		})
//		return defer.promise;
//	}
//
//	task.deleteTask = function(id){
//		var defer = q.defer();
//		$http.delete($rootScope.endPoint + '/delete' + id)
//		.success(function(res){
//			defer.resolve(res);
//		})
//		.error(function())
//	}
//	
//
//
//	return task;
//});
//
//
//  this.init = function() {
//        var options = {
//            center: new google.maps.LatLng(40.7127837, -74.00594130000002),
//            zoom: 13,
//            disableDefaultUI: true    
//        }
//        this.map = new google.maps.Map(
//            document.getElementById("map"), options
//        );
//        this.places = new google.maps.places.PlacesService(this.map);
//    }
//    
//    this.search = function(str) {
//        var d = $q.defer();
//        this.places.textSearch({query: str}, function(results, status) {
//            if (status == 'OK') {
//                d.resolve(results[0]);
//            }
//            else d.reject(status);
//        });
//        return d.promise;
//    }
//    
//    this.addMarker = function(res) {
//        if(this.marker) this.marker.setMap(null);
//        this.marker = new google.maps.Marker({
//            map: this.map,
//            position: res.geometry.location,
//            animation: google.maps.Animation.DROP
//        });
//        this.map.setCenter(res.geometry.location);
//    }
//    
//});
//
//app.controller('newPlaceCtrl', function($scope, Map) {
//    
//    $scope.place = {};
//    
//    $scope.search = function() {
//        $scope.apiError = false;
//        Map.search($scope.searchPlace)
//        .then(
//            function(res) { // success
//                Map.addMarker(res);
//                $scope.place.name = res.name;
//                $scope.place.lat = res.geometry.location.lat();
//                $scope.place.lng = res.geometry.location.lng();
//            },
//            function(status) { // error
//                $scope.apiError = true;
//                $scope.apiStatus = status;
//            }
//        );
//    }
//    
//    $scope.send = function() {
//        alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);    
//    }
//    
//    Map.init();
//});
