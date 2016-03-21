angular.module('starter')
.directive('navigationSet', function () {
	return {
		templateUrl: 'templates/navigationSet.html',
		restrict: 'E',
		controller: function ($scope, $rootScope, MapData, Address) {
      $scope.enteredText = '';
      $scope.suggestionSelected = function (suggestion) {
          console.log(suggestion.geometry);
          $scope.toggleNavGroup({name: 'Set To Location'});
      }
      $scope.locationInputChanged = function () {
        if ($scope.enteredText.length > 3) {
          Address.getSuggestions($scope.enteredText).then(function (data) {
              $scope.suggestions = data.features;
            }
          );
        }
      }
		}
	}
});
