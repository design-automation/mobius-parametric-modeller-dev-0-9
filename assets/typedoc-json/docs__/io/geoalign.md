## io.Geoalign  
  
  
**Description:** Set the geolocation of the Cartesian coordinate system.
Does the same as the Geolocate function, but with alternate parameters.


The Cartesian coordinate system is geolocated by defining two points:
- The latitude-longitude of the Cartesian origin.
- The latitude-longitude of a point on the positive Cartesian X-axis.

  
  
**Parameters:**  
  * *lat\_long\_o:* Set the latitude and longitude of the origin of the Cartesian coordinate
system.  
  * *lat\_long\_x:* Set the latitude and longitude of a point on the x-axis of the Cartesian
coordinate system.  
  * *elev:* Set the elevation of the Cartesian coordinate system above the ground plane.  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/io/Geoalign.ts) 