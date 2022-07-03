## analyze.Wind  
  
  
**Description:** Calculate an approximation of the wind frequency for a set sensors positioned at specified
locations.

  
  
**Parameters:**  
  * *sensors:* A list of Rays or a list of Planes, to be used as the
sensors for calculating wind.  
  * *entities:* The obstructions, polygons, or collections of polygons.  
  * *radius:* The max distance for raytracing.  
  * *num\_rays:* An integer specifying the number of rays to generate in each wind direction.  
  * *layers:* Three numbers specifying layers of rays, as [start, stop, step] relative to the
sensors.  
  
**Returns:** A dictionary containing wind results.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/Wind.ts) 