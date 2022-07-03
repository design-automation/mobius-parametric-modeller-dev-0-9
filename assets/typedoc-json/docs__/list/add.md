## list.Add  
  
  
**Description:** Adds an item to a list.  
  
**Parameters:**  
  * *list:* List to add the item to.  
  * *item:* Item to add.  
  * *method:* Enum, select the method: `'to_start', 'to_end', 'extend_start', 'extend_end',
'alpha_descending', 'alpha_ascending', 'numeric_descending', 'numeric_ascending',
'ID_descending'` or `'ID_ascending'`.  
  
**Returns:** void  
**Examples:**  
  * `append = list.Add([1,2,3], 4, 'at_end')`  
    Expected value of list is `[1,2,3,4]`.  
  * `append = list.Add([1,2,3], [4, 5], 'at_end')`  
    Expected value of list is `[1,2,3,[4,5]]`.  
  * `append = list.Add([1,2,3], [4,5], 'extend_end')`  
    Expected value of list is `[1,2,3,4,5]`.  
  * `append = list.Add(["a", "c", "d"], "b", 'alpha_descending')`  
    Expected value of list is `["a", "b", "c", "d"]`.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/list/Add.ts) 