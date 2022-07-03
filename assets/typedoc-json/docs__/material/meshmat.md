## material.MeshMat  
  
  
**Description:** Creates a basic mesh material and saves it in the model attributes.


[See the threejs docs on basic mesh materials](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)


The color of the material can either ignore or apply the vertex rgb colors.
- If 'color' is set to `null`, it will apply the vertex rgb colors.
- If 'color' is set to `[r, g, b]`, it will apply the given color.


Additional material properties can be set by calling the functions for the more advanced materials.
These include LambertMaterial, PhongMaterial, StandardMaterial, and Physical Material.
Each of these more advanced materials allows you to specify certain additional settings.


In order to assign a material to polygons in the model, a polygon attribute called 'material'
needs to be created. The value for each polygon must either be null, or must be a material name.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *color:* The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *opacity:* The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).  
  * *select\_side:* Enum, select where to apply colors: `'front', 'back'`, or `'both'`.  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/material/MeshMat.ts) 