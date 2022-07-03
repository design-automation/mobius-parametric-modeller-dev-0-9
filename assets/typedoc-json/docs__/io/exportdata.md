## io.ExportData  
  
  
**Description:** Export data from the model as a string.

  
  
**Parameters:**  
  * *entities:* (Optional) Entities to be exported. If null, the whole model will be exported.  
  * *data\_format:* Enum, the export file format: `'gi', 'sim', 'obj_v', 'obj_ps', 'geojson'` or `'gltf'`.  
  
**Returns:** The model data as a string.  
**Examples:**  
  * `io.Export (#pg, 'my_model.obj', 'obj')`  
    Exports all the polygons in the model as an OBJ.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/io/ExportData.ts) 