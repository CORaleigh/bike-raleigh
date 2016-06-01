angular.module('starter')
.directive('greenways', function () {
	return {
		templateUrl: 'templates/greenways.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData) {
			$scope.greenwayLyr = null;
			var expressions = [];
			$scope.$on('greenwaysLayerUpdated', function () {
				$scope.greenwaysLyr = MapData.getGreenwaysLayer();
				$scope.greenwaysPane = MapData.getMapView().getPane('greenways');
				// $scope.$parent.greenwaysLyr = $scope.greenwaysLyr;
				// for (var i = 0; i < $scope.greenwaysLyr.renderer.uniqueValueInfos.length; i++) {
				// 	$scope.greenwaysLyr.renderer.uniqueValueInfos[i].visible = true;
				// 	expressions.push($scope.greenwaysLyr.renderer.uniqueValueInfos[i].value )
				// }
			});
		}
	}
});
