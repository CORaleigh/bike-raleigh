angular.module('starter')
.directive('routes', function () {
	return {
		templateUrl: 'templates/routes.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData) {
			$scope.routeLayer = null;
			var expressions = [];
			$scope.$on('routesUpdated', function () {
				$scope.routeLayer = MapData.getRoutes();
				$scope.$parent.routeLyr = $scope.routeLayer;
				for (var i = 0; i < $scope.routeLayer.renderer.uniqueValueInfos.length; i++) {
					$scope.routeLayer.renderer.uniqueValueInfos[i].visible = true;
					expressions.push($scope.routeLayer.renderer.uniqueValueInfos[i].value );
					if ($scope.routeLayer.renderer.uniqueValueInfos[i].label === ' ') {
						$scope.routeLayer.renderer.uniqueValueInfos[i].label = 'Preferred Route';
					}
				}
			});
		}
	}
});
