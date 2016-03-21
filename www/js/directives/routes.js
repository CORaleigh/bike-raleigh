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
				for (var i = 0; i < $scope.routeLayer.renderer.infos.length; i++) {
					$scope.routeLayer.renderer.infos[i].visible = true;
					expressions.push($scope.routeLayer.renderer.infos[i].value );
					if ($scope.routeLayer.renderer.infos[i].label === ' ') {
						$scope.routeLayer.renderer.infos[i].label = 'Preferred Route';
					}
				}
				console.log($scope.routeLayer.renderer.infos);
			});
			$scope.toggleLayer = function (layer, item) {
				if (!item.visible && expressions.indexOf(item.value) > -1) {
					expressions.splice(expressions.indexOf(item.value), 1);
				} else {
					expressions.push(item.value);
				}
				layer.definitionExpression = "Comfort in ('" + expressions.toString().replace(/,/g, "','") +"')";
			};
		}
	}
});
