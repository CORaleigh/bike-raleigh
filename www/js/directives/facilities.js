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
				for (var i = 0; i < $scope.facilityLyr.renderer.infos.length; i++) {
					$scope.facilityLyr.renderer.infos[i].visible = true;
					expressions.push($scope.facilityLyr.renderer.infos[i].value )
				}
				console.log($scope.facilityLyr.renderer.infos);
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
