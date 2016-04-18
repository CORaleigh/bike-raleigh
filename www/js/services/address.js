angular.module('starter').factory('Address', ['$http', '$q', function($http, $q){

	var service = {getSuggestions:getSuggestions},
		url = "https://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query";
	return service;
	function getSuggestions (input) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: url,
			params: {
				where: "ADDRESSU LIKE '" + input.toUpperCase() + "%'",
        returnGeometry: true,
        outFields: 'ADDRESS',
        orderByFields: 'ADDRESS',
        outSR: 4326, 
        f: 'json'
			}
		}).success(deferred.resolve);
		return deferred.promise;
	}
}]);
