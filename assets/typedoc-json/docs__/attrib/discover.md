## attrib.Discover  
  
  
**Description:** Get all attribute names and attribute types for an entity type.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type.  
  
**Returns:** A list of dictionaries, defining the name and type of each attribute.  
**Examples:**  
  * attribs = attrib.Discover("pg")  
    An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
  
