angular.module('starter')
.directive('bikeBenefits', function () {
  return {
    templateUrl: 'templates/bikeBenefits.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, MapData, $ionicSideMenuDelegate) {
      $scope.members = null;
      $scope.layer = null;
      $scope.mapView = null;
      $scope.layerVisibility = true;
      $scope.$on('membersUpdated', function () {
        $scope.benefitsLyr = MapData.getMembers();
        $scope.$parent.benefitsLyr = $scope.layer;
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
        setDistance();
      });
      var setDistance = function () {
        require(["esri/geometry/geometryEngine", "esri/geometry/support/webMercatorUtils"], function (geometryEngine, webMercatorUtils) {
          var item = null;
          var dist = 0;
          for (var i = 0; i < $scope.benefitsLyr.graphics._items.length; i++) {
            item = $scope.benefitsLyr.graphics.items[i];
            dist = geometryEngine.distance($scope.mapView.center, webMercatorUtils.geographicToWebMercator(item.geometry), 'miles');
            item.attributes.distance = dist;
          }
        });
      }
      $scope.$on('menuGroupToggled', function (e, group) {
        if ($scope.currentList === 'Bike Benefits') {
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
      $scope.memberClicked = function (member) {
        //var vm = MapData.getLocateVm();
        //vm._stopTracking();
        $scope.mapView.animateTo({target: member.geometry, zoom: 16});
        $scope.mapView.popup.viewModel.features = [member];
        $scope.mapView.popup.viewModel.visible = true;
        $scope.mapView.popup.viewModel.location = member.geometry;
        $rootScope.$broadcast('placeSelected');
      };
      $scope.layerToggled = function (layer, visible) {
        layer.visible = visible;
      }
    }
  }
});
