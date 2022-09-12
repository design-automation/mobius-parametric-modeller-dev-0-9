## analyze.Sun  
  
  
**Description:** Calculate an approximation of the solar exposure factor, for a set sensors positioned at specfied
locations.
The solar exposure factor for each sensor is a value between 0 and 1, where 0 means that it has
no exposure
and 1 means that it has maximum exposure.


The calculation takes into account the geolocation and the north direction of the model.
Geolocation is specified by a model attributes as follows:
 - @geolocation={'longitude':123,'latitude':12}.
North direction is specified by a model attribute as follows, using a vector:
 - @north==[1,2]
If no north direction is specified, then [0,1] is the default (i.e. north is in the direction of
the y-axis);


Each sensor has a location and direction, specified using either rays or planes.
The direction of the sensor specifies what is infront and what is behind the sensor.
For each sensor, only exposure infront of the sensor is calculated.


The exposure is calculated by shooting rays in reverse.
from the sensor origin to a set of points on the sky dome.
If the rays hits an obstruction, then the sky dome is obstructed..
If the ray hits no obstructions, then the sky dome is not obstructed.


The exposure factor at each sensor point is calculated as follows:
1. Shoot rays to all sky dome points.
2. If the ray hits an obstruction, assign a wight of 0 to that ray.
3. If a ray does not hit any obstructions, assign a weight between 0 and 1, depending on the
incidence angle.
4. Calculate the total solar expouse by adding up the weights for all rays.
5. Divide by the maximum possible solar exposure for an unobstructed sensor.


The solar exposure calculation takes into account the angle of incidence of the sun ray to the
sensor direction.
Sun rays that are hitting the sensor straight on are assigned a weight of 1.
Sun rays that are hitting the sensor at an oblique angle are assigned a weight equal to the
cosine of the angle.


If 'direct\_exposure' is selected, then the points on the sky dome will follow the path of the
sun throughout the year.
If 'indirect\_exposure' is selected, then the points on the sky dome will consist of points
excluded by
the path of the sun throughout the year.


The direct sky dome points cover a strip of sky where the sun travels.
The inderect sky dome points cover the segments of sky either side of the direct sun strip.


The detail parameter spacifies the number of rays that get generated.
The higher the level of detail, the more accurate but also the slower the analysis will be.
The number of rays differs depending on the latitde.


At latitude 0, the number of rays for 'direct' are as follows:
0 = 44 rays,
1 = 105 rays,
2 = 510 rays,
3 = 1287 rays.


At latitude 0, the number of rays for 'indirect' are as follows:
0 = 58 rays,
1 = 204 rays,
2 = 798 rays,
3 = 3122 rays.


The number of rays for 'sky' are as follows:
0 = 89 rays,
1 = 337 rays,
2 = 1313 rays,
3 = 5185 rays.


Returns a dictionary containing solar exposure results.


If one  of the 'direct' methods is selected, the dictionary will contain:
1. 'direct': A list of numbers, the direct exposure factors.


If one  of the 'indirect' methods is selected, the dictionary will contain:
1. 'indirect': A list of numbers, the indirect exposure factors.



  
  
**Parameters:**  
  * *sensors:* A list of coordinates, a list of Rays or a list of Planes, to be used as the
origins for calculating exposure.  
  * *entities:* The obstructions, faces, polygons, or collections of faces or polygons.  
  * *radius:* The max distance for raytracing.  
  * *detail:* An integer between 1 and 3 inclusive, specifying the level of detail for the
analysis.  
  * *method:* Enum, solar method: `'direct_weighted', 'direct_unweighted', 'indirect_weighted'`,
or `'indirect_unweighted'`.  
  
**Returns:** A dictionary containing solar exposure results.  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/analyze/Sun.ts) 