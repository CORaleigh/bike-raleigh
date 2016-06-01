angular.module('starter')
.directive('popup', function () {
	return {
		templateUrl: 'templates/popup.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData) {
      $scope.showPopup = false;
      $scope.$on('featureSelected', function (e, feature, pane) {
				$scope.format = setPopup(pane, feature);
        $scope.selectedFeature = feature;
        $scope.showPopup = true;
        $scope.$apply();
      });
			var setPopup = function (id, feature) {
		    var format = null;
		    switch (id) {
		      case 'benefits':
		        format = {title: feature.properties.name, fields: [{name: 'Address',value: feature.properties.address}, {name: 'Discount', value: feature.properties.discount}, {name: 'Website', value: feature.properties.web}]}
		      break;
		      case 'bikeracks':
		        format = {title: 'Bike Rack', fields: [{name: 'Rack Type',value: feature.properties.Rack_Type}, {name: 'Capacity', value: feature.properties.Capacity.toString()}]}
		      break;
		      case 'shops':
		        format = {title: feature.properties.LABEL, fields: [{name: 'Address',value: feature.properties.ADDRESS}, {name: 'Website', value: feature.properties.URL}]}
		      break;
		      case 'parking':
		        format = {title: 'Parking', fields: [{name: 'Type',value: feature.properties.TYPE}, {name: 'Description', value: feature.properties.BETWEEN_}]}
		      break;
		      case 'trailheads':
		        format = {title: 'Greenway Access Point', fields: [{name: 'Trail Name',value: feature.properties.TRAILNAME}, {name: 'Address', value: feature.properties.ACCESS_}]}
		      break;
		      case 'routes':
		        format = {title: 'Bike Route', fields: [{name: 'Comfort Level',value: (feature.properties.Comfort != ' ') ? feature.properties.Comfort : 'Preferred Route'}]}
		      break;
		      case 'facilities':
		        format = {title: 'Bike Facilities', fields: [{name: 'Type',value: feature.properties.FaclType}, {name: 'Road',value: feature.properties.Road_}, {name: 'Between',value: feature.properties.From_ + ' and ' + feature.properties.To_}, {name: 'Installed', value: feature.properties.Yr_Install.toString()}]}
		      break;
		      case 'greenways':
		        format = {title: (feature.properties.BikeMapCla != ' ') ? feature.properties.BikeMapCla : 'Paved Greenway Trail', fields: [{name: 'Trail Name',value: feature.properties.TRAIL_NAME}, {name: 'Type',value: feature.properties.FaclType}, {name: 'Material',value: feature.properties.MATERIAL}]}
		      break;
		    }
		    return format;
		  }
		}
	}
});
