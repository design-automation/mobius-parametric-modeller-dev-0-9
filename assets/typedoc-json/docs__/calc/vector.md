## calc.Vector  
  
  
**Description:** Returns a vector along an edge, from the start position to the end position.
The vector is not normalized.


Given a single edge, a single vector will be returned.
Given a list of edges, a list of vectors will be returned.


Given any entity that has edges (collection, polygons, polylines and wires),
a list of edges will be extracted, and a list of vectors will be returned.  
  
**Parameters:**  
  * *entities:* Single edge or list of edges, or any entity from which edges can be extracted.  
  
**Returns:** The vector [x, y, z] or a list of vectors.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/Vector.ts) 