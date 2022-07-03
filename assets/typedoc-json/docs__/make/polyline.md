## make.Polyline  
  
  
**Description:** Adds one or more new polylines to the model. Polylines are objects.  
  
**Parameters:**  
  * *entities:* List or nested lists of positions, or entities from which positions can be extracted.  
  * *close:* Enum, `'open'` or `'close'`.  
  
**Returns:** Entities, new polyline, or a list of new polylines.  
**Examples:**  
  * `polyline1 = make.Polyline([position1,position2,position3], 'close')`  
    Creates a closed polyline with vertices position1, position2, position3 in sequence.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/make/Polyline.ts) 