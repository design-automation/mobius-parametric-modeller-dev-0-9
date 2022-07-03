## poly2d.BBoxPolygon  
  
  
**Description:** Create a polygon that is a 2D bounding box of the entities.


For the method, 'aabb' generates an Axis Aligned Bounding Box, and 'obb' generates an Oriented Bounding Box.


See `calc.BBox` and `visualize.BBox` for calculating and visualizng 3D BBox polylines instead.  
  
**Parameters:**  
  * *entities:* A list of positions, or entities from which positions can be extracted.  
  * *method:* Enum, the method for generating the bounding box: `'aabb'` or `'obb'`.  
  
**Returns:** A new polygon, the bounding box of the positions.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/poly2d/BBoxPolygon.ts) 