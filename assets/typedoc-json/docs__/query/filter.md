## query.Filter  
  
  
**Description:** Filter a list of entities based on an attribute value.


The result will always be a list of entities, even if there is only one entity.
In a case where you want only one entity, remember to get the first item in the list.

  
  
**Parameters:**  
  * *entities:* List of entities to filter. The entities must all be of the same type.  
  * *attrib:* The attribute to use for filtering. Can be `name`, `[name, index]`, or `[name,
key]`.  
  * *operator\_enum:* Enum, the operator to use for filtering: `'==', '!=', '>=', '<=', '>', '<'` or `'='`.  
  * *value:* The attribute value to use for filtering.  
  
**Returns:** Entities, a list of entities that match the conditions specified in 'operater\_enum' and 'value'.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/query/Filter.ts) 