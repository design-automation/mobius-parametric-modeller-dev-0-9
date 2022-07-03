## list.Remove  
  
  
**Description:** Removes items in a list.


If method is set to 'index', then item should be the index of the item to be replaced.
Negative indexes are allowed.
If method is not set to 'index', then item should be the value.  
  
**Parameters:**  
  * *list:* The list in which to remove items.  
  * *item:* The item to remove, either the index of the item or the value. Negative indexes are allowed.  
  * *method:* Enum, select the method for removing items from the list: `'index', 'first_value',
'last_value'` or `'all_values'`.  
  
**Returns:** void  
**Examples:**  
  * `list.Remove(list, 3, 'index')`  
    where `list = [0, 1, 2, 3]`. Expected new value of list is [0, 1, 2].  
  * `list.Remove(list, 3, 'all_values')`  
    where `list = [3, 1, 2, 3, 4]`. Expected new value of list is  [1, 2, 4].
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/list/Remove.ts) 