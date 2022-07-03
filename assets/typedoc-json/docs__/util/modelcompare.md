## util.ModelCompare  
  
  
**Description:** Compares two models. Used for grading models.


Checks that every entity in this model also exists in the input_data.


Additional entities in the input data will not affect the score.


Attributes at the model level are ignored except for the `material` attributes.


For grading, this model is assumed to be the answer model, and the input model is assumed to be
the model submitted by the student.


The order or entities in this model may be modified in the comparison process.


For specifying the location of the GI Model, you can either specify a URL, or the name of a file
in LocalStorage.
In the latter case, you do not specify a path, you just specify the file name, e.g. 'my_model.gi'  
  
**Parameters:**  
  * *input\_data:* The location of the GI Model to compare this model to.  
  
**Returns:** Text that summarises the comparison between the two models.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/util/ModelCompare.ts) 