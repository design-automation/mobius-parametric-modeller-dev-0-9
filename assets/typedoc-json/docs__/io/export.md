## io.Export  
  
  
**Description:** Export data from the model as a file.


If you export to your hard disk,
it will result in a popup in your browser, asking you to save the file.


If you export to Local Storage, there will be no popup.

  
  
**Parameters:**  
  * *entities:* (Optional) Entities to be exported. If null, the whole model will be exported.  
  * *file\_name:* Name of the file as a string.  
  * *data\_format:* Enum, the export file format: `'gi', 'sim', 'obj_v', 'obj_ps', 'geojson'`
or `'gltf'`.  
  * *data\_target:* Enum, where the data is to be exported to: `'Save to Hard Disk'` or
`'Save to Local Storage'`.  
  
**Returns:** void  
**Examples:**  
  * `io.Export (#pg, 'my\_model.obj', 'obj', 'Save to Hard Disk')`  
    Exports all the polygons in the model as an OBJ, saved to the hard disk.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/io/Export.ts) 