/** ******** Main Server File - express_server.js ******** 
 *   Creates a Node.js web server using the http API
 *    - http request on port 8080  
 */
const express = require("express");
const app     =express();
const PORT    = 8080;  /** default port 8080 */

const urlDatabase = {
	"b2xVn2":"http://www.lighthouselabs.ca",
	"9sm5xK":"http://www.google.com"
};
	
app.get("/", (req, res) => { 
	res.send("Hello!");
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

