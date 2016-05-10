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
        $scope.trailheads = MapData.getTrailheads();
        $scope.trailheadsLyr = MapData.getTrailheadsLayer();
        if ($scope.trailheads){
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
          for (var i = 0; i < $scope.trailheads.length; i++) {

            item = $scope.trailheads[i];
            if (item){
            dist = geometryEngine.distance($scope.mapView.center, item.geometry, 'miles');
            item.attributes.distance = dist;
          }
        }});
      }
      $scope.$on('menuGroupToggled', function (e, group) {
        if ($scope.currentList  === 'Trailheads') {
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
        $scope.mapView.animateTo({target: shop.geometry, zoom: 16});
        $scope.mapView.popup.viewModel.features = [shop];
        $scope.mapView.popup.viewModel.visible = true;
        $scope.mapView.popup.viewModel.location = shop.geometry;
        $rootScope.$broadcast('placeSelected');
      };
    }
  }
});
