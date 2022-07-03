## make.Clone  
  
  
**Description:** Adds a new copy of specified entities to the model, and deletes the original entity.  
  
**Parameters:**  
  * *entities:* Entity or lists of entities to be copied. Entities can be positions, points, polylines, polygons and collections.  
  
**Returns:** Entities, the cloned entity or a list of cloned entities.  
**Examples:**  
  * `copies = make.Clone([position1,polyine1,polygon1])`  
    Creates a copy of position1, polyline1, and polygon1 and deletes the originals.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/make/Clone.ts) 