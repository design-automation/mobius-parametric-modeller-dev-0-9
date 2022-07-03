## make.Cut  
  
  
**Description:** Cuts polygons and polylines using a plane.


- If the 'keep\_above' method is selected, then only the part of the cut entities above the plane are kept.
- If the 'keep\_below' method is selected, then only the part of the cut entities below the plane are kept.
- If the 'keep\_both' method is selected, then both the parts of the cut entities are kept.


Currently does not support cutting polygons with holes.


If 'keep\_both' is selected, returns a list of two lists.
`[[entities above the plane], [entities below the plane]]`.  
  
**Parameters:**  
  * *entities:* Polylines or polygons, or entities from which polyline or polygons can be extracted.  
  * *plane:* The plane to cut with.  
  * *method:* Enum, the method for cutting: `'keep_above', 'keep_below'` or `'keep_both'`.  
  
**Returns:** Entities, a list of three lists of entities resulting from the cut.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/make/Cut.ts) 