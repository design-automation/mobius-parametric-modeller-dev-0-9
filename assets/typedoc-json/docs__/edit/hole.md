## edit.Hole  
  
  
**Description:** Makes one or more holes in a polygon.


The holes are specified by lists of positions.
The positions must be on the polygon, i.e. they must be co-planar with the polygon and
they must be within the boundary of the polygon. (Even positions touching the edge of the polygon
can result in no hole being generated.)


Multiple holes can be created.
- If the positions is a single list, then a single hole will be generated.
- If the positions is a list of lists, then multiple holes will be generated.

  
  
**Parameters:**  
  * *pgon:* A polygon to make holes in. This polygon is modified by the function.  
  * *entities:* List of positions, or nested lists of positions, or entities from which positions
can be extracted to create the holes.  
  
**Returns:** Entities, a list of wires resulting from the hole(s).  
**Examples:**  
  * <a href="/editor?file=/assets/examples/Functions_edit.Hole_examples.mob&node=1" target="_blank"> Correct Example </a>  
    A model showing proper usage of edit.Hole, such that a hole is created in the orignal polygons.  
  * <a href="/editor?file=/assets/examples/Functions_edit.Hole_examples.mob&node=2" target="_blank"> Wrong Example </a>  
    A model showing potential improper usage of edit.Hole, where the hole entities are outside of the original.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/edit/Hole.ts) 