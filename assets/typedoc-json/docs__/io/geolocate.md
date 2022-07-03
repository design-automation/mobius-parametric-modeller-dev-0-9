## io.Geolocate  
  
  
**Description:** Set the geolocation of the Cartesian coordinate system.
Does the same as the Geoalign function, but with alternate parameters.


The Cartesian coordinate system is geolocated by defining two points:
- The latitude-longitude of the Cartesian origin.
- The counter-clockwise rotation around the Cartesian origin, in radians.

  
  
**Parameters:**  
  * *lat\_long:* Set the latitude and longitude of the origin of the Cartesian coordinate system.  
  * *rot:* Set the counter-clockwise rotation of the Cartesian coordinate system, in radians.  
  * *elev:* Set the elevation of the Cartesian coordinate system above the ground plane.  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/io/Geolocate.ts) 