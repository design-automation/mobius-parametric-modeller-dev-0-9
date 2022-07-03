## calc.Centroid  
  
  
**Description:** Calculates the centroid of an entity.


If 'ps\_average' is selected, the centroid is the average of the positions that make up that entity.


If 'center\_of\_mass' is selected, the centroid is the centre of mass of the faces that make up that entity.
Note that only faces are deemed to have mass.


Given a list of entities, a list of centroids will be returned.


Given a list of positions, a single centroid that is the average of all those positions will be returned.  
  
**Parameters:**  
  * *entities:* Single or list of entities. (Can be any type of entities.)  
  * *method:* Enum, the method for calculating the centroid: `'ps_average'` or `'center_of_mass'`.  
  
**Returns:** A centroid [x, y, z] or a list of centroids.  
**Examples:**  
  * `centroid1 = calc.Centroid (polygon1)`
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/Centroid.ts) 