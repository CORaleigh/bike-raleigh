angular.module('starter')
.directive('legendButton', function () {
	return {
		templateUrl: 'templates/legendButton.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData, Address, $cordovaGoogleAnalytics, $ionicModal) {
			$ionicModal.fromTemplateUrl('templates/legend.html', {
			    scope: $scope
			  }).then(function(modal) {
			    $scope.legendModal = modal;
			  });
	}
}});
