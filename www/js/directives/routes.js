angular.module('starter')
.directive('routes', function () {
	return {
		templateUrl: 'templates/routes.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData) {
			$scope.layer = null;
			var expressions = [];
			$scope.$on('routesUpdated', function () {
				$scope.layer = MapData.getRoutes();
				for (var i = 0; i < $scope.layer.renderer.infos.length; i++) {
					$scope.layer.renderer.infos[i].visible = true;
					expressions.push($scope.layer.renderer.infos[i].value );
					if ($scope.layer.renderer.infos[i].label === ' ') {
						$scope.layer.renderer.infos[i].label = 'Preferred Route';
					}
				}
				console.log($scope.layer.renderer.infos);
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
