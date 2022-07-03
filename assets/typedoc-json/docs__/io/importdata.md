## io.ImportData  
  
  
**Description:** Imports a string of geometry data into the model, in various formats.
The geometry will be added to the model.

  
  
**Parameters:**  
  * *model\_data:* The model data.  
  * *data\_format:* Enum, the file format: `'gi', 'sim', 'obj', 'geojson'` or `'CityJSON'`.  
  
**Returns:** A collection of entities added to the model.  
**Examples:**  
  * `io.ImportData (data_str, "obj")`  
    Imports the data in obj format.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/io/ImportData.ts) 