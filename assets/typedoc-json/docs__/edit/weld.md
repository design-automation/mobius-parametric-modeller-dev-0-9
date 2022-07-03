## edit.Weld  
  
  
**Description:** Make or break welds between vertices.
If two vertices are welded, then they share the same position.


- When making a weld between vertices (`make_weld`), a new position is created and the old
  positions are removed. The new position is calculated as the average of all the existing
  positions of the vertices. The vertices will then be linked to the new position. This means
  that if the position is later moved, then all vertices will be affected. The new position is
  returned. The positions that become shared are returned.
- When breaking a weld between vetices (`break_weld`), existing positions are duplicated. Each
  vertex is then linked to one of these duplicate positions. If these positions are later moved,
  then only one vertex will be affected.  The new positions that get generated are returned.

  
  
**Parameters:**  
  * *entities:* Entities, a list of vertices, or entities from which vertices can be extracted.  
  * *method:* Enum, the method to use: `'make_weld'` or `'break_weld'`.  
  
**Returns:** Entities, a list of new positions depending on type of weld.  
**Examples:**  
  * <a href="/editor?file=/assets/examples/Functions_edit.Weld_example.mob&node=1" target="_blank">
Example model </a>  
    A simple model with polylines, showing how to weld and break vertices.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/edit/Weld.ts) 