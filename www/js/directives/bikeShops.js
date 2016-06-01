angular.module('starter')
.directive('bikeShops', function () {
  return {
    templateUrl: 'templates/bikeShops.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, $timeout, MapData, $ionicSideMenuDelegate ) {
      $scope.shopsLyr = null;
      $scope.mapView = null;
      $scope.shopsFilter = function (shop) {
        return shop.attributes.distance <= 5;
      }
      $scope.$on('bikeShopsUpdated', function (e, data) {
        $scope.shopsPane = MapData.getMapView().getPane('shops');
        $scope.shops = MapData.getBikeShops();
        $scope.shopsLyr = MapData.getBikeShopsLayer();
        if ($scope.shops && $scope.mapView){
          setDistance();
        }
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {

        $scope.mapView = MapData.getMapView();
      });
      var setDistance = function () {
          for (var i = 0; i < $scope.shops.length; i++) {
            item = $scope.shops[i];
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
        if ($scope.currentList  === 'Bike Shops') {
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
      $scope.shopClicked = function (shop) {
        MapData.getMapView().flyTo([shop.geometry.coordinates[1], shop.geometry.coordinates[0]], 18)
        $timeout(function() {
          $rootScope.$broadcast('featureSelected', shop, 'shops');
        });
      };
    }
  }
});
