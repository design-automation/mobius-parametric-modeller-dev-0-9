## analyze.CRTN  
  
  
**Description:** Calculates the noise impact on a set of sensors from a set of noise sources, using the CRTN
method (Calculation of Road Traffic Noise, 1988).


Typically, the sensors are created as centroids of a set of windows. The noise sources are
typically polylines placed along road centrelines. The CRTN method psecified that the
centrelines should be inset 3.5 meters from the road kerb that is closest to the sensors.


The noise impact is calculated by shooting rays out from the sensors towards the noise sources.
The 'radius' argument defines the maximum radius of the calculation.
(The radius is used to define the maximum distance for shooting the rays.)


Returns a dictionary containing the noise level values, in decibels (dB).

  
  
**Parameters:**  
  * *sensors:* A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.  
  * *entities:* The obstructions: faces, polygons, or collections.  
  * *radius:* The maximum radius of the visibility analysis.  
  * *roads:* Polylines defining the road segments as noise sources.  
  * *noise\_levels:* The noise level for each road polyline, in dB. Either a single number for all
roads, or a list of numbers matching the list of roads.  
  * *length:* The length of each road segment, in meters.  
  
**Returns:** A dictionary containing different visibility metrics.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/CRTN.ts) 