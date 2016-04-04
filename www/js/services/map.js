angular.module('starter').factory('MapData', function ($rootScope) {
    var data = {
        facilities: null,
        routes: null,
        members: [],
        mapView: null,
        bikeShops: null,
        greenways: null,
        locator: null,
        locateVm: null,
        locationLayer: null
    };
    return {
        getMapView: function () {
          return data.mapView;
        },
        setMapView: function (mapView) {
          data.mapView = mapView;
          $rootScope.$broadcast('mapViewCreated');
        },
        getFacilities: function () {
            return data.facilities;
        },
        setFacilities: function (facilities) {
            data.facilities = facilities;
            $rootScope.$broadcast('facilitiesUpdated', facilities);
        },
        getRoutes: function () {
            return data.routes;
        },
        setRoutes: function (routes) {
            data.routes = routes;
            $rootScope.$broadcast('routesUpdated', routes);
        },
        getMembers: function () {
            return data.members;
        },
        setMembers: function (members) {
            data.members = members;
            $rootScope.$broadcast('membersUpdated');
        },
        getBikeShops: function () {
            return data.bikeShops;
        },
        setBikeShops: function (bikeShops) {
            data.bikeShops = bikeShops;
            $rootScope.$broadcast('bikeShopsUpdated');
        },
        getGreenways: function () {
            return data.greenways;
        },
        setGreenways: function (greenways) {
            data.greenways = greenways;
            $rootScope.$broadcast('greenwaysUpdated');
        },
        getLocate: function () {
          return data.locate;
        },
        setLocate: function (locate) {
          data.locate = locate;
        },
        getLocateVm: function () {
          return data.locateVm;
        },
        setLocateVm: function (locateVm) {
          data.locateVm = locateVm;
        },
        getLocationLayer: function () {
          return data.locationLayer;
        },
        setLocationLayer: function (locationLayer) {
          data.locationLayer = locationLayer;
          $rootScope.$broadcast('locationLayerCreated');
        }
    };
});
