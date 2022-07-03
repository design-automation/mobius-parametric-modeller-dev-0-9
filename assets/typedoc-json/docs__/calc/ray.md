## calc.Ray  
  
  
**Description:** Returns a ray for edges or polygons. Rays have an origin and a direction.


For edges, it returns a ray along the edge, from the start vertex to the end vertex


For a polygon, it returns the ray that is the z-axis of the plane.


For an edge, the ray vector is not normalised. For a polygon, the ray vector is normalised.  
  
**Parameters:**  
  * *entities:* An edge, a wire, a polygon, or a list.  
  
**Returns:** The ray.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/Ray.ts) 