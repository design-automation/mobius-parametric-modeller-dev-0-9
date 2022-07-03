## query.Invert  
  
  
**Description:** Returns a list of entities that are not part of the specified entities.
For example, you can get the position entities that are not part of a list of polygon entities.


This function does the opposite of `query.Get()`.
While `query.Get()` gets entities that are part of the list of entities,
this function gets the entities that are not part of the list of entities.

  
  
**Parameters:**  
  * *ent\_type\_enum:* Enum, specifies what type of entities will be returned: `'ps', '_v', '_e',
'_w', 'pt', 'pl', 'pg'`, or `'co'`.  
  * *entities:* List of entities to be excluded.  
  
**Returns:** Entities, a list of entities that match the type specified in '`ent_type_enum`', and that are not in `entities`.  
**Examples:**  
  * `positions = query.Invert('positions', [polyline1, polyline2])`  
    Returns a list of positions that are not part of polyline1 and polyline2.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/query/Invert.ts) 