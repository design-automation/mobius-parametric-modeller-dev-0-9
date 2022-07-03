## poly2d.Relationship  
  
  
**Description:** Analyses the relationship between a set of polygons and a set of entities.


Touches—A part of the feature from feature class 1 comes into contact with the boundary of a feature from feature class 2. The interiors of the features do not intersect.
Contains—A feature from feature class 1 completely encloses a feature from feature class 2.
Intersects—Any part of a feature from feature class 1 comes into contact with any part of a feature from feature class 2.
Relation—A custom spatial relationship is defined based on the interior, boundary, and exterior of features from both feature classes.
Within—A feature from feature class 2 completely encloses a feature from feature class 1.
Crosses—The interior of a feature from feature class 1 comes into contact with the interior or boundary (if a polygon) of a feature from feature class 2 at a point.
Overlaps—The interior of a feature from feature class 1 partly covers a feature from feature class 2. Only features of the same geometry can be compared.  
  
**Parameters:**  
  * *pgons:* A polygon, list of polygons, or entities from which polygons can be extracted.
(These will be subdivided.)  
  * *entities:* A list of entities.  
  * *method:* Enum  
  
**Returns:** Boolean values indicating if the entities are inside any of the polygons.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/poly2d/Relationship.ts) 