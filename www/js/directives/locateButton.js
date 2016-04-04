angular.module('starter')
.directive('locateButton', function () {
	return {
		templateUrl: 'templates/locateButton.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData, Address) {
      $scope.mapView = null;

      var watch = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });
      $scope.$on('locationLayerCreated', function () {
        $scope.layer = MapData.getLocationLayer();
      });
      var updateLocation = function (position) {
        $scope.mapView.animateTo({center: [position.coords.longitude, position.coords.latitude], zoom: 16});
        require(['esri/Graphic', 'esri/symbol/PictureMarkerSymbol'], function (Graphic, PictureMarkerSymbol) {

        });
      };
      $scope.geoLocate = function () {
        $scope.locating = !$scope.locating;
        if ($scope.locating) {
          watch = navigator.geolocation.watchPosition(updateLocation);
        } else {
          navigator.geolocation.clearWatch(watch);
        }
      }
	}
}});
