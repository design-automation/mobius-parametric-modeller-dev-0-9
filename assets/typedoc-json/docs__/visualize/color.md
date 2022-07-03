## visualize.Color  
  
  
**Description:** Sets color by creating a vertex attribute called 'rgb' and setting the value.


See
<a href="https://www.w3schools.com/colors/colors_rgb.asp?color=rgb(0,%200,%200)" target="_blank">w3schools</a>
for examples of RGB colors. To convert RGB(255, 255, 255) to RGB(1, 1, 1), enter vecDiv([`rgb_255_numbers`], 255).  
  
**Parameters:**  
  * *entities:* The entities for which to set the color.  
  * *color:* The color, [0,0,0] is black, [1,1,1] is white. vecDiv([255, 255, 255], 255) is also white.  
  
**Returns:** void  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/visualize/Color.ts) 