## make.Sweep  
  
  
**Description:** Sweeps a cross section wire along a backbone wire.  
  
**Parameters:**  
  * *entities:* Wires, or entities from which wires can be extracted.  
  * *x\_section:* Cross section wire to sweep, or entity from which a wire can be extracted.  
  * *divisions:* Segment length or number of segments.  
  * *method:* Enum, select the method for sweeping: `'quads', 'stringers', 'ribs'` or `'copies'`.  
  
**Returns:** Entities, a list of new polygons or polylines resulting from the sweep.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/make/Sweep.ts) 