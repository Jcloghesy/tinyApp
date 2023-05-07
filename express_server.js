/** ******** Main Server File - express_server.js ******** 
 *   Creates a Node.js web server using the http API
 *    - http requests on port 8080  
 */

const express = require("express");
const app     =express();
const PORT    = 8080;  /** default port 8080 */
const bodyParser = require("body-parser");

/** set view engine to ejs & add middleware/body-parse for POST requests */
app.set( "view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString(6);
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);

const urlDatabase = {
	"b2xVn2":"http://www.lighthouselabs.ca",
	"9sm5xK":"http://www.google.com"
};

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => { 
	res.send("Hello!");
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

/** generate random string for short URL - string length to length variable */
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

app.get("/urls.json", (req,res) => {
	res.json(urlDatabase);
});

app.get("/hello",(req,res)=>{
	res.send(
	"<html><body>Hello <b>World</b></body></html>\n");
});