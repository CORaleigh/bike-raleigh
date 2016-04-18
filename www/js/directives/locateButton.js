angular.module('starter')
.directive('locateButton', function () {
	return {
		templateUrl: 'templates/locateButton.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData, Address) {
      $scope.mapView = null;
      $scope.graphics = null;
      var watch = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });
      $scope.$on('locationLayerCreated', function () {
        $scope.graphics = MapData.getLocationLayer();
      });
      var updateLocation = function (position) {
        $scope.mapView.animateTo({center: [position.coords.longitude, position.coords.latitude], zoom: 16});
        require(['esri/Graphic', 'esri/symbols/PictureMarkerSymbol', 'esri/geometry/Point'], function (Graphic, PictureMarkerSymbol, Point) {
          $scope.graphics.clear();
          var pms = new PictureMarkerSymbol({
            url: 'http://coraleigh.github.io/bike-raleigh/www/img/location.svg',
            height: 50,
            width: 50
          });
          var g = new Graphic({geometry: new Point({
            longitude: parseFloat(position.coords.longitude),
            latitude: parseFloat(position.coords.latitude)
          }), symbol: pms});
          $scope.graphics.add(g);

        });
      };
      $scope.geoLocate = function () {
        $scope.locating = !$scope.locating;
        if ($scope.locating) {
          watch = navigator.geolocation.watchPosition(updateLocation);
        } else {
          navigator.geolocation.clearWatch(watch);
          $scope.graphics.clear();
        }
      }
	}
}});
