var app = angular.module('myApp', ['ui.bootstrap']);

//intialize after loading ============================================
app.run(function($rootScope, ngGeolocation,googleMapApi){
//get current position and make map ==================================
	ngGeolocation.getCurrentPosition()
	.then(function(res){
		var options = {
			zoom: 13,
			center: new google.maps.LatLng(res.coords.latitude, res.coords.longitude)
		}
		$rootScope.map = new google.maps.Map(document.getElementById('map_canvas'), options);

//initialize geolocationApi's watchPosition ==========================
		ngGeolocation.watchPosition({timeout: 60000, maximumAge: 0, enableHighAccuracy: true});
		$rootScope.myPosition = ngGeolocation.position
		var count = 0;
		var markers = [];
		$rootScope.$watch('myPosition.coords', function(newValue, oldValue){

//define watch position ==============================================
			$rootScope.newPos = newValue;
			$rootScope.oldPos = oldValue;
			console.log($rootScope.newPos);

//make marker ========================================================
			markers[count] = new google.maps.Marker({
				position: new google.maps.LatLng($rootScope.newPos.latitude, $rootScope.newPos.longitude)
			});
			markers[count].setMap($rootScope.map);
			count = count +1;
			console.log(count + "times");

//remove previous marker =============================================
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


//initiate modal window ==============================================
		$scope.openSearch = function(size){
			var modalInstance = $uibModal.open({
				size: size,
				templateUrl: 'searchModal.html',
				controller: "modalInsatnceCtrl"
			});
		}

//open post modal window and get result ==============================
		$scope.openPost = function(size){
			var modalInstance = $uibModal.open({
				size: size,
				templateUrl: 'postModal.html' ,
				controller: "modalInsatnceCtrl"
			})
//process after post modal button ====================================
				.result.then(function(Obj){
					$scope.postObj = Obj;

//show post footer ===================================================
					$rootScope.showbtn = true;

//define icon to use =================================================
					var icon = new google.maps.MarkerImage(
						'images/new_icon.png',
						new google.maps.Size(50,50)
					);

//define marker options ==============================================
					var markerOptions = {
						position: new google.maps.LatLng($rootScope.newPos.latitude, $rootScope.newPos.longitude),
						map: $rootScope.map,
						icon: icon,
						draggable: true
					};

//define marker ======================================================
					var marker = new google.maps.Marker(markerOptions);

//set initial value ==================================================
					$scope.confirmedLatLng = {lat: $rootScope.newPos.latitude,lng: $rootScope.newPos.longitude};

//register listener event ============================================
					google.maps.event.addListener(marker, 'dragend', function(res){
						$scope.confirmedLatLng = {lat: res.latLng.lat(), lng: res.latLng.lng()};
					});
				})
		}

//fixed post button ==================================================
		$scope.postFixed = function(){
			console.log($scope.postObj);
			console.log("Lat: " + $scope.confirmedLatLng.lat + ", Lng: " + $scope.confirmedLatLng.lng);
			var postData = {
				lat: $scope.confirmedLatLng.lat,
				lng: $scope.confirmedLatLng.lng,
				style: $scope.postObj.style,
				temperature: $scope.postObj.temperature,
				comment: $scope.postObj.comment
			};
			connectionService.postItem("/post", postData)
			.then(function(res){
				console.log(res);
			})
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

		$scope.closeModalWindow = function(){
			$uibModalInstance.dismiss("cancel");
		}

//define  checkbox initial value =====================================
		$scope.searchValue = {
			Style: {
				Western: 0,
				Japanese: 0
			},
			Temperature: {
				Warm: 0,
				Cold: 0
			}
		}

//search button ======================================================
	$scope.searchItems = function(){

//define object ======================================================
		var searchObj = {
			lat: $rootScope.newPos.latitude,
			lng: $rootScope.newPos.longitude,
			range: $scope.searchRange,
//define sum of checkbox value =======================================
			style: $scope.searchValue.Style.Western + $scope.searchValue.Style.Japanese,
			temperature: $scope.searchValue.Temperature.Warm + $scope.searchValue.Temperature.Cold
		};

//server communicatin and pull data ==================================
		connectionService.getSearchedItems('/search', searchObj)
			.then(function(items){
				console.log(items);

//define markers and add infowindow ==================================
				$scope.markers = [];
				var infoWindow = new google.maps.InfoWindow();

//define create marker ===============================================
				var createMarker = function(info){
					var marker = new google.maps.Marker({
						map: $rootScope.map,
						position: new google.maps.LatLng(info.lat, info.lng)
					});
					marker.content = "<h1>" + info.style + "</h1>"
									 "<div>" + info.comment + "</div>";

//register litener event =============================================
					google.maps.event.addListener(marker, "click",function(){
						infoWindow.setContent(marker.content);
						infoWindow.open($rootScope.map, marker);
					});

					$scope.markers.push(marker);
				}

//loop createMarker ==================================================
				for(i = 0; i < items.length; i++){
					createMarker(items[i]);
				}
				$scope.closeModalWindow();
			})
	}
	
	$scope.postModalButton = function(){
//pass data to mainCtrl ==============================================
		var postModel = {
			style: $scope.postItemStyle,
			temperature: $scope.postSeatTemperature,
			comment: $scope.postComment
		};
		$uibModalInstance.close(postModel);
	}

});

