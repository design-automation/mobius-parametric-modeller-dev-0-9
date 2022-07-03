## analyze.SkyDome  
  
  
**Description:** Generates a sun path, oriented according to the geolocation and north direction.
The sun path is generated as an aid to visualize the orientation of the sun relative to the model.
Note that the solar exposure calculations do not require the sub path to be visualized.


The sun path takes into account the geolocation and the north direction of the model.
Geolocation is specified by a model attributes as follows:
- @geolocation={'longitude':123,'latitude':12}.
North direction is specified by a model attribute as follows, using a vector:
- @north==[1,2].
  If no north direction is specified, then [0,1] is the default (i.e. north is in the direction
  of the y-axis)

  
  
**Parameters:**  
  * *origin:* The origins of the rays.  
  * *detail:* The level of detail for the analysis.  
  * *radius:* The radius of the sun path.  
  * *method:* Enum, the type of sky to generate: `'direct', 'indirect'` or `'sky'`.  
  
**Returns:** Entities, a set of positions that are organized into sequences.
A polyline can then be drawn from these positions.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/SkyDome.ts) 