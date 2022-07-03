## list.Sort  
  
  
**Description:** Sorts a list, based on the values of the items in the list. 
 For alphabetical sort, values are
sorted character by character, numbers before upper case alphabets, upper case alphabets before
lower case alphabets.  
  
**Parameters:**  
  * *list:* List to sort.  
  * *method:* Enum, specifies the sort method to use: `'reverse', 'alpha_descending',
'alpha_ascending', 'numeric_descending', 'numeric_ascending', 'ID_descending', 'ID_ascending',
'shift_1', 'reverse_shift_1'` or `'random'`.  
  
**Returns:** void  
**Examples:**  
  * `list.Sort(list, 'alpha')`  
    where `list = ["1","2","10","Orange","apple"]`. Expected value of list is
`["1","10","2","Orange","apple"]`.  
  * `list.Sort(list, 'numeric')`  
    where `list = [56,6,48]`. Expected value of list is `[6,48,56]`.
  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/list/Sort.ts) 