angular.module('starter')
.directive('bikeShops', function () {
  return {
    templateUrl: 'templates/bikeShops.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, MapData, $ionicSideMenuDelegate ) {
      $scope.shopsLyr = null;
      $scope.mapView = null;
      $scope.layerVisibility = true;
      $scope.shopsFilter = function (shop) {
        return shop.attributes.distance <= 5;
      }
      $scope.$on('bikeShopsUpdated', function (e, data) {
        $scope.shops = MapData.getBikeShops();
        $scope.shopsLyr = MapData.getBikeShopsLayer();
        if ($scope.shops){
          setDistance();
        }
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });
      var setDistance = function () {
        require(["esri/geometry/geometryEngine"], function (geometryEngine) {
          var item = null;
          var dist = 0;
          for (var i = 0; i < $scope.shops.length; i++) {
            item = $scope.shops[i];
            if (item){
            dist = geometryEngine.distance($scope.mapView.center, item.geometry, 'miles');
            item.attributes.distance = dist;
          }
          }
        });
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
        $scope.mapView.goTo({target: shop.geometry, zoom: 16});
        $scope.mapView.popup.viewModel.features = [shop];
        $scope.mapView.popup.viewModel.visible = true;
        $scope.mapView.popup.viewModel.location = shop.geometry;
      };
    }
  }
});
