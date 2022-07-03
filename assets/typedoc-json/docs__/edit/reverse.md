## edit.Reverse  
  
  
**Description:** Reverses direction of wires, polylines or polygons.


The order of vertices and edges in the wires will be reversed.


For polygons this also means that they will face in the opposite direction. The back face and
front face will be flipped. If the normal is calculated, it will face in the opposite direction.

  
  
**Parameters:**  
  * *entities:* Wire,polyline, polygon.  
  
**Returns:** void  
**Examples:**  
  * `edit.Reverse(polygon1)`  
    Flips polygon and reverses its normal.  
  * `edit.Reverse(polyline1)`  
    Reverses the order of vertices and edges in the polyline.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/edit/Reverse.ts) 