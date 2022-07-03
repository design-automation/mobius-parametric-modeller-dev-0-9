## visualize.BBox  
  
  
**Description:** Visualises a bounding box by adding geometry to the model.


See `calc.BBox` for creating the bounding box.
To create polygons of the bounding box instead, see `poly2d.BBoxPolygon`.


The bounding box is an imaginary box that completely contains all the geometry.
The box is always aligned with the global x, y, and z axes.


The bounding box consists of a list of lists, as follows [[x, y, z], [x, y, z], [x, y, z], [x, y, z]].
- The first [x, y, z] is the coordinates of the centre of the bounding box.
- The second [x, y, z] is the corner of the bounding box with the lowest x, y, z values.
- The third [x, y, z] is the corner of the bounding box with the highest x, y, z values.
- The fourth [x, y, z] is the dimensions of the bounding box.  
  
**Parameters:**  
  * *bboxes:* A list of 4 lists (created from `calc.BBox`).  
  
**Returns:** Entities, twelve polylines representing the box.  
**Examples:**  
  * `bbox1 = calc.BBox(geometry)`, `bbox_vis = visualize.BBox(bbox1)`  
    Creates a box around the inital geometry.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/visualize/BBox.ts) 