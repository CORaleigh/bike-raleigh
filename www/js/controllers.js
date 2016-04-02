angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, MapData, $ionicSideMenuDelegate) {
  $scope.toggleList = function (listName) {
    $scope.currentList = $scope.currentList === listName ? '' : listName;
    console.log($scope.currentList);
    $rootScope.$broadcast('menuGroupToggled');
  }
})
.controller('MapCtrl', function($scope, MapData, Benefits, $timeout, $cordovaInAppBrowser) {
  require([
    "esri/map",
    //"esri/views/MapView",
   "esri/layers/VectorTileLayer",
     "esri/layers/FeatureLayer",
     "esri/layers/GraphicsLayer",
     "esri/graphic",
    // "esri/symbols/SimpleMarkerSymbol",
     "esri/symbols/PictureMarkerSymbol",
    // "esri/symbols/SimpleLineSymbol",
    "esri/geometry/Point",
    // "esri/PopupTemplate",
    // "esri/widgets/Popup",
     "esri/renderers/SimpleRenderer",
   // "esri/widgets/Locate",
    // "esri/widgets/Locate/LocateViewModel",
    "esri/dijit/LocateButton",
    "dojo/on",
    "dojo/domReady!"
  ], function(Map, VectorTileLayer, FeatureLayer, GraphicsLayer, Graphic, PictureMarkerSymbol, Point, SimpleRenderer, LocateButton, on) {//, FeatureLayer, GraphicsLayer, Graphic, SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, Point, PopupTemplate, Popup, SimpleRenderer, Locate, LocateVM) {
    var map = new Map("map", {center: [-78.68, 35.82], zoom: 12, logo: false});
    $scope.showPopup = false;
    map.on('load', function () {
      MapData.setMapView(map);
    })
  //   $scope.zIndex = 10;
  //   $scope.$watch('zIndex', function (o, n) {
  //     if (o) {
  //      console.log(o);
  //     console.log(n);
  //     }

  //   });
  //   var view = new MapView({
  //     container: "map",
  //     map: map,
  //     zoom: 12,
  //     center: [-78.68, 35.82],
  //     ui: {
  //       components: ["compass"]
  //     }
  //   });
  //   view.on('click', function (e) {

  //   })
  //   view.then(function() {
  //     view.maxZoom = 19;
  //     view.popup.viewModel.docked = true;
  //     MapData.setMapView(view);
  //   });
  //   view.popup.viewModel.dockOptions = {
  //     responsiveDockEnabled: false,
  //     dockButtonEnabled: false,
  //     dockAtBreakpoint: false,
  //     dockPosition: view.popup.viewModel.dockPositions.bottom
  //   };

  //   view.popup.viewModel.closestFirst = false;
  //   view.popup.viewModel.visible = false;
  //   //add Vector Tile basemap
     var tileLyr = new VectorTileLayer("http://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json"
     );
     map.addLayer(tileLyr);

  //   //add Bike Routes
  //   var template = new PopupTemplate({
  //     title: "{TYPE}",
  //     content: "Comfort level <b>{Comfort}</b>"
  //   });
  //   var routes = new FeatureLayer({
  //     opacity: 0.8,
  //     popupTemplate: template,
  //     outFields: ['TYPE', 'Comfort'],
  //     url: "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/1"
  //   });
  var routes = new FeatureLayer(
    "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/1",
    {opacity: 0.8, outFields: ['TYPE', 'Comfort']}
  );
  map.addLayer(routes);
  routes.on('load', function () {
    MapData.setRoutes(routes);
  });
  //   routes.then(function () {
  //     MapData.setRoutes(routes);
  //   });

  //   map.add(routes);

  //   //add Bike Facilities
  //   var template = new PopupTemplate({
  //     title: "{FaclType}",
  //     content: "On <b>{Road}</b> from <b>{From_}</b> to <b>{To_}</b>" +
  //     "<br/>Installed in <b>{Yr_Install}</b>"
  //   });
  //   var facilities = new FeatureLayer({
  //     opacity: 0.8,
  //     popupTemplate: template,
  //     outFields: ['FaclType', 'From_', 'To_', 'Road', 'Yr_Install'],
  //     url: "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/2"
  //   });
  var facilities = new FeatureLayer(
    "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/2",
    {opacity: 0.8, outFields: ['FaclType', 'From_', 'To_', 'Road', 'Yr_Install']}
  );
  map.addLayer(facilities);
  facilities.on('load', function () {
    MapData.setFacilities(facilities);
  });
  facilities.on('click', function (evt) {
      $scope.popupTitle = evt.graphic.attributes.FaclType;
      $scope.showPopup = true;
      $scope.popupContent = 'On <em>' + evt.graphic.attributes.Road + '</em> from <em>' + evt.graphic.attributes.From_ + '</em> to <em>' + evt.graphic.attributes.To_ + '</em>' +
        "<br>" + ((evt.graphic.attributes.Yr_Install) ? 'Installed in ' + evt.graphic.attributes.Yr_Install : '');
      $scope.$apply();
  });
  //   facilities.then(function () {
  //     MapData.setFacilities(facilities);
  //   });
  //   map.add(facilities);

  //   //add Greenways
  //   var greenwayTemplate = new PopupTemplate({
  //     title: "{TRAIL_NAME}",
  //     content: "<br/>{LEGACYID}<br/>{MATERIAL}"
  //   });
  //   var greenways = new FeatureLayer({
  //     id: 'greenways',
  //     opacity: 0.8,
  //     popupTemplate: greenwayTemplate,
  //     outFields: ['TRAIL_NAME', 'LEGACYID', 'MATERIAL'],
  //     url: "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/3"
  //   });
  //   map.add(greenways);
  var greenways = new FeatureLayer(
    "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/3",
    {opacity: 0.8, outFields: ['TRAIL_NAME', 'LEGACYID', 'MATERIAL']}
  );
  map.addLayer(greenways);
  greenways.on('load', function () {
    MapData.setGreenways(greenways);
  });
  greenways.on('click', function (evt) {
      $scope.popupTitle = evt.graphic.attributes.TRAIL_NAME;
      $scope.showPopup = true;
      $scope.popupContent = evt.graphic.attributes.LEGACYID +
        "<br>" + ((evt.graphic.attributes.MATERIAL) ? evt.graphic.attributes.MATERIAL : '');
      $scope.$apply();
  });
  //   //add Bike Racks
  //   var bikeRacks = new FeatureLayer({
  //     url: "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/0"
  //   });
  //   map.add(bikeRacks);
  var bikeRacks = new FeatureLayer(
    "http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/0",
    {}
  );
  map.addLayer(bikeRacks);
  //   //add Bicycle shops to map
  //   var template = new PopupTemplate({
  //     title: "{LABEL}",
  //     content: "{ADDRESS}" +
  //     "<br><a href='{URL}' target='_blank'>Website</a>"
  //   });
  //   var bikeShops = new FeatureLayer({
  //     id: 'bikeShops',
  //     url: "http://mapstest.raleighnc.gov/arcgis/rest/services/Transportation/BikeRaleigh/MapServer/0",
  //     outFields: ['LABEL', 'ADDRESS', 'URL'],
  //     popupTemplate: template,
  //     renderer: new SimpleRenderer({
  //       symbol: new PictureMarkerSymbol({
  //           url: 'http://coraleigh.github.io/bike-raleigh/www/img/shop-marker.svg',
  //           height: 36,
  //           width: 36
  //         })
  //     })
  //   });
  //   map.add(bikeShops);
  var bikeShops = new FeatureLayer(
    "http://mapstest.raleighnc.gov/arcgis/rest/services/Transportation/BikeRaleigh/MapServer/0",
    {outFields: ['LABEL', 'ADDRESS', 'URL'], mode: FeatureLayer.MODE_SNAPSHOT}
  );
  bikeShops.setRenderer(new SimpleRenderer({
    symbol: new PictureMarkerSymbol({
        url: 'http://coraleigh.github.io/bike-raleigh/www/img/shop-marker.svg',
        height: 24,
        width: 24
      })
  }));
  map.addLayer(bikeShops);
  bikeShops.on('click', function (evt) {
      $scope.popupTitle = evt.graphic.attributes.LABEL;
      $scope.showPopup = true;
      $scope.popupContent = evt.graphic.attributes.ADDRESS +
          "<br><a href='" + evt.graphic.attributes.URL + "'>Website</a>"
      //$scope.$apply();
  });
  bikeShops.on('load', function () {
    MapData.setBikeShops(bikeShops);
  });
  //   //add Bike Racks
  //   var template = new PopupTemplate({
  //     title: "{TYPE}",
  //     content: "{ADDRESS}" +
  //     "<br/>{DIRECTIO}" +
  //     "<br/>{BETWEEN_}"
  //   });
  //   var parking = new FeatureLayer({
  //     url: "http://mapstest.raleighnc.gov/arcgis/rest/services/Transportation/BikeRaleigh/MapServer/1",
  //     outFields: ['TYPE', 'ADDRESS', 'STATUS', 'DIRECTIO', 'BETWEEN'],
  //     popupTemplate: template,
  //     renderer: new SimpleRenderer({
  //       symbol: new PictureMarkerSymbol({
  //           url: 'http://coraleigh.github.io/bike-raleigh/www/img/parking-marker.svg',
  //           height: 36,
  //           width: 36
  //         })
  //     })
  //   });
  //   map.add(parking);
  var parking = new FeatureLayer(
    "http://mapstest.raleighnc.gov/arcgis/rest/services/Transportation/BikeRaleigh/MapServer/1",
    {outFields: ['TYPE', 'ADDRESS', 'STATUS', 'DIRECTIO', 'BETWEEN_']}
  );
  parking.on('click', function (evt) {
      $scope.popupTitle = evt.graphic.attributes.TYPE;
      $scope.showPopup = true;
      $scope.popupContent = evt.graphic.attributes.ADDRESS +
        "<br>" + evt.graphic.attributes.DIRECTIO +
        "<br>" + ((evt.graphic.attributes.BETWEEEN_) ? evt.graphic.attributes.BETWEEEN_ : '');
      //$scope.$apply();
  });
  parking.setRenderer(new SimpleRenderer({
    symbol: new PictureMarkerSymbol({
        url: 'http://coraleigh.github.io/bike-raleigh/www/img/parking-marker.svg',
        height: 24,
        width: 24
      })
  }));
  map.addLayer(parking);
  //   function openUrl () {
  //     console.log('URL');
  //   }

  //   //add Bicycle Benefits businesses to map
  //   var benefitTemplate = new PopupTemplate({
  //     title: "{name}",
  //     content: "{address}" +
  //     "<br>{discount}" +
  //     "<br><a id='link' href='{web}' >Website</a>"
  //   });
     var benefitsLyr = new GraphicsLayer();
    map.addLayer(benefitsLyr);
    benefitsLyr.on('click', function (evt) {
        $scope.popupTitle = evt.graphic.attributes.name;
        $scope.showPopup = true;
        $scope.popupContent = evt.graphic.attributes.address +
          "<br>" + evt.graphic.attributes.discount +
          "<br><a href='" + evt.graphic.attributes.web + "'>Website</a>"
        //$scope.$apply();
    });

    Benefits.getBikeBenefits().then(function (data) {
      var g = null;
      for (var i = 0; i < data.members.length;i++) {
        var member = data.members[i];
        g = new Graphic(new Point({
          longitude: parseFloat(member.longitude),
          latitude: parseFloat(member.latitude)
        }),

        new PictureMarkerSymbol({
            url: 'http://coraleigh.github.io/bike-raleigh/www/img/benefit-marker.svg',
            height: 24,
            width: 24
          }),        {name: member.name, address: member.address, web: member.web, discount: member.discount}
      );
      benefitsLyr.add(g);
    }
    MapData.setMembers(benefitsLyr);
  });

  // var gl = new GraphicsLayer();
  // map.add(gl);

  // view.on("layer-view-create", function(evt) {
  //   if (evt.layer.id === "bikeShops") {
  //       MapData.setBikeShops(evt.layerView);
  //   } else if (evt.layer.id === "greenways") {
  //     MapData.setGreenways(evt.layerView);
  //   }
  // });
  // var locateVm = new LocateVM({
  //   view: view,
  //   graphicsLayer: gl,
  //   trackingEnabled: true,
  //   scale: 2400,
  //   updateScaleEnabled: true,
  //   clearOnTrackingStopEnabled: true
  // });

  var geoLocate = new LocateButton({
    map: map,
    highlightLocation: true,
    useTracking: true,
    centerAt: true
  }, "locateDiv"
  );
  geoLocate.startup();
  $scope.closePopup = function () {
    $scope.showPopup = false;
  };
});
});
