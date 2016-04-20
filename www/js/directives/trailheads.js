angular.module('starter')
.directive('trailheads', function () {
  return {
    templateUrl: 'templates/trailheads.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, MapData, $ionicSideMenuDelegate ) {
      $scope.trailheadsLyr = null;
      $scope.mapView = null;
      $scope.layerVisibility = true;
      $scope.$on('trailheadsUpdated', function (e, data) {
        $scope.trailheadsLyr = MapData.getTrailheads();
        $scope.$parent.trailheadsLyr = MapData.getTrailheads();
        if ($scope.trailheadsLyr.graphics){
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
          for (var i = 0; i < $scope.trailheadsLyr.graphics._items.length; i++) {

            item = $scope.trailheadsLyr.graphics._items[i];
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
      $scope.trailheadClicked = function (shop) {
        //var vm = MapData.getLocateVm();
        //vm._stopTracking();
        $scope.mapView.animateTo({target: shop.geometry, zoom: 16});
        $scope.mapView.popup.viewModel.features = [shop];
        $scope.mapView.popup.viewModel.visible = true;
        $scope.mapView.popup.viewModel.location = shop.geometry;
        $rootScope.$broadcast('placeSelected');        
      };
      $scope.layerToggled = function (layer, visible) {
        layer.visible = visible;
      }
    }
  }
});
