## attrib.Values  
  
  
**Description:** Get a list of unique attribute values for an attribute.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.  
  * *attribs:* A single attribute name, or a list of attribute names.  
  
**Returns:** A list of values of the attribute.  
**Examples:**  
  * `attribs = attrib.Values("pg")`  
    An example of `attribs`: `["True", "False"]`.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/attrib/Values.ts) 