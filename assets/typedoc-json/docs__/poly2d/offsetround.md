## poly2d.OffsetRound  
  
  
**Description:** Offset a polyline or polygon, with round joints. The original entities are unmodified.


The types of joints of the generated offset polygon are shown below.
The red border indicates the generated offset polygon, whereas the black polygon
is the original/input polygon.


![Examples of offset joints](/assets/typedoc-json/docMDimgs/funcs_poly2d_offsets_joints_examples.png)


See `poly2d.OffsetMitre` and `poly2d.OffsetChamfer` to use different joints while offsetting.
Alternatively, try `modify.Offset` for a different offset operation that works in 3D and modifies
the original entities.


For open polylines, the type of ends can be changed with `end\_type`, shown below.


![Examples of offset ends](/assets/typedoc-json/docMDimgs/funcs_poly2d_offsetRound_examples.png)

  
  
**Parameters:**  
  * *entities:* A list of polylines or polygons, or entities from which polylines or polygons can
be extracted.  
  * *dist:* Offset distance, a number.  
  * *tolerance:* The tolerance for the rounded corners, a number that is more than 0. In general,
the smaller the number, the rounder the joints. Will also apply to `round_end` if selected.  
  * *end\_type:* Enum, the type of end shape for open polylines: `'square_end', 'butt_end'` or `'round_end'`.  
  
**Returns:** A list of new polygons.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/poly2d/OffsetRound.ts) 