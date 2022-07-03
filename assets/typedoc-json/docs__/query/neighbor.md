## query.Neighbor  
  
  
**Description:** Returns a list of neighboring entities. In order to qualify as a neighbor,
entities must not be part of the set of input entities, but must be welded to one or more entities in the input.

  
  
**Parameters:**  
  * *ent\_type\_enum:* Enum, select the types of neighbors to return: `'ps', '_v', '_e', '_w', 'pt', 'pl',
'pg',` or `'co'`.  
  * *entities:* List of entities.  
  
**Returns:** Entities, a list of welded neighbors  
**Examples:**  
  * `query.neighbor('edges', [polyline1,polyline2,polyline3])`  
    Returns list of edges that are welded to polyline1, polyline2, or polyline3.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/query/Neighbor.ts) 