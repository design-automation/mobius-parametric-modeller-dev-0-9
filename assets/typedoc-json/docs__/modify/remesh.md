## modify.Remesh  
  
  
**Description:** Remesh a face or polygon.


When a face or polygon is deformed, the triangles that make up that face will sometimes become incorrect.


Remeshing will regenerate the triangulated mesh for the face.


Remeshing is not performed automatically as it would degrade performance.
Instead, it is left up to the user to remesh only when it is actually required.

  
  
**Parameters:**  
  * *entities:* Single or list of faces, polygons, collections.  
  
**Returns:** void  
**Examples:**  
  * <a href="/editor?file=/assets/examples/Functions_modify.Remesh_example.mob&node=1" target="_blank"> Example of Usage </a>  
    A model showing proper usage of make.Remesh, to remove extra polygons created when modifying the model.  
  * `modify.Remesh(polygon1)`  
    Remeshes the face of the polygon.

  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/modify/Remesh.ts) 