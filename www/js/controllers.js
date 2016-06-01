angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, MapData, $ionicSideMenuDelegate, $ionicPopup, $ionicLoading) {
  //$ionicLoading.show();
  $scope.disclaimerAccepted = function () {
    localStorage.setItem("accepted", "true");
    $scope.modal.hide()
  }
  document.addEventListener("deviceready", onDeviceReady, false);
  document.addEventListener("resume", onDeviceReady, false);
  function onDeviceReady () {
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicModal.fromTemplateUrl('templates/connection.html', {
            scope: $scope
          }).then(function(modal) {
            $scope.connectionModal = modal;
            $scope.connectionModal.show();
          });
      }
      $scope.retestConnection();
    }
  }

  $scope.retestConnection = function () {
    if(window.Connection) {
      if(navigator.connection.type != Connection.NONE) {
        $scope.connectionModal.hide();
        if ($rootScope.basemap) {
          for (var i = 0; i < $rootScope.basemaps.length; i++) {
            $rootScope.basemaps[i].redraw();
          }
        }
      }
    }
  }

  if (!localStorage.getItem("accepted")) {
    $ionicModal.fromTemplateUrl('templates/disclaimer.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
  }

  $scope.toggleList = function (listName) {
    $scope.currentList = $scope.currentList === listName ? '' : listName;
    $rootScope.$broadcast('menuGroupToggled');
  };
  $scope.openInBrowser = function (evt) {
    evt.preventDefault();
    if (evt.target) {
      window.open(evt.target.href, '_system', 'location=yes'); return false;
    }
  };
  $scope.openMail = function (evt) {
    evt.preventDefault();
    window.open('mailto:gis@raleighnc.gov?subject=BikeRaleigh App Feedback', '_system', 'location=yes'); return false;
  };
  $ionicModal.fromTemplateUrl('templates/about.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.aboutModal = modal;
    });
})
.controller('MapCtrl', function ($scope, $rootScope, $timeout, MapData, Benefits) {
  var map = L.map('map', {maxZoom: 18}).setView([35.777, -78.666], 13);
  MapData.setMapView(map);
  var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
  });
  $rootScope.basemaps = [];
  $rootScope.basemaps.push = layer;
  map.addLayer(layer);
  map.createPane('greenways');
  map.createPane('facilities');
  map.createPane('routes');
  map.createPane('labels');
  map.createPane('shops');
  map.createPane('benefits');
  map.createPane('parking');
  map.createPane('bikeracks');
  map.createPane('location');
  $rootScope.bikeracksPane = map.getPane('bikeracks');
  $rootScope.facilitiesPane = map.getPane('facilities');
  $rootScope.routesPane = map.getPane('routes');
  $rootScope.greenwaysPane = map.getPane('greenways');


  map.createPane('trailheads');


  var handleEachFeature = function (feature, layer) {
    layer.on({click: function (e) {
      $scope.$broadcast('featureSelected', feature, layer.options.pane);
    }})
  }

  L.esri.featureLayer({
    url: 'http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/0',
    minZoom: 17,
    fields: ['Rack_Type', 'Capacity', 'OBJECTID_1'],
    onEachFeature: handleEachFeature,
    pointToLayer: function (geojson, latlng) {
      return L.marker(latlng, {
        icon: L.icon({iconUrl:'http://coraleigh.github.io/bike-raleigh/www/img/bike-rack.svg',
            iconSize: [36, 36],
            iconAnchor: [18, 18]}),
        pane: 'bikeracks'
      });
    },
    pane: 'bikeracks'
  }).addTo(map);
  var shopsLayer = L.esri.featureLayer({
    url: 'http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Bike_Shops/FeatureServer/0',
    fields: ['LABEL', 'ADDRESS', 'URL', 'FID'],
    onEachFeature: handleEachFeature,
    pointToLayer: function (geojson, latlng) {
      return L.marker(latlng, {
        icon: L.icon({iconUrl:'http://coraleigh.github.io/bike-raleigh/www/img/shop-marker.svg',
            iconSize: [36, 36],
            iconAnchor: [18, 18]}),
        pane: 'shops'
      })
    },
    pane: 'shops'
  }).addTo(map);

  shopsLayer.query()
  .where("1 = 1")
  .run(function(error, featureCollection){
    MapData.setBikeShops(featureCollection.features);
  });
  MapData.setBikeShopsLayer(shopsLayer);
  var parkingLayer = L.esri.featureLayer({
    url: 'http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Bike_Parking/FeatureServer/0',
    fields: ['TYPE', 'ADDRESS', 'BETWEEN_', 'FID'],
    onEachFeature: handleEachFeature,
    pointToLayer: function (geojson, latlng) {
      return L.marker(latlng, {
        icon: L.icon({iconUrl:'http://coraleigh.github.io/bike-raleigh/www/img/parking-marker.svg',
            iconSize: [36, 36],
            iconAnchor: [18, 18]}),
        pane: 'parking'
      });
    },
    pane: 'parking'
  }).addTo(map);
  parkingLayer.query()
  .where("1 = 1")
  .run(function(error, featureCollection){
    MapData.setParking(featureCollection.features);
  });
  var trailheadLayer = L.esri.featureLayer({
    url: 'http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Greenway_Trail_Access/FeatureServer/0',
    fields: ['TRAILNAME', 'ACCESS_', 'OBJECTID'],
    minZoom: 15,
    onEachFeature: handleEachFeature,
    pointToLayer: function (geojson, latlng) {
      return L.marker(latlng, {
        icon: L.icon({iconUrl:'http://coraleigh.github.io/bike-raleigh/www/img/trailhead-marker.svg',
            iconSize: [20, 20],
            iconAnchor: [10, 10]}),
        pane: 'trailheads'
      });
    },
    pane: 'trailheads'
  }).addTo(map);
  trailheadLayer.query()
  .where("1 = 1")
  .run(function(error, featureCollection){
    MapData.setTrailheads(featureCollection.features);
  });
  var routesLayer = L.esri.featureLayer({
    url: 'http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/1',
    fields: ['TYPE', 'COMFORT', 'OBJECTID'],
    onEachFeature: handleEachFeature,
    style: function (feature) {
      switch (feature.properties.Comfort) {
        case 'Difficult Connection':
          c = '#E59152';
        break;
        default:
          c = '#1D92CE';
        break;
      }
      return {color: c, opacity: 1, weight: 7};
    },
    pane: 'routes'
  }).on('load', function () {
      MapData.setRoutes(routesLayer);
  }).addTo(map);
  var facilitiesLayer = L.esri.featureLayer({
    url: 'http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/2',
    fields: ['FaclType', 'Road', 'From_', 'To_', 'Yr_Install', 'OBJECTID_1'],
    onEachFeature: handleEachFeature,
    style: function (feature) {
      switch (feature.properties.FaclType) {
        case 'Bike Lanes':
          c = '#E25CA0';
        break;
        case 'Bike Lanes /Sharrows':
          c = '#8A75B2';
        break;
        case 'Buffered Bike Lanes':
          c = '#E25CA0';
        break;
        case 'Sharrows':
          c = '#8A75B2';
        break;
      }
      return {color: c, opacity: 1, weight: 7};
    }, pane: 'facilities'
  }).on('load', function () {
      MapData.setFacilities(facilitiesLayer);
  }).addTo(map);

  var greenwaysLayer = L.esri.featureLayer({
    url: 'http://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/BikeRaleigh/FeatureServer/3',
    fields: ['TRAIL_NAME', 'TYPE', 'ACCESS_STR', 'MATERIAL', 'BikeMapCla','OBJECTID'],
    onEachFeature: handleEachFeature,
    style: function (feature) {
      switch (feature.properties.BikeMapCla) {
        case 'Sidepath':
          c = '#EBD435';
        break;
        case 'Natural':
          c = '#AB9368';
        break;
        default:
          c = '#8BC249';
        break;
      }
      return {color: c, opacity: 1, weight: 7};
    },
    pane: 'greenways'
  }).on('load', function () {
      MapData.setGreenwaysLayer(greenwaysLayer);
  }).addTo(map);

  layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
  });
  $rootScope.basemaps.push = layer;

  L.Util.setOptions(layer, {pane: 'labels'});
  map.addLayer(layer);
    var addBikeBenefits = function () {
      var geojson = {"type": "FeatureCollection", "features": []}
      Benefits.getBikeBenefits().then(function (data) {
        for (var i = 0; i < data.members.length;i++) {
          var feature = {"type": "Feature"};
          var member = data.members[i];
          feature.geometry = {"type": "Point", "coordinates": [parseFloat(member.longitude), parseFloat(member.latitude)]};
          feature.properties = {name: member.name, address: member.address, web: member.web, discount: member.discount};
          geojson.features.push(feature);
        }

        var benefitsLyr = L.geoJson(geojson,{
            onEachFeature: handleEachFeature,
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng, {
                icon: L.icon({iconUrl:'http://coraleigh.github.io/bike-raleigh/www/img/benefit-marker.svg',
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]}),
                pane: 'benefits'
              });
            }
        }).addTo(map);
        MapData.setMembers(geojson.features);

      });
      var locationLayer = L.geoJson({"type": "FeatureCollection", "features": []}
      ).addTo(map);
      $timeout(function () {
        MapData.setLocationLayer(locationLayer);
      }, 1000);
  }
  addBikeBenefits();
});
// .controller('MapCtrl', function($scope, MapData, Benefits, $timeout, $cordovaInAppBrowser, $rootScope, $ionicLoading) {
//   require([
//     "esri/views/MapView",
//     "esri/WebMap",
//     "esri/widgets/Compass",
//     "esri/Graphic",
//     "esri/layers/GraphicsLayer",
//     "esri/geometry/Point",
//     "esri/PopupTemplate",
//     "esri/symbols/PictureMarkerSymbol",
//     "esri/renderers/SimpleRenderer",
//     "dojo/domReady!"
//   ], function(
//     MapView, WebMap, Compass, Graphic, GraphicsLayer, Point, PopupTemplate, PictureMarkerSymbol, SimpleRenderer
//   ) {
//
//     var id = "994e289fb6944ec5969efb90f09d1704";
//     //var device = WURFL.complete_device_name.toLowerCase();
//     //console.log(device.cordova);
//     // if (device.indexOf("iphone") > 0 || device.indexOf("ipad") > 0 ) {
//     //   if (device.indexOf("4") > 0 || device.indexOf("3") > 0 || device.indexOf("2") > 0) {
//     //       id = "d7dcefd59b01462b971c3f782a07c287"
//     //   }
//     // }
//     document.addEventListener("deviceready", onDeviceReady, false);
//     function onDeviceReady() {
//       if (device) {
//         device.model = device.model.toLowerCase();
//         device.model = device.model.split(',')[0];
//         if (device.model.indexOf("iphone") > -1 || device.model.indexOf("ipad") > -1) {
//           if (device.model.indexOf("2") > -1 || device.model.indexOf("3") > -1 || device.model.indexOf("4") > -1) {
//             id = "d7dcefd59b01462b971c3f782a07c287"
//           }
//         }
//         buildMap(id);
//       }
//     }
//
//
//     var buildMap = function (id) {
//       var webmap = new WebMap({
//         portalItem: {
//           id: id
//         }
//       });
//       var view = new MapView({
//         map: webmap,
//         container: "map",
//         ui: ['zoom'],
//         popup: {
//           dockEnabled: true,
//           dockOptions: {
//             buttonEnabled: false,
//             breakpoint: false,
//             position: 'bottom-center'
//           }
//         }, constraints: {
//           maxZoom: 18,
//           minZoom: 9,
//           snapToZoom: false,
//           rotationEnabled: false
//         }
//       });
//       view.popup.watch("selectedFeature", function (e) {
//         $timeout(function () {
//           var elm = document.querySelector('.esri-popup .esri-popup-main a');
//           if (elm) {
//             elm.addEventListener('click', function(e) {
//               e.preventDefault();
//               var href = e.currentTarget.href;
//               var arr = href.split(/http/g);
//               href = 'http' + arr[arr.length-1];
//               window.open(decodeURIComponent(href), '_system', 'location=yes'); return false;
//             });
//           }
//         });
//
//
//       });
//       MapData.setMapView(view);
//       // var compass = new Compass({
//       //   view: view
//       // });
//       // view.ui.add(compass, "top-left");
//
//       view.on('click', function (evt) {
//         view.hitTest(evt.screenPoint).then(function (response) {
//           var results = [];
//           angular.forEach(response.results, function (result) {
//             result.graphic.popupTemplate = result.graphic.layer.popupTemplate;
//             results.push(result.graphic);
//           });
//           if (results.length > 0) {
//             view.popup.open({features: results, location: response.mapPoint});
//           } else {
//             view.popup.close();
//           }
//
//         });
//       });
//
//       view.then(function () {
//         addBikeBenefits();
//         var gl = new GraphicsLayer();
//         webmap.add(gl);
//         MapData.setLocationLayer(gl);
//         $timeout(function() {
//           view.on('layerview-create', function (event) {
//             //if (event.layer.title === 'Vector Tile Basemap Light' || event.layer.title === 'Basemap') {
//               $ionicLoading.hide();
//               console.log(event.layer.loadStatus);
//               if (navigator.splashscreen) {
//                 navigator.splashscreen.hide();
//               }
//            if (event.layer.title === 'Bike Shops') {
//               event.layer.popupEnabled = false;
//               MapData.setBikeShopsLayer(event.layerView);
//               event.layerView.watch('updating', function (e) {
//                 event.layerView.queryFeatures().then(function (results){
//                   MapData.setBikeShops(results);
//                 });
//               });
//               event.layer.renderer = new SimpleRenderer({
//                 symbol: new PictureMarkerSymbol({
//                   url: 'http://coraleigh.github.io/bike-raleigh/www/img/shop-marker.svg',
//                   height: 24,
//                   width: 24
//                 })
//               });
//             } else if (event.layer.title === 'Trailheads') {
//               event.layer.popupEnabled = false;
//               event.layerView.watch('updating', function (e) {
//
//                 MapData.setTrailheadsLayer(event.layerView);
//                 event.layerView.queryFeatures().then(function (results){
//                   MapData.setTrailheads(results);
//                 });
//               });
//               event.layer.renderer = new SimpleRenderer({
//                 symbol: new PictureMarkerSymbol({
//                   url: 'http://coraleigh.github.io/bike-raleigh/www/img/trailhead-marker.svg',
//                   height: 14,
//                   width: 14
//                 })
//               });
//             } else if (event.layer.title === 'Parking') {
//               event.layer.popupEnabled = false;
//               event.layerView.watch('updating', function (e) {
//                 MapData.setParkingLayer(event.layerView);
//                 event.layerView.queryFeatures().then(function (results){
//                   MapData.setParking(results);
//                 });
//               });
//               event.layer.renderer = new SimpleRenderer({
//                 symbol: new PictureMarkerSymbol({
//                   url: 'http://coraleigh.github.io/bike-raleigh/www/img/parking-marker.svg',
//                   height: 24,
//                   width: 24
//                 })
//               });
//             } else if (event.layer.title === 'Bike Racks') {
//               event.layer.popupEnabled = false;
//               $rootScope.bikeRackLyr = event.layer;
//               event.layer.renderer = new SimpleRenderer({
//                 symbol: new PictureMarkerSymbol({
//                   url: 'http://coraleigh.github.io/bike-raleigh/www/img/bike-rack.svg',
//                   height: 24,
//                   width: 24
//                 })
//               });
//             } else if (event.layer.title === 'Routes') {
//               event.layer.popupEnabled = false;
//               event.layer.renderer.visualVariables = [{
//                 type: "size",
//                 expression: "view.scale",
//                 stops: [
//                  { value: 564, size: 14},
//                  { value: 1128, size: 14 },
//                  { value: 2257, size: 10 },
//                  { value: 4514, size: 10 },
//                  { value: 9028, size: 6 },
//                  { value: 18056, size: 4 },
//                  { value: 36112, size: 4 },
//                  { value: 72224, size: 2 },
//                  { value: 144448, size: 2 }
//                ]
//              }];
//               MapData.setRoutes(event.layerView.layer);
//             } else if (event.layer.title === 'On Road Facilities') {
//               event.layer.popupEnabled = false;
//               event.layer.renderer.visualVariables = [{
//                 type: "size",
//                 expression: "view.scale",
//                 stops: [
//                  { value: 564, size: 14},
//                  { value: 1128, size: 14 },
//                  { value: 2257, size: 10 },
//                  { value: 4514, size: 10 },
//                  { value: 9028, size: 6 },
//                  { value: 18056, size: 4 },
//                  { value: 36112, size: 4 },
//                  { value: 72224, size: 2 },
//                  { value: 144448, size: 2 }
//                ]
//              }];
//               MapData.setFacilities(event.layerView.layer);
//             } else if (event.layer.title === 'Greenways') {
//               event.layer.popupEnabled = false;
//               event.layer.renderer.visualVariables = [{
//                 type: "size",
//                 expression: "view.scale",
//                 stops: [
//                  { value: 564, size: 14},
//                  { value: 1128, size: 14 },
//                  { value: 2257, size: 10 },
//                  { value: 4514, size: 10 },
//                  { value: 9028, size: 6 },
//                  { value: 18056, size: 4 },
//                  { value: 36112, size: 4 },
//                  { value: 72224, size: 2 },
//                  { value: 144448, size: 2 }
//                ]
//              }];
//               MapData.setGreenwaysLayer(event.layerView.layer);
//             }
//           });
//         });
//       });
//
//
//
//       var addBikeBenefits = function () {
//         //     //add Bicycle Benefits businesses to map
//         var benefitTemplate = new PopupTemplate({
//           title: "{name}",
//           // content: "{address}" +
//           // "<br>{discount}" +
//           // "<br><a id='link' href='{web}' target='_blank'>Website</a>"
//           content: [{type: 'fields'}, {displayType: 'list', type: 'attachments'}],
//           fieldInfos: [
//             {fieldName: 'name', label: 'Name', stringFieldOptions: 'text-box', visible: true},
//             {fieldName: 'address', label: 'Address', stringFieldOptions: 'text-box', visible: true},
//             {fieldName: 'discount', label: 'Discount', stringFieldOptions: 'text-box', visible: true},
//             {fieldName: 'web', label: 'Web', stringFieldOptions: 'text-box', visible: true}
//           ]
//         });
//         var benefitsLyr = new GraphicsLayer({popupTemplate: benefitTemplate, minScale: 80000});
//         webmap.add(benefitsLyr);
//         Benefits.getBikeBenefits().then(function (data) {
//           var g = null;
//           for (var i = 0; i < data.members.length;i++) {
//             var member = data.members[i];
//             g = new Graphic({geometry: new Point({
//               longitude: parseFloat(member.longitude),
//               latitude: parseFloat(member.latitude)
//             }),
//             attributes: {name: member.name, address: member.address, web: member.web, discount: member.discount},
//             symbol: new PictureMarkerSymbol({
//               url: 'http://coraleigh.github.io/bike-raleigh/www/img/benefit-marker.svg',
//               height: 24,
//               width: 24
//             })
//           });
//           benefitsLyr.add(g);
//         }
//         MapData.setBenefitsLayer(benefitsLyr);
//         MapData.setMembers(benefitsLyr.graphics.items);
//       });
//     }
//   }
// });
// });
