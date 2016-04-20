angular.module('starter').factory('Benefits', ['$http', '$q', function($http, $q){

	var service = {getBikeBenefits:getBikeBenefits},
		url = "http://bb2.bicyclebenefits.org/search/members";
	return service;
	function getBikeBenefits () {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: url,
			params: {
				city_id: 24
			}
		}).success(deferred.resolve);
		return deferred.promise;
	}
}]);
