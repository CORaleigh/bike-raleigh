angular.module('starter').factory('MapData', function ($rootScope) {
    var data = {
        facilities: null,
        routes: null,
        members: [],
        mapView: null,
        bikeShops: null,
        greenways: null,
        trailheads: null,
        locator: null,
        locateVm: null,
        locationLayer: null,
        trailheadsLayer: null,
        shopsLayer: null,
        benefitsLayer: null,
        greenwaysLyr: null,
        parking: null,
        parkingLayer: null
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
        getBikeShopsLayer: function () {
            return data.bikeShopsLayer;
        },
        setBikeShopsLayer: function (bikeShopsLayer) {
            data.bikeShopsLayer = bikeShopsLayer;
        },
        getGreenwaysLayer: function () {
            return data.greenwaysLayer;
        },
        setGreenwaysLayer: function (greenwaysLayer) {
            data.greenwaysLayer = greenwaysLayer;
            $rootScope.$broadcast('greenwaysLayerUpdated');
        },
        getTrailheads: function () {
            return data.trailheads;
        },
        setTrailheads: function (trailheads) {
            data.trailheads = trailheads;
            $rootScope.$broadcast('trailheadsUpdated');
        },
        getTrailheadsLayer: function () {
            return data.trailheadsLayer;
        },
        setTrailheadsLayer: function (trailheadsLayer) {
            data.trailheadsLayer = trailheadsLayer;
        },
        getBenefitsLayer: function () {
            return data.benefitsLayer;
        },
        setBenefitsLayer: function (benefitsLayer) {
            data.benefitsLayer = benefitsLayer;
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
        },
        getParking: function () {
            return data.parking;
        },
        setParking: function (parking) {
            data.parking = parking;
            $rootScope.$broadcast('parkingUpdated');
        },
        getParkingLayer: function () {
            return data.parkingLayer;
        },
        setParkingLayer: function (parkingLayer) {
            data.parkingLayer = parkingLayer;
        },
    };
});
