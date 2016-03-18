angular.module('starter')
.directive('facilities', function () {
	return {
		templateUrl: 'templates/facilities.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData) {
			$scope.layer = null;
			var expressions = [];
			$scope.$on('facilitiesUpdated', function () {
				$scope.layer = MapData.getFacilities();
				for (var i = 0; i < $scope.layer.renderer.infos.length; i++) {
					$scope.layer.renderer.infos[i].visible = true;
					expressions.push($scope.layer.renderer.infos[i].value )
				}
				console.log($scope.layer.renderer.infos);
			});
			$scope.toggleLayer = function (layer, item) {
				if (!item.visible && expressions.indexOf(item.value) > -1) {
					expressions.splice(expressions.indexOf(item.value), 1);
				} else {
					expressions.push(item.value);
				}
				layer.definitionExpression = "FaclType in ('" + expressions.toString().replace(/,/g, "','") +"')";
			};
		}
	}
});
