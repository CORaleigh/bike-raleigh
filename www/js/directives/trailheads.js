angular.module('starter')
.directive('trailheads', function () {
  return {
    templateUrl: 'templates/trailheads.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, $timeout, MapData, $ionicSideMenuDelegate ) {
      $scope.trailheadsLyr = null;
      $scope.mapView = null;
      $scope.layerVisibility = true;
      $scope.trailheadFilter = function (trailhead) {
        return trailhead.properties.distance <= 5;
      }
      $scope.$on('trailheadsUpdated', function (e, data) {
        $scope.trailheads = MapData.getTrailheads();
        $scope.trailheadsLyr = MapData.getTrailheadsLayer();
        if ($scope.trailheads){
          setDistance();
        }
        $scope.trailheadsPane = MapData.getMapView().getPane('trailheads');
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });

      var setDistance = function () {
          for (var i = 0; i < $scope.trailheads.length; i++) {
            item = $scope.trailheads[i];
            if (item){
              var center = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Point",
                  "coordinates": [MapData.getMapView().getCenter().lng, MapData.getMapView().getCenter().lat]
                }
              };
              var point2 = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Point",
                  "coordinates": item.geometry.coordinates
                }
              };
              dist = turf.distance(point2, center, 'miles');
              item.properties.distance = dist;
            }
          }
      }
      $scope.$on('menuGroupToggled', function (e, group) {
        if ($scope.currentList  === 'Greenway Access') {
          setDistance();
        }
      });
      $scope.$watch(function () {
        return $ionicSideMenuDelegate.getOpenRatio();
      },
      function (ratio) {
        if (ratio == 1){
          setDistance();
        }
      });
      $scope.trailheadClicked = function (trailhead) {
        MapData.getMapView().flyTo([trailhead.geometry.coordinates[1], trailhead.geometry.coordinates[0]], 18)
        $timeout(function() {
          $rootScope.$broadcast('featureSelected', trailhead, 'trailheads');
        });
      };
    }
  }
});
