var adapp = angular.module('adminApp', []);

adapp.controller('adController', function($scope,$http){
	//items box ==============================================
	
	$scope.items = [];

	//order and rowLimit ==============================================
	$scope.rowLimit = 10;
	$scope.sortColumn = "_id"
	$scope.reverseSort = false;
	$scope.sortData = function(column){
		$scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
		$scope.sortColumn = column;
	};
	$scope.getSortClass = function(column){
		if($scope.sortColumn == column){
			return $scope.reverseSort ? 'arrow_up' : 'arrow_down';
		}
		return '';
	}
	//crud operation =============================================
	//get all items when open window ==================================
	$http({
		method: "GET",
		url: 'admin/read'
	}).then(function(res){
		//sccess callback =======================================
		$scope.items = res.data;
		console.log(res);
	},function(err){
		//error callback =====================================
		console.log(err);
	});

	//add item ===================================================
	$scope.add = function(){
		$http({
			method: "POST",
			url: '/admin/add',
			data: {
				lat: $scope.newLat,
				lng: $scope.newLng,
				style:$scope.newStyle,
				temperature:$scope.newTemperature,
				comment:$scope.newComment,
				rate: $scope.newRate
			}
		}).then(function(res){
			//success callback ===========================
			$scope.items.push(res.data);
			console.log(res);
			console.log($scope.items);
			//refresh
			$scope.newLat   = "";
			$scope.newLng   = "";
			$scope.newStyle = "";
			$scope.newTemperature = "";
			$scope.newComment = "";
			$scope.newRate = "";
		},function(err){
			//error callback ============================
			console.log(err);
		});
	}

	//update item ============================================
	$scope.update = function(index){
		$http({
			method: 'PUT',
			url: 'admin/update',
			data: {
				_id: $scope.items[index]._id,
				lat: $scope.items[index].lat,
				lng: $scope.items[index].lng,
				style: $scope.items[index].style,
				temperature: $scope.items[index].temperature,
				comment: $scope.items[index].comment,
				rate: $scope.items[index].rate
			}
		}).then(function(res){
			//success callback =============
			console.log(res);
		},function(err){
			//error callback ==========
			console.log(err);
		});
	}

	//delete item ==============================================
	$scope.delete = function(index){
		console.log($scope.items[index]._id);
		$http({
			method: 'DELETE',
			url: '/admin/delete/',
			params: {_id: $scope.items[index]._id}
		}).then(function(res){
			//success callback =============
			console.log(res);
			$scope.items.splice(index,1);
		},function(err){
			//error callback ==========
			console.log(err);
		});
	}

});
