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
      $scope.benefitsFilter = function (member) {
        return member.attributes.distance <= 5;
      }
      $scope.$on('membersUpdated', function () {
        $scope.members = MapData.getMembers();
        $scope.benefitsLyr = MapData.getBenefitsLayer();

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
          if ($scope.members) {
            for (var i = 0; i < $scope.members.length; i++) {
              item = $scope.members[i];
              dist = geometryEngine.distance($scope.mapView.center, webMercatorUtils.geographicToWebMercator(item.geometry), 'miles');
              item.attributes.distance = dist;
            }
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
        $scope.mapView.goTo({target: member.geometry, zoom: 16});
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
