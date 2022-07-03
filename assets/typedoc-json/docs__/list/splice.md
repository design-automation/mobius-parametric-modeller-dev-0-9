## list.Splice  
  
  
**Description:** Removes and inserts items in a list.


If no `items_to_add` are specified, then items are only removed.
If `num_to_remove` is 0, then values are only inserted.  
  
**Parameters:**  
  * *list:* List to splice.  
  * *index:* Zero-based index after which to start removing or inserting items.  
  * *num\_to\_remove:* Number of items to remove.  
  * *items\_to\_insert:* (Optional) List of items to add, or null/empty list.  
  
**Returns:** void  
**Examples:**  
  * `result = list.Splice(list1, 1, 3, [2.2, 3.3])`  
    where list1 = `[10, 20, 30, 40, 50]`.
Expected value of result is `[10, 2.2, 3.3, 50]`. New items were added where the items were removed.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/list/Splice.ts) 