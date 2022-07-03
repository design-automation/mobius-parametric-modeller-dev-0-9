## analyze.Nearest  
  
  
**Description:** Finds the nearest positions within a certain maximum radius.


The neighbors to each source position is calculated as follows:
1. Calculate the distance to all target positions.
2. Creat the neighbors set by filtering out target positions that are further than the maximum radius.
3. If the number of neighbors is greater than 'max\_neighbors',
then select the 'max\_neighbors' closest target positions.


Returns a dictionary containing the nearest positions.


If 'num\_neighbors' is 1, the dictionary will contain two lists:
1. 'posis': a list of positions, a subset of positions from the source.
2. 'neighbors': a list of neighbouring positions, a subset of positions from target.


If 'num\_neighbors' is greater than 1, the dictionary will contain two lists:
1. 'posis': a list of positions, a subset of positions from the source.
2. 'neighbors': a list of lists of neighbouring positions, a subset of positions from target.

  
  
**Parameters:**  
  * *source:* A list of positions, or entities from which positions can be extracted.  
  * *target:* A list of positions, or entities from which positions can be extracted.
If null, the positions in source will be used.  
  * *radius:* The maximum distance for neighbors. If null, Infinity will be used.  
  * *max\_neighbors:* The maximum number of neighbors to return.
If null, the number of positions in target is used.  
  
**Returns:** A dictionary containing the results.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/Nearest.ts) 