/*
	ta bort current Position och det.
*/

angular.module('gMap', []).
directive('gMap', function(googleMaps, $timeout){
	return{
		restrict: 'E',
        replace: true,
		transclude: true,
		template: "<div ng-transclude></div>",
		scope: true,
		link: function(scope, element, attrs){
			scope.$on('location', function(){
				//här ska den recentreras
			})
			$timeout(function(){
			//create the map
			var center = googleMaps.makePosition(attrs.centerlat, attrs.centerlong)
			//update map on load
			var options = googleMaps.setMapOptions(center, attrs.zoom);
				scope.map = googleMaps.createMap(options, "map")	
			}, 0);
		},
		controller: ['$scope',function($scope) {
			this.getMap = function(){
				return $scope.map
			}
	    }]
	};
}).
directive('gMarker', function(googleMaps, $timeout){
	return{
		require: "^gMap",
		restrict: 'E',
		scope: true,
		link: function(scope, element, attrs, mapCtrl){
			$timeout(function(){

				//add to map
				var location = googleMaps.makePosition(attrs.poslat, attrs.poslong)
				var map = mapCtrl.getMap();
				var marker = googleMaps.addMarker(map, location,attrs.title)

				//make link
				if(typeof attrs.href != 'undefined'){
					googleMaps.hrefMarker(marker, attrs.href);
				};
	    	}, 0); 
		}
	}

}).
directive('gDirection', function(googleMaps, $timeout){
	return{
		require: "^gMap",
		restrict: 'E',
		scope: true,
		link: function(scope, element, attrs, mapCtrl){
			$timeout(function(){

				var origin = googleMaps.makePosition(attrs.originlat, attrs.originlong);
				var destination = googleMaps.makePosition(attrs.destinationlat, attrs.destinationlong);
				var map = mapCtrl.getMap();
				googleMaps.addDirection(map,origin,destination,attrs.travelmode)
	    	}, 10); 
		}
	}
}).
service('googleMaps', function(){
	return{
		hrefMarker: function(marker, url){
			this.linkMarker(marker, function(){
				window.location.href = url
			})
		},
		linkMarker: function(marker, callback){
 			google.maps.event.addListener(marker, 'click', callback)
		},
		makePosition: function(lat, long){
			return new google.maps.LatLng(lat,long)
		},
		setMapOptions: function(center, zoom){
			var mapOptions = 
			{
				zoom: parseInt(zoom, 10),
				center: center,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: false,
			}
			return mapOptions;
		},
		createMap: function(options, theId){

			var map = new google.maps.Map(document.getElementById(theId), options);
			return map;
		},
		addMarker: function(map, position, title){
			var marker = new google.maps.Marker({
				position: position,
				map: map,
				title: title
			});
			return marker;
		},
		addDirection: function(map, origin, destination, travelMode){
			//apply directions to map
			var directionsDisplay = new google.maps.DirectionsRenderer({
					map: map,
				});

			//request directions from server
			var request = {
				origin: origin, 
				destination: destination,
				travelMode: google.maps.DirectionsTravelMode[travelMode],
			};
			var directionsService = new google.maps.DirectionsService();
			directionsService.route(request, function(response, status) 
			{
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				}else{
					console.log(status)
				}
			});
		},
	}
});