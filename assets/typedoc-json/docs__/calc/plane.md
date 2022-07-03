## calc.Plane  
  
  
**Description:** Returns a plane from a polygon, a face, a polyline, or a wire.
For polylines or wires, there must be at least three non-colinear vertices.


The winding order is counter-clockwise.
This means that if the vertices are ordered counter-clockwise relative to your point of view,
then the z axis of the plane will be pointing towards you.  
  
**Parameters:**  
  * *entities:* Any entities.  
  
**Returns:** The plane.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/Plane.ts) 