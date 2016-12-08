var adapp = angular.module('adminApp', []);

adapp.controller('adCtrl', function($scope,$http){
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
				name: $scope.newName,
				lat: $scope.newLat,
				lng: $scope.newLng,
				style:$scope.newStyle
			}
		}).success(function(data, status, headers, config){
			$scope.items.push(data);

			console.log(data);
			console.log($scope.items);
			//refresh
			$scope.newName  = "";
			$scope.newLat   = "";
			$scope.newLng   = "";
			$scope.newStyle = "";
		}).error(function(data,status,headers,config){
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
				name: $scope.items[index].name,
				lat: $scope.items[index].lat,
				lng: $scope.items[index].lng,
				style: $scope.items[index].style
			}
		}).success(function(data, status, headers, config){
			console.log(status);
			console.log(data);
		}).error(function(data, status, headers, config){
			console.log(status);
		})
	}
	//delete item ==============================================
	$scope.delete = function(index){
		console.log($scope.items[index]._id);
		$http({
			method: 'DELETE',
			url: '/admin/delete',
			data: {_id: $scope.items[index]._id}
		})
		console.log(data);
		$scope.items.splice(index,1);
	}
});

//adapp.config(function($httpProvider){
//	$httpProvider.defaults.transformRequest = function(data){
//		if(data === undefined){
//			return data;
//		}
//		return $.param(data);
//	}
//});
