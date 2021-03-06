angular.module('starter')
.directive('locateButton', function () {
	return {
		templateUrl: 'templates/locateButton.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData, Address, $cordovaGoogleAnalytics) {
      $scope.mapView = null;
      $scope.graphics = null;
      var watch = null;
      var navWatch = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });
      $scope.$on('locationLayerCreated', function () {
        $scope.graphics = MapData.getLocationLayer();
				navigator.geolocation.getCurrentPosition(updateLocation, null, {enableHighAccuracy: true });
      });
			var watchCount = 0;
      var updateLocation = function (position) {
				if (MapData.checkInWake([position.coords.longitude, position.coords.latitude])) {
	        var center = {center: [position.coords.longitude, position.coords.latitude]};
					if (watchCount === 0) {
						center = {center: [position.coords.longitude, position.coords.latitude], zoom: 16};

						//$cordovaGoogleAnalytics.trackEvent('Geolocation', 'Coordinates', position.coords.latitude + ',' + position.coords.longitude);
					}
					$scope.mapView.goTo(center);
	        watchCount += 1;
	        require(['esri/Graphic', 'esri/symbols/PictureMarkerSymbol', 'esri/geometry/Point'], function (Graphic, PictureMarkerSymbol, Point) {
	          $scope.graphics.removeAll();
	          var pms = new PictureMarkerSymbol({
	            url: 'http://coraleigh.github.io/bike-raleigh/www/img/location.svg',
	            height: 36,
	            width: 36
	          });
	          var g = new Graphic({geometry: new Point({
	            longitude: parseFloat(position.coords.longitude),
	            latitude: parseFloat(position.coords.latitude)
	          }), symbol: pms});
	          $scope.graphics.add(g);

	        });
				}
      };
      var disableLocation = function () {
        navigator.geolocation.clearWatch(watch);
        $scope.locating = false;
        $scope.safeApply();
				if (navWatch) {
        	navWatch.remove();
				}
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
          watch = navigator.geolocation.watchPosition(updateLocation, null, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
          navWatch = $scope.mapView.watch('interacting', function (evt) {
            if (evt) {
              disableLocation();
            }
          });
        } else {
          disableLocation();
          $scope.graphics.removeAll();
        }
      };
      $scope.$on('placeSelected', disableLocation);
	}
}});
