## material.LineMat  
  
  
**Description:** Creates a line material and saves it in the model attributes.


[See the threejs docs on LineBasicMaterials](https://threejs.org/docs/#api/en/materials/LineBasicMaterial)
[See the threejs docs LineDashedMaterials](https://threejs.org/docs/#api/en/materials/LineDashedMaterial)


The color of the material can either ignore or apply the vertex rgb colors.
- If 'color' is set to `null`, it will apply the vertex rgb colors.
- If 'color' is set to `[r, g, b]`, it will apply the given color.


In order to assign a material to polylines in the model, a polyline attribute called 'material'
will be created. The value for each polyline must either be null, or must be a material name.


For dashed lines, the 'dash\_gap\_scale' parameter can be set.
- If 'dash\_gap\_scale' is null, it will result in a continuous line.
- If 'dash\_gap\_scale' is a single number: dash = gap = dash\_gap\_scale, scale = 1.
- If 'dash\_gap\_scale' is a list of two numbers: dash = dash\_gap\_scale[0], gap = dash\_gap\_scale[1], scale = 1.
- If 'dash\_gap\_scale' is a list of three numbers: dash = dash\_gap\_scale[0], gap = dash\_gap\_scale[1], scale = dash\_gap\_scale[2].


Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms,
line widths cannot be rendered. As a result, lines width will always be set to 1.

  
  
**Parameters:**  
  * *name:* The name of the material.  
  * *color:* Null to apply vertex colors, or the diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].  
  * *dash\_gap\_scale:* Size of the dash and gap, and a scale factor. (The gap and scale are optional.)  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/material/LineMat.ts) 