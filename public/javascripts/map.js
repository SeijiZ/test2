var app = angular.module('myApp', ['ui.bootstrap']);

//intialize after loading ============================================
app.run(function($rootScope, ngGeolocation,Map){
	ngGeolocation.getCurrentPosition()
	.then(function(res){
		var options = {
			zoom: 13,
			center: new google.maps.LatLng(res.coords.latitude, res.coords.longitude)
		}
		$rootScope.map = new google.maps.Map(document.getElementById('map_canvas'), options);
		console.log(res);
		ngGeolocation.watchPosition({timeout: 60000, maximumAge: 0, enableHighAccuracy: true});
		$rootScope.myPosition = ngGeolocation.position
		var count = 0;
		$rootScope.$watch('myPosition.coords', function(newValue, oldValue){
			console.log(count);
			count = count + 1;
			$rootScope.newPos = newValue;
			$rootScope.oldPos = oldValue;
			$rootScope.LatLng = new google.maps.LatLng(newValue.latitude, newValue.longitude);
			Map.addMarker($rootScope.LatLng,$rootScope.map, false);
		})
	});
});

//main controller ====================================================
app.controller('mainController', function(
	$rootScope,
	$scope,
	$q,
	$http,
	$uibModal,
	connectionService,
	Map) {


//infowindow sample===========================================
		$scope.testa = function(){

			function asyncMarker(lat,lng){
				var defer = $q.defer();
				var marker = Map.addMarker(
					new google.maps.LatLng(lat, lng),
					$rootScope.map,
					false);
				console.log(marker);
				defer.resolve(marker);
				return defer.promise;
			}
			var promise = asyncMarker(36,140);
			promise.then(function(res){
				console.log(res);
				google.maps.event.addListener(res, 'click', function(){
					var infowindow = new google.maps.InfoWindow({content: "<h1>hello</h1>"});
					infowindow.open($rootScope.map, res);
				});
			});

//				var latlng = new google.maps.LatLng(36,140);
//				var marker = new google.maps.Marker({
//					position: latlng,
//					map: $rootScope.map
//				});
//				var infowindow = new google.maps.InfoWindow();
//				google.maps.event.addListener(marker, 'click', function(){
//					$scope.msg = "hello world"
//					infowindow.setContent("<h1>" + $scope.msg + "</h2>" );
//					infowindow.open($rootScope.map, marker);
//				})

		};

		$scope.doSearch = function(){
			console.log("dosearch");

			//		connectionService.getAllItem('/test1')
			//			.then(function(res){
			//				//success
			//				$scope.results = connectionService.items;
			//			})
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

//modal window controller ============================================
		$scope.openSearch = function(size){
			var modalInstance = $uibModal.open({
				size: size,
				templateUrl: 'searchModal.html',
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

	}
);


//in the search modal window =========================================
app.controller('modalInsatnceCtrl', function($rootScope, $scope, $uibModalInstance, connectionService){

	$scope.cancel = function(){
		$uibModalInstance.dismiss("cancel");
	}

	$scope.doSearch = function(){
		connectionService.getAllItem('/test1')
			.then(function(res){
				//success
				$rootScope.results = connectionService.items;
				$scope.cancel();
			})
	}
	
	$scope.post_modal_button = function(){
		$rootScope.showbtn = true;
		$scope.cancel();
		console.log($rootScope.newPos);
		var latlng = new google.maps.LatLng($rootScope.newPos.latitude, $rootScope.newPos.longitude);
		var marker = new google.maps.Marker({
			position: latlng,
			map: $rootScope.map,
			draggable: true});
		google.maps.event.addListener(marker, 'dragend', function(res){
			console.log(res);
		});
		
	}

});

