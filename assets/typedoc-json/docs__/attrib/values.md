## attrib.Values  
  
  
**Description:** Get a list of unique attribute balues for an attribute.

  
  
**Parameters:**  
  * *ent\_type\_sel:* Enum, the attribute entity type.  
  * *attribs:* undefined  
  
**Returns:** A list of dictionaries, defining the name and type of each attribute.  
**Examples:**  
  * attribs = attrib.Discover("pg")  
    An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
  
