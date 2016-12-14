var app = angular.module('myApp', ['ui.bootstrap']);

app.run(function($rootScope, ngGeolocation,Map){
	ngGeolocation.getCurrentPosition()
	.then(function(res){
		var options = {
			zoom: 9,
			center: new google.maps.LatLng(res.coords.latitude, res.coords.longitude)
		}
		$rootScope.map = new google.maps.Map(document.getElementById('map_canvas'), options);
		console.log(res);
		ngGeolocation.watchPosition({timeout: 60000,maximumAge: 250, enableHighAccuracy: true});
		$rootScope.myPosition = ngGeolocation.position
		$rootScope.$watch('myPosition.coords', function(newValue, oldValue){
			$rootScope.newPos = newValue;
			$rootScope.oldPos = oldValue;
			Map.addMarker(new google.maps.LatLng(newValue.latitude, newValue.longitude),$rootScope.map, true);
		})
	});
});

app.controller('mainController', function($scope,$window,$http,connectionService, Map) {
//initlize
	var lat = 50;
	var lng = -50;
//	$window.navigator.geolocation.getCurrentPosition(function(pos){
//		lat = pos.coords.latitude;
//		lng = pos.coords.longitude;
//		console.log(lat);
//		var options = {
//			zoom: 9,
//			center: new google.maps.LatLng(lat, lng)
//		}
//		$scope.map = new google.maps.Map(document.getElementById('map_canvas'), options);
//		Map.addMarker(options.center, $scope.map);
//
//		connectionService.getAllItem('/test1')
//			.then(function(res){
//				//success
//				$scope.results = connectionService.items;
//				$scope.marker = Map.addMarker(
//					new google.maps.LatLng($scope.results[0].lat, $scope.results[0].lng),
//					$scope.map,
//					false
//				);
//				var infowindow = new google.maps.InfoWindow({content:'sample'});
//				google.maps.event.addListener('click', function(){
//					infowindow.open($scope.map, $scope.marker);
//				});
//				//geolocationApi.getPosition().then(function(cpos){console.log(cpos.coords.latitude)});
//			//	geolocationApi.watchPosition({
//			//		timeout: 10000,
//			//		enableHighAccuracy: true
//			//	});
//			//	$scope.myPosition = geolocationApi.position;
//			//	$scope.$watch('myPosition', function(newValue, oldValue){
//			//		console.log(newValue);
//			//		console.log(oldValue);
//			//	});
//			})
//
//	});
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
	$scope.openSearch = function(size){
		var modalInstance = $uibModal.open({
			size: size,
			templateUrl: 'searchModal.html' ,
			controller: "modalInsatnceCtrl"
		});
	}
	$scope.openPost = function(size){
		var modalInstance = $uibModal.open({
			size: size,
			templateUrl: 'postModal.html' ,
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
