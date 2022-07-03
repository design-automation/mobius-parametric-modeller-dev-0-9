## util.HTTPRequest  
  
  
**Description:** Create a http request to a URL.
Typically used with a server that runs simulations, or to download data.  
  
**Parameters:**  
  * *request\_data:* Request data. Can be 'null' to request everything.  
  * *request\_url:* Request url, as a string.  
  * *method:* Enum, HTTP method: `'GET', 'POST', 'PATCH', 'DELETE'` or `'PUT'`.  
  
**Returns:** The request response: JSON data in the form of a dictionary.  
**Examples:**  
  * `data = util.HTTPRequest(null, "websiteurl.com", "GET")`  

[Source Code](https://github.com/design-automation/mobius-sim-funcs/blob/main/src/modules/functions/util/HTTPRequest.ts) 