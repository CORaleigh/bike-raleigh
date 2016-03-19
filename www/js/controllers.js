angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, MapData, $ionicSideMenuDelegate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  //define group headers
  $scope.group = null;
  $scope.sideLoaded = false;
  $scope.groups = [{
    name: "Bike Benefits",
    layer: null
  }, {
    name: "Bike Shops",
    layer: null
  }, {
    name: "Greenways",
    layer: null
  }, {
    name: "Facilities"
  }, {
    name: "Routes"
  }];
  //handle group toggle
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
    $rootScope.$broadcast('menuGroupToggled', group);
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.$on('membersUpdated', function (e, data) {
    $scope.groups[0].layer = MapData.getMembers();
  });
  $scope.$on('bikeShopsUpdated', function (e, data) {
    $scope.groups[1].layer = MapData.getBikeShops();
  });
  $scope.$watch(function () {
    return $ionicSideMenuDelegate.getOpenRatio();
  },
  function (ratio) {
    if (ratio == 1){
      $timeout(function () {
      $scope.sideLoaded = true;
    }, 500);
    }
  });
})

.controller('MapCtrl', function($scope, MapData, Benefits, $timeout) {
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/VectorTileLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/geometry/Point",
    "esri/PopupTemplate",
    "esri/widgets/Popup",
    "esri/renderers/SimpleRenderer",
    "esri/widgets/Locate",
    "esri/widgets/Locate/LocateViewModel",
    "dojo/domReady!"
  ], function(Map, MapView, VectorTileLayer, FeatureLayer, GraphicsLayer, Graphic, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, Point, PopupTemplate, Popup, SimpleRenderer, Locate, LocateVM) {

    var map = new Map();

    var view = new MapView({
      container: "map",
      map: map,
      zoom: 12,
      center: [-78.68, 35.82],
      ui: {
        components: ["compass"]
      }
    });
    view.then(function() {
      view.maxZoom = 19;
      view.popup.viewModel.docked = true;
      MapData.setMapView(view);
      //  navigator.geolocation.getCurrentPosition(function(position) {
      //    var pt = new Point({
      //     x: position.coords.longitude,
      //     y: position.coords.latitude,
      //     spatialReference: 4326
      //   });
      //   view.center = pt;
      //   view.zoom = 16;
      //  });
    });
    view.popup.viewModel.dockOptions = {
      responsiveDockEnabled: false,
      dockButtonEnabled: false,
      dockAtBreakpoint: false,
      dockPosition: view.popup.viewModel.dockPositions.bottom
    };

    view.popup.viewModel.closestFirst = false;
    view.popup.viewModel.visible = false;
    //add Vector Tile basemap
    var tileLyr = new VectorTileLayer({
      url: "http://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json"
    });
    map.add(tileLyr);

    //add Bike Routes
    var template = new PopupTemplate({
      title: "{TYPE}",
      content: "Comfort level <b>{Comfort}</b>"
    });
    var routes = new FeatureLayer({
      opacity: 0.8,
      popupTemplate: template,
      outFields: ['TYPE', 'Comfort'],
      url: "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/1"
    });

    routes.then(function () {
      MapData.setRoutes(routes);
    });

    map.add(routes);

    //add Bike Facilities
    var template = new PopupTemplate({
      title: "{FaclType}",
      content: "On <b>{Road}</b> from <b>{From_}</b> to <b>{To_}</b>" +
      "<br/>Installed in <b>{Yr_Install}</b>"
    });
    var facilities = new FeatureLayer({
      opacity: 0.8,
      popupTemplate: template,
      outFields: ['FaclType', 'From_', 'To_', 'Road', 'Yr_Install'],
      url: "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/2"
    });
    facilities.then(function () {
      MapData.setFacilities(facilities);
    });
    map.add(facilities);

    //add Greenways
    var greenwayTemplate = new PopupTemplate({
      title: "{TRAIL_NAME}",
      content: "<br/>{LEGACYID}<br/>{MATERIAL}"
    });
    var greenways = new FeatureLayer({
      id: 'greenways',
      opacity: 0.8,
      popupTemplate: greenwayTemplate,
      outFields: ['TRAIL_NAME', 'LEGACYID', 'MATERIAL'],
      url: "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/3"
    });
    map.add(greenways);

    //add Bike Racks
    var bikeRacks = new FeatureLayer({
      url: "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/0"
    });
    map.add(bikeRacks);

    //add Bicycle shops to map
    var template = new PopupTemplate({
      title: "{LABEL}",
      content: "{ADDRESS}" +
      "<br><a href='{URL}' target='_blank'>Website</a>"
    });
    var bikeShops = new FeatureLayer({
      id: 'bikeShops',
      url: "http://mapstest.raleighnc.gov/arcgis/rest/services/Transportation/BikeRaleigh/MapServer/0",
      outFields: ['LABEL', 'ADDRESS', 'URL'],
      popupTemplate: template,
      renderer: new SimpleRenderer({
        symbol: new PictureMarkerSymbol({
            url: 'http://coraleigh.github.io/bike-raleigh/www/img/shop-marker.svg',
            height: 36,
            width: 36
          })
      })
    });
    map.add(bikeShops);
    // bikeShops.on("layer-view-create", function(evt){
    //   MapData.setBikeShops(evt.layerView);
    // });


    //add Bike Racks
    var template = new PopupTemplate({
      title: "{TYPE}",
      content: "{ADDRESS}" +
      "<br/>{DIRECTIO}" +
      "<br/>{BETWEEN_}"
    });
    var parking = new FeatureLayer({
      url: "http://mapstest.raleighnc.gov/arcgis/rest/services/Transportation/BikeRaleigh/MapServer/1",
      outFields: ['TYPE', 'ADDRESS', 'STATUS', 'DIRECTIO', 'BETWEEN'],
      popupTemplate: template,
      renderer: new SimpleRenderer({
        symbol: new PictureMarkerSymbol({
            url: 'http://coraleigh.github.io/bike-raleigh/www/img/parking-marker.svg',
            height: 36,
            width: 36
          })
      })
    });
    map.add(parking);

    //add Bicycle Benefits businesses to map
    var benefitTemplate = new PopupTemplate({
      title: "{name}",
      content: "{address}" +
      "<br>{discount}" +
      "<br><a href='{web}' target='_blank'>Website</a>"
    });
    var benefitsLyr = new GraphicsLayer({popupTemplate: benefitTemplate});
    map.add(benefitsLyr);
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
            height: 36,
            width: 36
          })
      });
      benefitsLyr.add(g);
    }
    MapData.setMembers(benefitsLyr);
  });

  var gl = new GraphicsLayer();
  map.add(gl);

  view.on("layer-view-create", function(evt) {
    if (evt.layer.id === "bikeShops") {
      //Explore the properties of the population layer's layer view here
        MapData.setBikeShops(evt.layerView);
    } else if (evt.layer.id === "greenways") {
      MapData.setGreenways(evt.layerView);
    }
  });


  var locateVm = new LocateVM({
    view: view,
    graphicsLayer: gl,
    trackingEnabled: true,
    scale: 2400,
    updateScaleEnabled: false,
    clearOnTrackingStopEnabled: true
  });
  var locateBtn = new Locate({
    viewModel: locateVm
  }, "locateDiv");
  locateBtn.startup();

});
})
;
