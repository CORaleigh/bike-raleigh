angular.module('starter')
.directive('facilities', function () {
	return {
		templateUrl: 'templates/facilities.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData) {
			$scope.facilityLyr = null;
			var expressions = [];
			$scope.$on('facilitiesUpdated', function () {
				$scope.facilityLyr = MapData.getFacilities();
				$scope.facilitiesPane = MapData.getMapView().getPane('facilities');
				// $scope.$parent.facilityLyr = $scope.facilityLyr;
				// for (var i = 0; i < $scope.facilityLyr.renderer.uniqueValueInfos.length; i++) {
				// 	$scope.facilityLyr.renderer.uniqueValueInfos[i].visible = true;
				// 	expressions.push($scope.facilityLyr.renderer.uniqueValueInfos[i].value )
				// }
			});
		}
	}
});
