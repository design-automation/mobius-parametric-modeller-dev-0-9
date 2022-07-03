## calc.BBox  
  
  
**Description:** Returns the bounding box of the entities.


The bounding box is an imaginary box that completely contains all the geometry.
The box is always aligned with the global x, y, and z axes.


The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
- The first [x, y, z] is the coordinates of the centre of the bounding box.
- The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
- The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
- The fourth [x, y, z] is the dimensions of the bounding box.


To visualize the bounding box, see `Visualize.BBox`.
To create polygons of the bounding box, see `poly2d.BBoxPolygon`.  
  
**Parameters:**  
  * *entities:* The entities for which to calculate the bounding box.  
  
**Returns:** The bounding box, consisting of a list of four lists.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/BBox.ts) 