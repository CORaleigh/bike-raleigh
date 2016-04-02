angular.module('starter')
.directive('bikeBenefits', function () {
  return {
    templateUrl: 'templates/bikeBenefits.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, MapData, $ionicSideMenuDelegate) {
      $scope.members = null;
      $scope.layer = null;
      $scope.map = null;
      $scope.layerVisibility = true;
      $scope.$on('membersUpdated', function () {
        $scope.benefitsLyr = MapData.getMembers();
        $scope.$parent.benefitsLyr = $scope.layer;
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {
        $scope.map = MapData.getMapView();
      //  setDistance();
      });
      var setDistance = function () {
        require(["esri/geometry/geometryEngine", "esri/geometry/webMercatorUtils"], function (geometryEngine, webMercatorUtils) {
          var item = null;
          var dist = 0;
          for (var i = 0; i < $scope.benefitsLyr.graphics.length; i++) {
            item = $scope.benefitsLyr.graphics[i];
            dist = geometryEngine.distance($scope.map.extent.getCenter(), webMercatorUtils.geographicToWebMercator(item.geometry), 'miles');
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
        var vm = MapData.getLocateVm();
        vm._stopTracking();
        $scope.mapView.animateTo({target: member.geometry, zoom: 16});
        $scope.mapView.popup.viewModel.features = [member];
        $scope.mapView.popup.viewModel.visible = true;
        $scope.mapView.popup.viewModel.location = member.geometry;
      };
      $scope.layerToggled = function (layer, visible) {
        //layer.visible = visible;
        layer.setVisibility(visible);
      }
      // $scope.$watch('benefitsLyr.visible', function (newValue, oldValue) {
      //   if ($scope.benefitsLyr) {
      //     $scope.benefitsLyr.setVisibility(!newValue);
      //   }
      // });
    }
  }
});
