## visualize.Plane  
  
  
**Description:** Visualises a plane or a list of planes by creating polylines.  
  
**Parameters:**  
  * *planes:* A plane or a list of planes.  
  * *scale:* A number. Scales the size of the visualized plane.  
  
**Returns:** Entities, a square plane polyline and three axis polyline.  
**Examples:**  
  * `plane1 = visualize.Plane(position1, vector1, [0,1,0])`  
    Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/visualize/Plane.ts) 