## poly2d.Clean  
  
  
**Description:** Clean a polyline or polygon.


Vertices that are closer together than the specified tolerance will be merged.
Vertices that are colinear within the tolerance distance will be deleted.

  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can be extracted.  
  * *tolerance:* The tolerance for deleting vertices from the polyline.
(If nothing happens, try using a smaller tolerance number from 0-2.
Results of tolerance can be checked with query.Get vertices.)  
  
**Returns:** A list of new polylines or polygons.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/poly2d/Clean.ts) 