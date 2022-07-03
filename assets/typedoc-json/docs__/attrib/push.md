## attrib.Push  
  
  
**Description:** Push attributes up or down the hierarchy. The original attribute is not changed.


In addition to the standard topologies, the `ent_type_sel` argument allows `attrib.Push` to
push attributes to the following:
- `cop`, short for "Collection Parent".
- `coc`, short for "Collection Child".  
  
**Parameters:**  
  * *entities:* Entities, the entities to push the attribute values for.  
  * *attrib:* The attribute. Can be `name`, `[name, index_or_key]`,
`[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.  
  * *ent\_type\_sel:* Enum, the target entity type where the attribute values should be pushed to:
`'ps', '_v', '_e', '_w', '_f', 'pt', 'pl', 'pg', 'co', 'cop', 'coc'` or `'mo'`.  
  * *method\_sel:* Enum, the method for aggregating attribute values in cases where aggregation is necessary:
`'first', 'last', 'average', 'median', 'sum', 'min'` or `'max'`.  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/attrib/Push.ts) 