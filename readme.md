Simple directive that outputs google maps and allows you to draw on them.

Example
Inject the application in your module:

`angular.module('weather', ['angularytics', 'gMap']).`

You can now add the directives:
```
<g-map centerlong="{{myLocation.long}}" centerlat="{{myLocation.lat}}" id='map' zoom="11" class="map">
  <g-marker poslong="{{longitude}}" poslat="{{latitude}}" href="#/{{url}}" title="{{title}}"></g-marker>
  <g-direction originlong="{{originlong}}" originlat="{{originlat}}" destinationlat="{{destinationlat}}" destinationlong="{{destinationlong}}" travelMode="{{DRIVIVING, WALKING, BICYCLING OR TRANSIT-->}}"></g-marker>
</g-map>
```