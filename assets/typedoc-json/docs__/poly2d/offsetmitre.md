## poly2d.OffsetMitre  
  
  
**Description:** Offset a polyline or polygon, with mitered joints. The original entities are unmodified.


The types of joints of the generated offset polygon are shown below.
The red border indicates the generated offset polygon, whereas the black polygon
is the original/input polygon.


![Examples of offset joints](/assets/typedoc-json/docMDimgs/funcs_poly2d_offsets_joints_examples.png)


See `poly2d.OffsetChamfer` and `poly2d.OffsetRound` to use different joints while offsetting.
Alternatively, try `modify.Offset` for a different offset operation that works in 3D and modifies
the original entities.


For open polylines, the type of ends can be changed with `end\_type`, shown below.


![Examples of offset ends](/assets/typedoc-json/docMDimgs/funcs_poly2d_offsets_examples.png)


`limit` determines how far a mitered joint can be offset if it is at a sharp angle (see above image).
If the mitered joint's length exceeds the `limit`, a "squared" offsetting is created at the joint.  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can be extracted.  
  * *dist:* Offset distance, a number.  
  * *limit:* Mitre limit, a number.  
  * *end\_type:* Enum, the type of end shape for open polylines: `'square_end'` or `'butt_end'`.  
  
**Returns:** A list of new polygons.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/poly2d/OffsetMitre.ts) 