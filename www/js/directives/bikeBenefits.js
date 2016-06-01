angular.module('starter')
.directive('bikeBenefits', function () {
  return {
    templateUrl: 'templates/bikeBenefits.html',
    restrict: 'E',
    controller: function ($scope, $rootScope, $timeout, MapData, $ionicSideMenuDelegate) {
      $scope.members = null;
      $scope.layer = null;
      $scope.mapView = null;
      $scope.benefitsFilter = function (member) {
        return member.attributes.distance <= 5;
      }
      $scope.$on('membersUpdated', function () {
        $scope.members = MapData.getMembers();
        $scope.benefitsLyr = MapData.getBenefitsLayer();
        $scope.benefitsPane = MapData.getMapView().getPane('benefits');
      });
      $scope.mapView = null;
      $scope.$on('mapViewCreated', function () {
        $scope.mapView = MapData.getMapView();
        setDistance();
      });
      var setDistance = function () {
          for (var i = 0; i < $scope.members.length; i++) {
            item = $scope.members[i];
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
        MapData.getMapView().flyTo([member.geometry.coordinates[1], member.geometry.coordinates[0]], 18)
        if(!$scope.$$phase) {
        }
        $timeout(function() {
          $rootScope.$broadcast('featureSelected', member, 'benefits');
        })
      };
      $scope.layerToggled = function (layer, visible) {
        layer.visible = visible;
      }
    }
  }
});
