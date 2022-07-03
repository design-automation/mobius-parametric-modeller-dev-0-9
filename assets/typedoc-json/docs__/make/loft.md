## make.Loft  
  
  
**Description:** Lofts between entities.


The geometry that is generated depends on the method that is selected.
- The 'quads' method will generate polygons.
- The 'stringers' and 'ribs' methods will generate polylines.
- The 'copies' method will generate copies of the input geometry type.  
  
**Parameters:**  
  * *entities:* List of entities, or list of lists of entities.  
  * *divisions:* The number of divisions in the resultant entities. Minimum is 1.  
  * *method:* Enum, if 'closed', then close the loft back to the first entity in the list:
`'open_quads', 'closed_quads', 'open_stringers', 'closed_stringers', 'open_ribs', 'closed_ribs'` or `'copies'`.  
  
**Returns:** Entities, a list of new polygons or polylines resulting from the loft.  
**Examples:**  
  * <a href="/editor?file=/assets/gallery/building_examples/Chapel_Wavy_roof.mob&node=3" target="_blank"> Example model from the gallery, showing polylines being lofted. </a>  
    Creates quad polygons lofting between polyline1, polyline2, polyline3.  
  * `quads = make.Loft([polyline1,polyline2,polyline3], 1, 'open_quads')`  
    Creates quad polygons lofting between polyline1, polyline2, polyline3, and back to polyline1.  
  * `quads = make.Loft([polyline1,polyline2,polyline3], 1, 'closed_quads')`  
    Creates quad polygons lofting first between polyline1 and polyline2, and then between polyline3 and polyline4.
  
  * `quads = make.Loft([ [polyline1,polyline2], [polyline3,polyline4] ] , 1, 'open_quads')`  
    undefined  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/make/Loft.ts) 