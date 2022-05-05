## analyze.Visibility  
  
  
**Description:** Calculates the visibility of a set of target positions from a set of origins.


Typically, the origins are created as centroids of a set of windows. The targets are a set of positions
whose visibility is to be analysed.


The visibility is calculated by shooting rays out from the origins towards the targets.
The 'radius' argument defines the maximum radius of the visibility.
(The radius is used to define the maximum distance for shooting the rays.)


Returns a dictionary containing different visibility metrics.



  
  
**Parameters:**  
  * *origins:* A list of Rays or Planes, to be used as the origins for calculating the uobstructed views.  
  * *entities:* The obstructions: faces, polygons, or collections.  
  * *radius:* The maximum radius of the visibility analysis.  
  * *targets:* The traget positions.
  
