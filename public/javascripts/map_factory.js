//service to connect server ==========================================
app.factory('connectionService', function($http, $q){
	var connect = this;
	connect.items = {};
	var defer = $q.defer();

	connect.getAllItem =function(url){
		$http({
			method: 'GET',
			url: url
		}).then(function(res){
			//success callback ========
			connect.items = res.data;
			defer.resolve(res.data);
		}, function(err){
			//error callback ===========
			defer.reject(err);
		});
		return defer.promise;
	}

	connect.getSearchedItems =function(url,obj){
		$http({
			method: 'GET',
			url: url,
			params:obj
		}).then(function(res){
			//success callback ========
			connect.items = res.data;
			defer.resolve(res.data);
		}, function(err){
			//error callback ===========
			defer.reject(err);
		});
		return defer.promise;
	}

	connect.postItem = function(url, data){
		$http({
			method: 'POST',
			url: url,
			data: data
		}).then(function(res){
			//success callback ========
			defer.resolve(res.data);
		}, function(err){
			//error callback ===========
			defer.reject(err);
		});
		return defer.promise;
	}

	return connect;
});


//service to use google map api ======================================
app.factory('googleMapApi', function(){
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
			return new google.maps.Marker({
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

//service to use Geolocation API======================================
//app.factory('geolocationApi', function($rootScope, $q, $window){
//	var position = {};
//	return {
//		getPosition: function(){
//			var defer = $q.defer();
//			$window.navigator.geolocation.getCurrentPosition(
//				function(position){
//					$rootScope.$apply(function(){
//						position.coords = position.coords;
//						defer.resolve(position);
//					});
//				}
//			);
//			return defer.promise;
//		},
//		watchPosition: function(options){
//			if(!this.watchId){
//			this.watchId = $window.navigator.geolocation.watchPosition(
//				function(wpos){
//					//success function
//					$rootScope.$apply(function(){
//						position.coords = wpos.coords;
//						$rootScope.$broadcast('geolocation.position.changed',position);
//					});
//				},
//				function(error){
//					//error function
//					$rootScope.$apply(function(){
//						position.error = error;
//						$rootScope.$broadcast('geolocation.position.error', error);
//					});
//				},
//				options
//			);
//			}
//		},
//		clearWatch: function(){
//			if(this.watchId){
//				navigator.geolocation.clearWatch(this.watchId);
//				delete this.watchId;
//			}
//		},
//		position: position
//	};
//});

app.factory('ngGeolocation', function($rootScope, $window, $q){
	function supported() {
		return 'geolocation' in $window.navigator;
	}

	var retVal = {
		getCurrentPosition: function(options) {
			var deferred = $q.defer();
			if(supported()) {
				$window.navigator.geolocation.getCurrentPosition(
					function(position) {
						$rootScope.$apply(function() {
							retVal.position.coords = position.coords;
							retVal.position.timestamp = position.timestamp;
							deferred.resolve(position);
						});
					},
					function(error) {
						$rootScope.$apply(function() {
							deferred.reject({error: error});
						});
					}, options);
			} else {
				deferred.reject({error: {
					code: 2,
					message: 'This web browser does not support HTML5 Geolocation'
				}});
			}
			return deferred.promise;
		},

		watchPosition: function(options) {
			if(supported()) {
				if(!this.watchId) {
					this.watchId = $window.navigator.geolocation.watchPosition(
						function(position) {
							$rootScope.$apply(function() {
								retVal.position.coords = position.coords;
								retVal.position.timestamp = position.timestamp;
								delete retVal.position.error;
								$rootScope.$broadcast('$geolocation.position.changed', position);
							});
						},
						function(error) {
							$rootScope.$apply(function() {
								retVal.position.error = error;
								delete retVal.position.coords;
								delete retVal.position.timestamp;
								$rootScope.$broadcast('$geolocation.position.error', error);
							});
						}, options);
				}
			} else {
				retVal.position = {
					error: {
						code: 2,
						message: 'This web browser does not support HTML5 Geolocation'
					}
				};
			}
		},

		clearWatch: function() {
			if(this.watchId) {
				$window.navigator.geolocation.clearWatch(this.watchId);
				delete this.watchId;
			}
		},

		position: {}
	};

	return retVal;
});
