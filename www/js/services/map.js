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
        checkInWake: function (point) {
         var polygon = null;
          require(['esri/geometry/Polygon'], function (Polygon) {
            polygon = new Polygon({
               rings: [
                [
                 [
                  -78.5683,
                  36.0294
                 ],
                 [
                  -78.4269,
                  35.9750
                 ],
                 [
                  -78.3943,
                  35.9369
                 ],
                 [
                  -78.3533,
                  35.9311
                 ],
                 [
                  -78.3506,
                  35.9097
                 ],
                 [
                  -78.3279,
                  35.8965
                 ],
                 [
                  -78.3071,
                  35.8967
                 ],
                 [
                  -78.2780,
                  35.8675
                 ],
                 [
                  -78.2536,
                  35.8275
                 ],
                 [
                  -78.2558,
                  35.8181
                 ],
                 [
                  -78.4560,
                  35.7077
                 ],
                 [
                  -78.4685,
                  35.7072
                 ],
                 [
                  -78.7089,
                  35.5195
                 ],
                 [
                  -78.9950,
                  35.6101
                 ],
                 [
                  -78.9094,
                  35.8427
                 ],
                 [
                  -78.9060,
                  35.8680
                 ],
                 [
                  -78.8299,
                  35.8669
                 ],
                 [
                  -78.8048,
                  35.9275
                 ],
                 [
                  -78.7591,
                  35.9183
                 ],
                 [
                  -78.7169,
                  35.9613
                 ],
                 [
                  -78.6992,
                  36.0114
                 ],
                 [
                  -78.7074,
                  36.0110
                 ],
                 [
                  -78.7199,
                  36.0296
                 ],
                 [
                  -78.7402,
                  36.0236
                 ],
                 [
                  -78.7536,
                  36.0313
                 ],
                 [
                  -78.7513,
                  36.0707
                 ],
                 [
                  -78.6829,
                  36.0741
                 ],
                 [
                  -78.5683,
                  36.0294
                 ]
                ]
               ]
           });
          });
          return polygon.contains(point);
        }
    };
});
