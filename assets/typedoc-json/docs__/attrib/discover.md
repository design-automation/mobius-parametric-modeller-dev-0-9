## attrib.Discover  
  
  
**Description:** Get all attribute names and attribute types for an entity type.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type: `'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co',` or `'mo'`.  
  
**Returns:** A list of dictionaries, defining the name and type of each attribute.  
**Examples:**  
  * `attribs = attrib.Discover("pg")`  
    An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/attrib/Discover.ts) 