## make.Extrude  
  
  
**Description:** Extrudes geometry by distance or by vector.
- Extrusion of a position, vertex, or point produces polylines;
- Extrusion of an edge, wire, or polyline produces polygons;
- Extrusion of a polygon produces new polygons, capped at the top.




The geometry that is generated depends on the method that is selected.
- The 'quads' method will generate polygons.
- The 'stringers' and 'ribs' methods will generate polylines.
- The 'copies' method will generate copies of the input geometry type.  
  
**Parameters:**  
  * *entities:* A list of entities, can be any type of entitiy.  
  * *dist:* Number or vector. If number, assumed to be `[0,0,value]` (i.e. extrusion distance in
z-direction).  
  * *divisions:* Number of divisions to divide extrusion by. Minimum is 1.  
  * *method:* Enum, choose what to select when extruding edges: `'quads', 'stringers', 'ribs'` or `'copies'`.  
  
**Returns:** Entities, a list of new polygons or polylines resulting from the extrude.  
**Examples:**  
  * `extrusion1 = make.Extrude(point1, 10, 2, 'quads')`  
    Creates a polyline of total length 10 (with two edges of length 5 each) in the
z-direction.
In this case, the 'quads' setting is ignored.  
  * `extrusion2 = make.Extrude(polygon1, [0,5,0], 1, 'quads')`  
    Extrudes polygon1 by 5 in the y-direction, creating a list of quad surfaces.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/make/Extrude.ts) 