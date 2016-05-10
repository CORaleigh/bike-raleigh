angular.module('starter')
.directive('parking', function () {
  return {
    templateUrl: 'templates/parking.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, MapData, $ionicSideMenuDelegate ) {
      $scope.shopsLyr = null;
      $scope.mapView = null;
      $scope.layerVisibility = true;
      $scope.$on('parkingUpdated', function (e, data) {
        $scope.lots = MapData.getParking();
        $scope.parkingLyr = MapData.getParkingLayer();
        if ($scope.lots){
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
          for (var i = 0; i < $scope.lots.length; i++) {

            item = $scope.lots[i];
            if (item){
            dist = geometryEngine.distance($scope.mapView.center, item.geometry, 'miles');
            item.attributes.distance = dist;
          }
          }});
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
        $scope.mapView.goTo({target: lot.geometry, zoom: 16});
        $scope.mapView.popup.viewModel.features = [lot];
        $scope.mapView.popup.viewModel.visible = true;
        $scope.mapView.popup.viewModel.location = lot.geometry;
      };
    }
  }
});
