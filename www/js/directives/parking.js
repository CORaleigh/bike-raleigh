angular.module('starter')
.directive('parking', function () {
  return {
    templateUrl: 'templates/parking.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, $timeout, MapData, $ionicSideMenuDelegate ) {
      $scope.shopsLyr = null;
      $scope.mapView = null;
      $scope.layerVisibility = true;
      $scope.parkingFilter = function (lot) {
        return lot.properties.distance <= 5;
      };
      $scope.$on('parkingUpdated', function (e, data) {
        $scope.lots = MapData.getParking();
        $scope.parkingLyr = MapData.getParkingLayer();
        if ($scope.lots){
          setDistance();
        }
        $scope.parkingPane = MapData.getMapView().getPane('parking');
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });
      var setDistance = function () {
          for (var i = 0; i < $scope.lots.length; i++) {
            item = $scope.lots[i];
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
        if ($scope.currentList  === 'Parking') {
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
      $scope.lotClicked = function (lot) {
        MapData.getMapView().flyTo([lot.geometry.coordinates[1], lot.geometry.coordinates[0]], 18)
        $timeout(function() {
          $rootScope.$broadcast('featureSelected', lot, 'parking');
        });
      };
    }
  }
});
