## calc.Eval  
  
  
**Description:** Calculates the xyz coord along an edge, wire, or polyline given a t parameter.


The 't' parameter varies between 0 and 1, where 0 indicates the start and 1 indicates the end.
For example, given a polyline,
- evaluating at t=0 gives that xyz at the start,
- evaluating at t=0.5 gives the xyz halfway along the polyline,
- evaluating at t=1 gives the xyz at the end of the polyline.


Given a single edge, wire, or polyline, a single xyz coord will be returned.


Given a list of edges, wires, or polylines, a list of xyz coords will be returned.


Given any entity that has wires (faces, polygons and collections),
a list of wires will be extracted, and a list of coords will be returned.  
  
**Parameters:**  
  * *entities:* Single or list of edges, wires, polylines, or faces, polygons, or collections.  
  * *t\_param:* A value between 0 to 1.  
  
**Returns:** The coordinates [x, y, z], or a list of coordinates.  
**Examples:**  
  * `coord1 = calc.Eval(polyline1, 0.25)` will return the coordinate of the point a quarter
into polyline1.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/Eval.ts) 