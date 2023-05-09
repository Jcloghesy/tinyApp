/** ******** Main Server File - express_server.js ******** 
 *   Creates a Node.js web server using the http API
 */

const express = require("express");
const bodyParser = require("body-parser");
const app     =express();
const PORT    = 8080;  /** default port 8080 */

const urlDatabase = {
	"b2xVn2":"http://www.lighthouselabs.ca",
	"9sm5xK":"http://www.google.com"
};

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

/** set view engine to ejs & add middleware/body-parse for POST requests */
app.set( "view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

/** ROUTES  */


/** *** GET REQUESTS *** */

/** Responds to / Get request with "Hello!" text string */
app.get("/", (req, res) => { 
	res.send("Hello!");
});

app.get("/hello",(req,res)=>{
	res.send(
	"<html><body>Hello <b>World</b></body></html>\n");
});

/** Responds to /url Get rsquest with rendered HTML of urls_index.ejs */
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

/** Responds to /url Get request with rendered HTML of urls_new.ejs */
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

/* Responds to '/u/:shortURL' GET request with long URL from the urlDatabase */
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined) {
app.get("/u/:shortURL", (req, res) => {  
  res.status(302);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/urls.json", (req,res) => {
	res.json(urlDatabase);
});


/** *** POSTS **** */

//** Responds to '/urls' POST request redirect generated shortURL */
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString(6);
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[shortURL] = newLongURL;
  res.redirect("/urls/");
});

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie("username", username);
  res.redirect("/urls");
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
});
