angular.module('starter')
.directive('bikeBenefits', function () {
  return {
    templateUrl: 'templates/bikeBenefits.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, MapData) {
      $scope.members = null;
      $scope.layer = null;
      $scope.mapView = null;
      $scope.layerVisibility = true;
      $scope.$on('membersUpdated', function () {
        $scope.layer = MapData.getMembers();
        $scope.members = MapData.getMembers().graphics.items;
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
      });
      $scope.itemClicked = function (member) {
        $scope.mapView.animateTo({target: member.geometry, zoom: 16});
        $scope.mapView.popup.viewModel.features = [member];
        $scope.mapView.popup.viewModel.visible = true;
        $scope.mapView.popup.viewModel.location = member.geometry;
      };
      $scope.layerToggled = function (layer, visible) {
        layer.visible = visible;
      }
    }
  }
});
