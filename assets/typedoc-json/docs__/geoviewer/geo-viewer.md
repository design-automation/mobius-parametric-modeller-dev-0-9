## GEO-VIEWER  
  
The Geo viewer allows you to view 3D models placed onto a 2D map of the world. 

Entities cannot be selected in this mode. 
Point objects are not visible in the GEO viewer.

* Rotate view: Left click and drag.
* Pan view: Right click and drag.
* Zoom in/out: Scroll with mouse wheel (or two-finger on touch-pad). Alternatively, double-click on
  a spot to zoom in to it. 

In the top-right corner:
* _Settings_: Opens the settings dialog box on the left side.
* _Zoom to Fit_: Moves the camera to fit the model in the view.

In the bottom-left corner:
* _Time Slider_: Adjusts the time of day of the model, changing the lighting. 

**GEO Viewer Settings**

The settings for the Geo Viewer can be accessed by the 'gear' icon in the top right-hand corner of the viewer. The settings has one tab, 'Scene'.

- Imagery tile: The map image can be changed by selecting a different one from the dropdown menu. 
- Date: The time and date can be manually set from here. This will adjust the sun path and lighting of the model. 
- Camera position and rotation: The default camera position and rotation can be set by adjusting
the camera as desired then clicking "apply". 

**Time and Sun**

Can be adjusted in settings or with the bottom left slider on the Geo viewer.
The sun position is based on sun data from <a href="http://suncalc.net/" target="_blank">SunCalc.net</a>. 

**Geolocating a model**

By default, models will be placed at the NUS field in Singapore.

Here is an example of how to customize the geolocation of a model:
1. Create a node at the start of the script.
2. Use the `io.Geoalign()` to set the geolocation.
3. You need to specify the latitude and longitude of two points. 
    - The origin of the Cartesian Coordinate System
    - A point on the X-axis of the Cartesian Coordinate System
        - To get the latitude and longitude of any point, one can right click on google maps.
        - The first item in the popup is the latitude and longitude.

`io.Geolocate()` can also be used instead, which takes the origin of the Cartesian Coordinate System
and the counter-clockwise rotation of the Cartesian coordinate system (in radians) as arguments instead.

![Example of io.Geoalign code](assets/typedoc-json/docVW/imgs/viewer_geo_geoaligning.png)