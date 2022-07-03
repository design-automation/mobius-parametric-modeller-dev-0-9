## calc.Length  
  
  
**Description:** Calculates the length of an entity.


The entity can be an edge, a wire, a polyline, or anything from which wires can be extracted.
This includes polylines, polygons, faces, and collections.


Given a list of edges, wires, or polylines, a list of lengths are returned.


Given any types of entities from which wires can be extracted, a list of lengths are returned.
For example, given a single polygon, a list of lengths are returned (since a polygon may have multiple wires).  
  
**Parameters:**  
  * *entities:* Single or list of edges or wires or other entities from which wires can be extracted.  
  
**Returns:** Lengths, a number or list of numbers.  
**Examples:**  
  * `length1 = calc.Length(line1)`
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/Length.ts) 