## analyze.Raytrace  
  
  
**Description:** Shoot a set of rays into a set of obstructions, consisting of polygon faces.
One can imagine particles being shot from the ray origin in the ray direction, hitting the
obstructions.


Each ray will either hit an obstruction, or will hit no obstructions.
The length of the ray vector is ignored, only the ray origin and direction is taken into account.
Each particle shot out from a ray will travel a certain distance.
The minimum and maximum distance that the particle will travel is defined by the 'dist' argument.


If a ray particle hits an obstruction, then the 'distance' for that ray is the distance from the * ray origin to the point of intersection.
If the ray particle does not hit an obstruction, then the 'distance' for that ray is equal to
the max for the 'dist' argument.


Returns a dictionary containing the following data.


If 'stats' is selected, the dictionary will contain the following numbers:
1. 'hit\_count': the total number of rays that hit an obstruction.
2. 'miss\_count': the total number of rays that did not hit any obstruction.
3. 'total\_dist': the total of all the ray distances.
4. 'min\_dist': the minimum distance for all the rays.
5. 'max\_dist': the maximum distance for all the rays.
6. 'avg\_dist': the average dist for all the rays.
7. 'dist\_ratio': the ratio of 'total\_dist' to the maximum distance if not rays hit any
obstructions.


If 'distances' is selected, the dictionary will contain the following list:
1. 'distances': A list of numbers, the distance travelled for each ray.


If 'hit\_pgons' is selected, the dictionary will contain the following list:
1. 'hit\_pgons': A list of polygon IDs, the polygons hit for each ray, or 'null' if no polygon
was hit.


If 'intersections' is selected, the dictionary will contain the following list:
1. 'intersections': A list of XYZ coords, the point of intersection where the ray hit a polygon,
or 'null' if no polygon was hit.


If 'all' is selected, the dictionary will contain all of the above.


If the input is a list of rays, the output will be a single dictionary.
If the list is empty (i.e. contains no rays), then 'null' is returned.
If the input is a list of lists of rays, then the output will be a list of dictionaries.

  
  
**Parameters:**  
  * *rays:* A ray, a list of rays, or a list of lists of rays.  
  * *entities:* The obstructions, faces, polygons, or collections of faces or polygons.  
  * *dist:* The ray limits, one or two numbers. Either max, or [min, max].  
  * *method:* Enum, values to return: `'stats', 'distances', 'hit_pgons', 'intersections'` or `'all'`.  
  
**Returns:** A dictionary, a list of dictionaries, or null.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/Raytrace.ts) 