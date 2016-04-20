angular.module('starter')
.directive('locateButton', function () {
	return {
		templateUrl: 'templates/locateButton.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData, Address) {
      $scope.mapView = null;
      $scope.graphics = null;
      var watch = null;
      var navWatch = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });
      $scope.$on('locationLayerCreated', function () {
        $scope.graphics = MapData.getLocationLayer();
      });
      var updateLocation = function (position) {
        var center = {center: [position.coords.longitude, position.coords.latitude]};
        $scope.mapView.animateTo(center);
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
      var disableLocation = function () {
        navigator.geolocation.clearWatch(watch);
        $scope.locating = false;
        $scope.safeApply();
        navWatch.remove();
        console.log('location');
      };
      $scope.safeApply = function(fn) {
        var phase = $scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          $scope.$apply(fn);
        }
      };
      $scope.geoLocate = function () {
        watchCount = 0;
        $scope.locating = !$scope.locating;
        if ($scope.locating) {
          watch = navigator.geolocation.watchPosition(updateLocation);
          navWatch = $scope.mapView.watch('interacting', function (evt) {
            if (evt) {
              disableLocation();
            }
          });
        } else {
          disableLocation();
          $scope.graphics.clear();
        }
      };
      $scope.$on('placeSelected', disableLocation);
	}
}});
