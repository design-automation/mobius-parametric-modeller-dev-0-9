## attrib.Delete  
  
  
**Description:** Delete one or more attributes from the model. The column in the attribute table will be deleted.
All values will also be deleted. 
  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.  
  * *attribs:* A single attribute name, or a list of attribute names. If 'null', all attributes
will be deleted.  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/attrib/Delete.ts) 