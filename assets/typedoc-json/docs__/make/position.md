## make.Position  
  
  
**Description:** Adds one or more new positions to the model. Positions are unique entities and cannot be added to
collections.  
  
**Parameters:**  
  * *coords:* A list of three numbers, or a list of lists of three numbers.  
  
**Returns:** A new position, or nested list of new positions.
Each position is an entity with an xyz attribute, that can be called with `posi@xyz`.  
**Examples:**  
  * `position1 = make.Position([1,2,3])`  
    Creates a position with coordinates x=1, y=2, z=3.  
  * `positions = make.Position([[1,2,3],[3,4,5],[5,6,7]])`  
    Creates three positions, with coordinates [1,2,3],[3,4,5] and [5,6,7].
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/make/Position.ts) 