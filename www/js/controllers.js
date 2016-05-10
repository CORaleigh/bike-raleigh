angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, MapData, $ionicSideMenuDelegate) {
  $scope.toggleList = function (listName) {
    $scope.currentList = $scope.currentList === listName ? '' : listName;
    $rootScope.$broadcast('menuGroupToggled');
  };
})
.controller('MapCtrl', function($scope, MapData, Benefits, $timeout, $cordovaInAppBrowser) {
  require([
    "esri/views/MapView",
    "esri/WebMap",
    "esri/widgets/Compass",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/PopupTemplate",
    "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "dojo/domReady!"
  ], function(
    MapView, WebMap, Compass, Graphic, GraphicsLayer, Point, PopupTemplate, PictureMarkerSymbol, SimpleRenderer
  ) {
    var webmap = new WebMap({
      portalItem: {
        id: "994e289fb6944ec5969efb90f09d1704"
      }
    });
    var view = new MapView({
      map: webmap,
      container: "map",
      ui: ['zoom','compass'],
      popup: {
        dockEnabled: true,
        dockOptions: {
          buttonEnabled: false,
          breakpoint: false,
          position: 'bottom-center'
        }
      }, constraints: {
        maxZoom: 18,
        minZoom: 9,
        snapToZoom: true
      }
    });
    MapData.setMapView(view);
    var compass = new Compass({
      view: view
    });
    view.ui.add(compass, "top-left");
    view.then(function () {
      addBikeBenefits();
      var gl = new GraphicsLayer();
      webmap.add(gl);
      MapData.setLocationLayer(gl);
      $timeout(function() {
        view.on('layerview-create', function (event) {
          if (event.layer.title === 'Vector Tile Basemap Light') {
            if (navigator.splashscreen) {
              navigator.splashscreen.hide();
              console.log('loaded');
            }
          } else if (event.layer.title === 'Bike Shops') {
            MapData.setBikeShopsLayer(event.layerView);
            event.layerView.watch('updating', function (e) {
              event.layerView.queryFeatures().then(function (results){
                MapData.setBikeShops(results);
              });
              Map
            });
            event.layer.renderer = new SimpleRenderer({
              symbol: new PictureMarkerSymbol({
                url: 'http://coraleigh.github.io/bike-raleigh/www/img/shop-marker.svg',
                height: 24,
                width: 24
              })
            });
          } else if (event.layer.title === 'Trailheads') {
            event.layerView.watch('updating', function (e) {
              MapData.setTrailheadsLayer(event.layerView);
              event.layerView.queryFeatures().then(function (results){
                MapData.setTrailheads(results);
              });
            });
            event.layer.renderer = new SimpleRenderer({
              symbol: new PictureMarkerSymbol({
                url: 'http://coraleigh.github.io/bike-raleigh/www/img/park-marker.svg',
                height: 24,
                width: 24
              })
            });
          } else if (event.layer.title === 'Parking') {
            event.layerView.watch('updating', function (e) {
              MapData.setParkingLayer(event.layerView);
              event.layerView.queryFeatures().then(function (results){
                MapData.setParking(results);
              });
            });
            event.layer.renderer = new SimpleRenderer({
              symbol: new PictureMarkerSymbol({
                url: 'http://coraleigh.github.io/bike-raleigh/www/img/parking-marker.svg',
                height: 24,
                width: 24
              })
            });
          } else if (event.layer.title === 'Bike Racks') {
            event.layer.renderer = new SimpleRenderer({
              symbol: new PictureMarkerSymbol({
                url: 'http://coraleigh.github.io/bike-raleigh/www/img/bike-rack.svg',
                height: 24,
                width: 24
              })
            });
          } else if (event.layer.title === 'Routes') {
            MapData.setRoutes(event.layerView.layer);
          } else if (event.layer.title === 'On Road Facilities') {
            MapData.setFacilities(event.layerView.layer);
          } else if (event.layer.title === 'Greenways') {
            MapData.setGreenwaysLayer(event.layerView.layer);
          }
        });
      });
    });



    var addBikeBenefits = function () {
      //     //add Bicycle Benefits businesses to map
      var benefitTemplate = new PopupTemplate({
        title: "{name}",
        content: "{address}" +
        "<br>{discount}" +
        "<br><a id='link' href='{web}' >Website</a>"
      });
      var benefitsLyr = new GraphicsLayer({popupTemplate: benefitTemplate, minScale: 50000});
      webmap.add(benefitsLyr);
      Benefits.getBikeBenefits().then(function (data) {
        var g = null;
        for (var i = 0; i < data.members.length;i++) {
          var member = data.members[i];
          g = new Graphic({geometry: new Point({
            longitude: parseFloat(member.longitude),
            latitude: parseFloat(member.latitude)
          }),
          attributes: {name: member.name, address: member.address, web: member.web, discount: member.discount},
          symbol: new PictureMarkerSymbol({
            url: 'http://coraleigh.github.io/bike-raleigh/www/img/benefit-marker.svg',
            height: 24,
            width: 24
          })
        });
        benefitsLyr.add(g);
      }
      MapData.setBenefitsLayer(benefitsLyr);
      MapData.setMembers(benefitsLyr.graphics.items);
    });
  }
});
});
