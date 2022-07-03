## poly2d.Delaunay  
  
  
**Description:** Create a delaunay triangulation of a set of positions.


A Delaunay triangulation for a given set of positions (`entities`) is a triangulation, DT(P), such
that no position in `entities` is inside the circumcircle of any triangle in DT(P).
See the wikipedia page for more info: <a href="https://en.wikipedia.org/wiki/Delaunay_triangulation" target="_blank">
Delanuay triangulation</a>.


<img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Delaunay_circumcircles_vectorial.svg">

  
  
**Parameters:**  
  * *entities:* A list of positions, or entities from which positions can be extracted.  
  
**Returns:** A list of new polygons.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/poly2d/Delaunay.ts) 