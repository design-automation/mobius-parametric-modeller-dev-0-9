## visualize.Gradient  
  
  
**Description:** Generates a colour range based on a numeric attribute.
Sets the color by creating a vertex attribute called 'rgb' and setting the value.


The available gradients are from <a href="https://colorbrewer2.org/">Color Brewer. </a>
If a custom gradient is desired, the inline expression `colScale()` can be used instead.
Refer to its documentation for more information.  
  
**Parameters:**  
  * *entities:* The entities for which to set the color.  
  * *attrib:* The numeric attribute to be used to create the gradient.
You can specify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.  
  * *range:* The range of the attribute. If a list of 2 numbers is input, [minimum, maximum].
If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.  
  * *method:* Enum, the colour gradient to use: `'false_color', 'black_body', 'white_red',
'white_green', 'white_blue', 'blue_red', 'green_red', 'blue_green', 'grey_scale', 'OrRd', 'PuBu',
'BuPu', 'Oranges', 'BuGn', 'YlOrBr', 'YlGn', 'Reds', 'RdPu', 'Greens', 'YlGnBu', 'Purples',
'GnBu', 'Greys', 'YlOrRd', 'PuRd', 'Blues', 'PuBuGn', 'Viridis', 'Spectral', 'RdYlGn', 'RdBu',
'PiYG', 'PRGn', 'RdYlBu', 'BrBG', 'RdGy', 'PuOr', 'Set2', 'Accent', 'Set1', 'Set3', 'Dark2',
'Paired', 'Pastel2'` or `'Pastel1'`.  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/visualize/Gradient.ts) 