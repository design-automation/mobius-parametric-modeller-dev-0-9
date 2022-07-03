## analyze.View  
  
  
**Description:** Calculates an approximation of the unobstructed view for a set of origins.


Typically, the origins are created as centroids of a set of windows.


The unobstructed view is calculated by shooting rays out from the origins in a fan pattern.


The 'radius' argument defines the maximum radius of the unobstructed view.
(The radius is used to define the maximum distance for shooting the rays.)


The 'num\_rays' argument defines the number of rays that will be shot,
in a fan pattern parallel to the XY plane, with equal angle between rays.
More rays will result in more accurate result, but will also be slower to execute.


Returns a dictionary containing different unobstructed view metrics.



  
  
**Parameters:**  
  * *sensors:* A list of Rays or Planes, to be used as the origins for calculating the unobstructed views.  
  * *entities:* The obstructions: faces, polygons, or collections.  
  * *radius:* The maximum radius of the uobstructed views.  
  * *num\_rays:* The number of rays to generate when calculating uobstructed views.  
  * *view\_ang:* The angle of the unobstructed view, in radians.  
  
**Returns:** A dictionary containing different unobstructed view metrics.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/View.ts) 