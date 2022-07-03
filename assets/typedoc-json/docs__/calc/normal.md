## calc.Normal  
  
  
**Description:** Calculates the normal vector of an entity or list of entities. The vector is normalised, and
scaled by the specified scale factor.


Given a single entity, a single normal will be returned. Given a list of entities, a list of
normals will be returned.


For polygons, faces, and face wires the normal is calculated by taking the average of all the
normals of the face triangles.


For polylines and polyline wires, the normal is calculated by triangulating the positions, and
then taking the average of all the normals of the triangles.


For edges, the normal is calculated by taking the average of the normals of the two vertices.


For vertices, the normal is calculated by creating a triangle out of the two adjacent edges, and
then calculating the normal of the triangle. (If there is only one edge, or if the two adjacent
edges are colinear, the the normal of the wire is returned.)


For positions, the normal is calculated by taking the average of the normals of all the vertices
linked to the position.


If the normal cannot be calculated, `[0, 0, 0]` will be returned.  
  
**Parameters:**  
  * *entities:* Single or list of entities. (Can be any type of entities.)  
  * *scale:* The scale factor for the normal vector. (This is equivalent to the length of the
normal vector.)  
  
**Returns:** The normal vector [x, y, z] or a list of normal vectors.  
**Examples:**  
  * `normal1 = calc.Normal(polygon1, 1)`  
    If the input is non-planar, the output vector will be an average of all normals
vector of the polygon triangles.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/Normal.ts) 