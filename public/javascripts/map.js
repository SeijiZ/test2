var app = angular.module('myApp', ['ui.bootstrap']);

//intialize after loading ============================================
app.run(function($rootScope, ngGeolocation,googleMapApi){
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
		console.log($rootScope.myPosition);
		var count = 0;
		var markers = [];
		$rootScope.$watch('myPosition.coords', function(newValue, oldValue){
			$rootScope.newPos = newValue;
			$rootScope.oldPos = oldValue;
			$rootScope.LatLng = new google.maps.LatLng($rootScope.newPos.latitude, $rootScope.newPos.longitude);
			console.log($rootScope.newPos);
			markers[count] = new google.maps.Marker({position: $rootScope.LatLng});
			markers[count].setMap($rootScope.map);
			count = count +1;
			console.log(count + "times");
			if(count > 1){
				markers[count - 1].setMap(null);
			}
		})
	});
});


//intialize after loading ============================================
//app.run(function($rootScope, ngGeolocation,Map){
//	ngGeolocation.watchPosition({timeout: 60000, maximumAge: 250, enableHighAccuracy: true});
//	$rootScope.myPosition = ngGeolocation.position
//	console.log($rootScope.myPosition);
//	var count = 0;
//	var markers = [];
//	$rootScope.$watch('myPosition.coords', function(newValue, oldValue){
//		$rootScope.newPos = newValue;
//		$rootScope.oldPos = oldValue;
//		if(count ==0){
//			var options = {
//				zoom: 13,
//				center: new google.maps.LatLng(
//					$rootScope.newPos.latitude,
//					$rootScope.newPos.longitude)
//			}
//				$rootScope.map = new google.maps.Map(document.getElementById('map_canvas'), options);
//		}
//			$rootScope.LatLng = new google.maps.LatLng($rootScope.newPos.latitude, $rootScope.newPos.longitude);
//			console.log($rootScope.newPos);
//			markers[count] = new google.maps.Marker({position: $rootScope.LatLng});
//		markers[count].setMap($rootScope.map);
//		count = count +1;
//		console.log(count + "times");
//		if(count > 1){
//			markers[count - 1].setMap(null);
//		}
//	})
//});

//main controller ====================================================
app.controller('mainController', function(
	$rootScope,
	$scope,
	$q,
	$http,
	$uibModal,
	connectionService,
	googleMapApi) {


//infowindow sample===========================================
		$scope.testa = function(){

			function asyncMarker(lat,lng){
				var defer = $q.defer();
				var marker = googleMapApi.addMarker(
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

//initiate modal window ==============================================
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
app.controller('modalInsatnceCtrl', function(
	$rootScope,
	$scope,
	$uibModalInstance,
	connectionService,
	googleMapApi){

	$scope.cancel = function(){
		$uibModalInstance.dismiss("cancel");
	}

//search button ======================================================
	$scope.searchItems = function(){
		var searchObj = {
			range: $scope.searchRange,
			style: $scope.searchItemStyle,
			temperature: $scope.searchSeatTemperature
		};
		connectionService.getSearchedItems('/search', searchObj)
			.then(function(res){
				console.log(res);
				//success
				$rootScope.items = connectionService.items;
				console.log($rootScope.items);
				var markers = [];
				var infoWindow = [];
				for(var i = 0; i < $rootScope.items.length; i++){
					console.log(i);
					console.log($rootScope.items[i]);
					markers[i] = googleMapApi.addMarker(
						new google.maps.LatLng($rootScope.items[i].lat, $rootScope.items[i].lng),
						$rootScope.map,
						false
					);
					infoWindow[i] = new google.maps.InfoWindow({content: "<h1>" + $scope.items[i].style + "</h1>"});
					google.maps.event.addListener(markers[i], 'click', function(){
						console.log(i);
						infoWindow[i].open($rootScope.map, markers[i]);
					});
				}
					console.log($rootScope.items[0]);
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

