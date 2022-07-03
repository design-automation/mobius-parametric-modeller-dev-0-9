## collection.Create  
  
  
**Description:** Create a new collection.


If the `entities` argument is null or an empty list, then an empty collection will be created.


If the `name` argument is null, then no name attribute will be created for the collection.


If the list of entities contains other collections, these other collections will then become
children of the new collection.  
  
**Parameters:**  
  * *entities:* List or nested lists of points, polylines, polygons, and other colletions, or null.  
  * *name:* The name to give to this collection, resulting in an attribute called `name`. If `null`, no attribute will be created.  
  
**Returns:** Entities, new collection, or a list of new collections.  
**Examples:**  
  * `collection1 = collection.Create([point1,polyine1,polygon1], 'my_coll')`  
    Creates a collection containing point1, polyline1, polygon1, with an attribute `name = 'my_coll'`.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/collection/Create.ts) 