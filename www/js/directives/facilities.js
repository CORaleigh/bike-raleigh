angular.module('starter')
.directive('facilities', function () {
	return {
		templateUrl: 'templates/facilities.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData) {
			$scope.layer = null;
			$scope.$on('facilitiesUpdated', function () {
				$scope.layer = MapData.getFacilities();
				console.log($scope.layer.renderer.infos);
			});
		}
	}
});
