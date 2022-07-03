## analyze.Irradiance  
  
  
**Description:** Calculate an approximation of irradiance...



  
  
**Parameters:**  
  * *sensors:* A list Rays or a list of Planes, to be used as the origins for calculating
irradiance.  
  * *entities:* The obstructions, polygons or collections.  
  * *radius:* The max distance for raytracing.  
  * *method:* Enum, the sky method: `'weighted', 'unweighted'` or `'all'`.  
  
**Returns:** A dictionary containing irradiance results.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/Irradiance.ts) 