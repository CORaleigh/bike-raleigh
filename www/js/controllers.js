angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, MapData, $ionicSideMenuDelegate, $ionicPopup, $ionicLoading) {
  $ionicLoading.show();

  if (!localStorage.getItem("accepted")) {
    var disclaimer = $ionicPopup.show({
      template: '<p>This map is published by the City of Raleigh as a resource to bicyclists. Neither the City of Raleigh nor the North Carolina Department of Transportation assumes liability for bicyclists traveling upon these routes or on any public street.</p>' +
      '<p>Bicyclists have the same rights and responsibilities as motor vehicle operators to obey all traffic laws. Routes should be planned based on an individual evaluation of traffic conditions, road/path materials and personal riding skills.</p>' +
      '<p>The content of this map has been based on information available at the time of printing only, and it does not reflect any future changes that may occur to routes and road surfaces.</p>',
      title: 'Disclaimer',
      subTitle: '',
      scope: $scope,
      buttons: [
        {
          text: '<b>Accept</b>',
          type: 'button-positive',
          onTap: function(e) {
            localStorage.setItem("accepted", "true");
            disclaimer.close();
          }
        }
      ]
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
  $scope.showAboutPopup = function () {
    var about = $ionicPopup.show({
      template: '<p>Developed by City of Raleigh GIS for the Office of Transportation Planning. &copy;' + new Date().getFullYear() + '</p>' +
      '<p>For more infomation about the BikeRaleigh program, please visit <a href="http://www.bikeraleigh.org" target="_blank" ng-click="openInBrowser($event)">BikeRaleigh.org</a></p>' +
      '<p>We appreciate your feedback, please send your comments or report any issues.</p>' +
      '<button class="button button-block button-positive ion-email button-outline icon-left" ng-click="openMail($event)">Send Feedback</button>' +
      '<small>Icon pack by <a href="http://www.icons8.com" target="_blank" ng-click="openInBrowser($event)">Icons8</a></small>',
      title: 'About',
      subTitle: '',
      scope: $scope,
      buttons: [
        {
          text: '<b>Dismiss</b>',
          type: 'button-positive',
          onTap: function(e) {
            about.close();
          }
        }
      ]
    });
  };
})
.controller('MapCtrl', function($scope, MapData, Benefits, $timeout, $cordovaInAppBrowser, $rootScope, $ionicLoading) {
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

    var id = "994e289fb6944ec5969efb90f09d1704";
    //var device = WURFL.complete_device_name.toLowerCase();
    //console.log(device.cordova);
    // if (device.indexOf("iphone") > 0 || device.indexOf("ipad") > 0 ) {
    //   if (device.indexOf("4") > 0 || device.indexOf("3") > 0 || device.indexOf("2") > 0) {
    //       id = "d7dcefd59b01462b971c3f782a07c287"
    //   }
    // }
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      if (device) {
        device.model = device.model.toLowerCase();
        device.model = device.model.split(',')[0];
        if (device.model.indexOf("iphone") > -1 || device.model.indexOf("ipad") > -1) {
          if (device.model.indexOf("2") > -1 || device.model.indexOf("3") > -1 || device.model.indexOf("4") > -1) {
            id = "d7dcefd59b01462b971c3f782a07c287"
          }
        }
        buildMap(id);
      }
    }


    var buildMap = function (id) {
      var webmap = new WebMap({
        portalItem: {
          id: id
        }
      });
      var view = new MapView({
        map: webmap,
        container: "map",
        ui: ['zoom'],
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
          snapToZoom: false,
          rotationEnabled: false
        }
      });
      view.popup.watch("selectedFeature", function (e) {
        $timeout(function () {
          var elm = document.querySelector('.esri-popup .esri-popup-main a');
          if (elm) {
            elm.addEventListener('click', function(e) {
              e.preventDefault();
              var href = e.currentTarget.href;
              var arr = href.split(/http/g);
              href = 'http' + arr[arr.length-1];
              window.open(decodeURIComponent(href), '_system', 'location=yes'); return false;
            });
          }
        });


      });
      MapData.setMapView(view);
      // var compass = new Compass({
      //   view: view
      // });
      // view.ui.add(compass, "top-left");

      view.on('click', function (evt) {
        view.hitTest(evt.screenPoint).then(function (response) {
          var results = [];
          angular.forEach(response.results, function (result) {
            result.graphic.popupTemplate = result.graphic.layer.popupTemplate;
            results.push(result.graphic);
          });
          if (results.length > 0) {
            view.popup.open({features: results, location: response.mapPoint});
          } else {
            view.popup.close();
          }

        });
      });

      view.then(function () {
        addBikeBenefits();
        var gl = new GraphicsLayer();
        webmap.add(gl);
        MapData.setLocationLayer(gl);
        $timeout(function() {
          view.on('layerview-create', function (event) {
            //if (event.layer.title === 'Vector Tile Basemap Light' || event.layer.title === 'Basemap') {
              $ionicLoading.hide();
              console.log(event.layer.loadStatus);
              if (navigator.splashscreen) {
                navigator.splashscreen.hide();
              }
           if (event.layer.title === 'Bike Shops') {
              event.layer.popupEnabled = false;
              MapData.setBikeShopsLayer(event.layerView);
              event.layerView.watch('updating', function (e) {
                event.layerView.queryFeatures().then(function (results){
                  MapData.setBikeShops(results);
                });
              });
              event.layer.renderer = new SimpleRenderer({
                symbol: new PictureMarkerSymbol({
                  url: 'http://coraleigh.github.io/bike-raleigh/www/img/shop-marker.svg',
                  height: 24,
                  width: 24
                })
              });
            } else if (event.layer.title === 'Trailheads') {
              event.layer.popupEnabled = false;
              event.layerView.watch('updating', function (e) {

                MapData.setTrailheadsLayer(event.layerView);
                event.layerView.queryFeatures().then(function (results){
                  MapData.setTrailheads(results);
                });
              });
              event.layer.renderer = new SimpleRenderer({
                symbol: new PictureMarkerSymbol({
                  url: 'http://coraleigh.github.io/bike-raleigh/www/img/trailhead-marker.svg',
                  height: 14,
                  width: 14
                })
              });
            } else if (event.layer.title === 'Parking') {
              event.layer.popupEnabled = false;
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
              event.layer.popupEnabled = false;
              $rootScope.bikeRackLyr = event.layer;
              event.layer.renderer = new SimpleRenderer({
                symbol: new PictureMarkerSymbol({
                  url: 'http://coraleigh.github.io/bike-raleigh/www/img/bike-rack.svg',
                  height: 24,
                  width: 24
                })
              });
            } else if (event.layer.title === 'Routes') {
              event.layer.popupEnabled = false;
              event.layer.renderer.visualVariables = [{
                type: "size",
                expression: "view.scale",
                stops: [
                 { value: 564, size: 14},
                 { value: 1128, size: 14 },
                 { value: 2257, size: 10 },
                 { value: 4514, size: 10 },
                 { value: 9028, size: 6 },
                 { value: 18056, size: 4 },
                 { value: 36112, size: 4 },
                 { value: 72224, size: 2 },
                 { value: 144448, size: 2 }
               ]
             }];
              MapData.setRoutes(event.layerView.layer);
            } else if (event.layer.title === 'On Road Facilities') {
              event.layer.popupEnabled = false;
              event.layer.renderer.visualVariables = [{
                type: "size",
                expression: "view.scale",
                stops: [
                 { value: 564, size: 14},
                 { value: 1128, size: 14 },
                 { value: 2257, size: 10 },
                 { value: 4514, size: 10 },
                 { value: 9028, size: 6 },
                 { value: 18056, size: 4 },
                 { value: 36112, size: 4 },
                 { value: 72224, size: 2 },
                 { value: 144448, size: 2 }
               ]
             }];
              MapData.setFacilities(event.layerView.layer);
            } else if (event.layer.title === 'Greenways') {
              event.layer.popupEnabled = false;
              event.layer.renderer.visualVariables = [{
                type: "size",
                expression: "view.scale",
                stops: [
                 { value: 564, size: 14},
                 { value: 1128, size: 14 },
                 { value: 2257, size: 10 },
                 { value: 4514, size: 10 },
                 { value: 9028, size: 6 },
                 { value: 18056, size: 4 },
                 { value: 36112, size: 4 },
                 { value: 72224, size: 2 },
                 { value: 144448, size: 2 }
               ]
             }];
              MapData.setGreenwaysLayer(event.layerView.layer);
            }
          });
        });
      });



      var addBikeBenefits = function () {
        //     //add Bicycle Benefits businesses to map
        var benefitTemplate = new PopupTemplate({
          title: "{name}",
          // content: "{address}" +
          // "<br>{discount}" +
          // "<br><a id='link' href='{web}' target='_blank'>Website</a>"
          content: [{type: 'fields'}, {displayType: 'list', type: 'attachments'}],
          fieldInfos: [
            {fieldName: 'name', label: 'Name', stringFieldOptions: 'text-box', visible: true},
            {fieldName: 'address', label: 'Address', stringFieldOptions: 'text-box', visible: true},
            {fieldName: 'discount', label: 'Discount', stringFieldOptions: 'text-box', visible: true},
            {fieldName: 'web', label: 'Web', stringFieldOptions: 'text-box', visible: true}
          ]
        });
        var benefitsLyr = new GraphicsLayer({popupTemplate: benefitTemplate, minScale: 80000});
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
  }
});
});
