## poly2d.Voronoi  
  
  
**Description:** Create a voronoi subdivision of one or more polygons.


A Voronoi diagram is a partition of a plane into regions close to each of a given set of positions.
See the wikipedia page for more info: <a href="https://en.wikipedia.org/wiki/Voronoi_diagram" target="_blank">
Voronoi Diagrams</a>.
<a href="https://github.com/d3/d3-voronoi#readme" target="_blank">See the source github for
interactive examples and more information on calculating voronoi subdivisions.</a>


![Examples of voronoi outputs](/assets/typedoc-json/docMDimgs/funcs_poly2d_voronoi_examples.png)  
  
**Parameters:**  
  * *pgons:* A polygon, list of polygons, or entities from which polygons can be extracted. (This/these will be subdivided.)  
  * *entities:* A list of positions, or entities from which positions can be extracted.
(Each of these will be within a generated polygon.)  
  
**Returns:** A list of new polygons.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/poly2d/Voronoi.ts) 