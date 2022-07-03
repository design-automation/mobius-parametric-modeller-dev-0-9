## CONSOLE  
  
**Description:** 

The console will show the output, printed lines and error messages of the code (if any), along
with the time taken to run each node. This is helpful for debugging or creating more efficient
scripts.

**Printing**

Each time a flowchart is executed, some text is shown in the Console viewer. The process of adding text to the Console viewer is referred to as 'printing'.

This Console viewer gives you feedback on the process of execution of the procedures in all the nodes in the flowchart. By default, it dynamically prints the amount of time it took to execute the procedure in each node. The 'Print' toggle allows you to print additional information. This additional information can give you a better understand what is happening while your script is executing. 

When the 'Print' toggle button on a line of code is switched on, then the value being assign to the variable in that line of code gets printed. Below is an example of printing a value of a variable.

![Printing variables](assets/typedoc-json/docUI/imgs/editor_print_variable.png)

In this case, the variable being printed is called `circs` and the value that is printed in the Console viewer is `['pl','p2','p3','p4','p5','p6']` (i.e. a list of IDs of polylines).

Below is a second example of printing, this time in a loop. Two 'Print ' toggle buttons have been switched on: the 'Print' on the `For-each` loop, and the 'Print' on the `make.Copy` line of code. 

![Printing variables in a loop](assets/typedoc-json/docUI/imgs/editor_print_loop.png)

In this case, each time the `For-each` loop is executed, some information is printed to the Console viewer. The `For-each` line prints `_Executing For-each: i = 0`. Then the `make.Copy` line prints `_ent_copy = 'pl1'`. Then it repeats six times.

**Runtime Errors**

Code can have two main types of errors: syntax errors and runtime errors. Syntax errors are highlighted before the code is executed, by creating a red outline around the input box where the error occurs (as shown above). Runtime errors on the other hand only become apparent when the code is executed.

For runtime errors, the line of code where the error occurred is highlighted, and an error message will appear in the Console. Below is an example of a runtime error. 

![Example of a runtime error](assets/typedoc-json/docUI/imgs/editor_runtime_error.png)

**Info Functions**

There are several functions that can print out useful information about the model and its entities. 
Their output will be displayed on the console.

(The below links will show the overall categories of the functions.)

* [util.EntityInfo](/gallery?defaultViewer=doc&docSection=Funcs.util): Returns information on a specific entity. 
* [util.ParamInfo](/gallery?defaultViewer=doc&docSection=Funcs.util): Returns information about a specific parameter. 
* [attrib.Discover](/gallery?defaultViewer=doc&docSection=Funcs.attrib): Returns all the attributes and values in an entity.