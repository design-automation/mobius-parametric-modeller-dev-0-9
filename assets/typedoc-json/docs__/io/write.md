## io.Write  
  
  
**Description:** Write data to the hard disk or to the local storage.
Depending on your browser's download settings,
a dialog box may pop up to manually confirm the action if writing to the hard disk.  
  
**Parameters:**  
  * *data:* The data to be saved (can be the url to the file).  
  * *file\_name:* The name to be saved in the file system as a string (file extension should be included).  
  * *data\_target:* Enum, where the data is to be exported to: `'Save to Hard Disk'` or `'Save to Local Storage'`.  
  
**Returns:** Whether the data is successfully saved. (True/false)  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/io/Write.ts) 