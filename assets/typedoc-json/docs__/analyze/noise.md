## analyze.Noise  
  
  
**Description:** Calculates the noise impact on a set of sensors from a set of noise sources.


Typically, the sensors are created as centroids of a set of windows. The noise sources are
typically placed along road centrelines.


The noise impact is calculated by shooting rays out from the sensors towards the noise sources.
The 'radius' argument defines the maximum radius of the calculation.
(The radius is used to define the maximum distance for shooting the rays.)


Returns a dictionary containing different metrics.

  
  
**Parameters:**  
  * *sensors:* A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.  
  * *entities:* The obstructions: faces, polygons, or collections.  
  * *radius:* The maximum radius of the visibility analysis.  
  * *roads:* Polylines defining the road segments as noise sources.  
  * *noise\_levels:* undefined  
  * *length:* The length of each road segment.  
  
**Returns:** A dictionary containing different visibility metrics.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/Noise.ts) 