## attrib.Add  
  
  
**Description:** Add one or more attributes to the model.
The attribute will appear as a new column in the attribute table.
(At least one entity must have a value for the column to be visible in the attribute table).
All attribute values will be set to null.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, select the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl',
'pg', 'co',` or `'mo'`.  
  * *data\_type\_sel:* Enum, the method to use for data type for this attribute: `'number', 'string', 'boolean',
'list'` or `'dict'`.  
  * *attribs:* A single attribute name, or a list of attribute names.  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/attrib/Add.ts) 