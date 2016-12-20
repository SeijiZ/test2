var adapp = angular.module('adminApp', []);

adapp.controller('adController', function($scope,$http){
	//items box ==============================================
	
	$scope.items = [];

	//order and rowLimit ==============================================
	$scope.rowLimit = 10;
	$scope.sortColumn = "name"
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
	}).success(function(data, status, headers, config){
		$scope.items = data;
		console.log(status);
		console.log(data);
	}).error(function(data, status, headers, config){
		console.log(status);
	})
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
		}).success(function(data, status, headers, config){
			$scope.items.push(data);

			console.log(data);
			console.log($scope.items);
			//refresh
			$scope.newLat   = "";
			$scope.newLng   = "";
			$scope.newStyle = "";
			$scope.newTemperature = "";
			$scope.newComment = "";
			$scope.newRate = "";
		}).error(function(data,status,headers,config){
			console.log(data);
			console.log(status);
		})
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
		}).success(function(data, status, headers, config){
			console.log(data);
			console.log(status);
		}).error(function(data, status, headers, config){
			console.log(data);
			console.log(status);
		})
	}
	//delete item ==============================================
	$scope.delete = function(index){
		console.log($scope.items[index]._id);
		$http({
			method: 'DELETE',
			url: '/admin/delete/',
			params: {_id: $scope.items[index]._id}
		}).success(function(data, status, headers, config){
			console.log(status);
			console.log(data);
			$scope.items.splice(index,1);
		}).error(function(data, status, headers, config){
			console.log(data);
			console.log(status);
		})
	}
});
