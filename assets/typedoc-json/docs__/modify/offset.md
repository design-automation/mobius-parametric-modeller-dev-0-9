## modify.Offset  
  
  
**Description:** Performs a simple geometrical offset on the wires, such that the wires are parallel to their
original positions, modying the input entities. Works on 3D geometry.


See `poly2d.OffsetChamfer, poly2d.OffsetMitre` and `poly2d.OffsetRound` for other offset
functions that do not modify the input entities (but are limited to 2D).  
  
**Parameters:**  
  * *entities:* Edges, wires, faces, polylines, polygons, collections.  
  * *dist:* The distance to offset by, can be either positive or negative.  
  
**Returns:** void  
**Examples:**  
  * <a href="/editor?file=/assets/examples/Functions_modify.Offset_3DExamples.mob&node=1" target="_blank"> 3D Example </a>  
    A model showing offset used on 3D geometry.  
  * <a href="/editor?file=/assets/examples/Functions_modify.Offset_Self-intersecting_Example.mob&node=1" target="_blank"> Wrong Example </a>  
    A model showing self-intersecting geometries created by offset and how to fix it.  
  * `modify.Offset(polygon1, 10)`  
    Offsets the wires inside polygon1 by 10 units. Holes will also be offset.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/modify/Offset.ts) 