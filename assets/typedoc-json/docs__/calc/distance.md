## calc.Distance  
  
  
**Description:** Calculates the minimum distance from one position to other entities in the model.  
  
**Parameters:**  
  * *entities1:* Position to calculate distance from.  
  * *entities2:* List of entities to calculate distance to.  
  * *method:* Enum, distance method: `'ps_to_ps_distance', 'ps_to_e_distance'` or `'ps_to_w_distance'`.  
  
**Returns:** Distance, or list of distances (if position2 is a list).  
**Examples:**  
  * `distance1 = calc.Distance(position1, position2, p_to_p_distance)`  
    `position1 = [0,0,0]`, `position2 = [[0,0,10],[0,0,20]]`, Expected value of distance is `10`.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/calc/Distance.ts) 