## list.Replace  
  
  
**Description:** Replaces items in a list.


If method is set to 'index', then old\_item should be the index of the item to be replaced. Negative indexes are allowed.
If method is not set to 'index', then old\_item should be the value to be replaced.  
  
**Parameters:**  
  * *list:* The list in which to replace items.  
  * *old\_item:* The old item to replace.  
  * *new\_item:* The new item.  
  * *method:* Enum, select the method for replacing items in the list: `'index', 'first_value',
'last_value'` or `'all_values'`.  
  
**Returns:** void  
**Examples:**  
  * `list.Replace(list, 3, [6, 7, 8], 'last_value')`  
    where `list = [3, 1, 2, 3, 4]`.
Expected new value of list is `[3, 1, 2, [6, 7, 8], 4]`.  
  * `list.Replace(list, 2, 0, 'index')`  
    where `list = [0,1,2,3,4,5]`.
Expected new value of list is `[0,1,0,3,4,5]`.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/list/Replace.ts) 