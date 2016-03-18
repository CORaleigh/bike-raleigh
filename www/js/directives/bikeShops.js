angular.module('starter')
.directive('bikeShops', function () {
  return {
    templateUrl: 'templates/bikeShops.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, MapData, $ionicSideMenuDelegate ) {
      $scope.layer = null;
      $scope.mapView = null;
      $scope.layerVisibility = true;
      $scope.$on('bikeShopsUpdated', function (e, data) {
        $scope.layer = MapData.getBikeShops();
        setDistance();
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });
      var setDistance = function () {
        require(["esri/geometry/geometryEngine"], function (geometryEngine) {
          var item = null;
          var dist = 0;
          for (var i = 0; i < $scope.layer.graphics.items.length; i++) {
            item = $scope.layer.graphics.items[i];
            dist = geometryEngine.distance($scope.mapView.center, item.geometry, 'miles');
            item.attributes.distance = dist;
          }
        });
      }
      $scope.$on('menuGroupToggled', function (e, group) {
        if (group.name === 'Bike Shops') {
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
      $scope.itemClicked = function (shop) {
        $scope.mapView.animateTo({target: shop.geometry, zoom: 16});
        $scope.mapView.popup.viewModel.features = [shop];
        $scope.mapView.popup.viewModel.visible = true;
        $scope.mapView.popup.viewModel.location = shop.geometry;
      };
      $scope.layerToggled = function (layer, visible) {
        layer.visible = visible;
      }
    }
  }
});
