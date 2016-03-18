angular.module('starter')
.directive('routes', function () {
	return {
		templateUrl: 'templates/routes.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData) {
			$scope.layer = null;
			$scope.$on('routesUpdated', function () {
				$scope.layer = MapData.getRoutes();
				console.log($scope.layer.renderer.infos);
			});
		}
	}
});
