/** ******** MAIN SERVER FILE - express_server.js ******* */

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { render } = require("ejs");

const app     =express(); 
const PORT    = 8080; 

const urlDatabase = {
	"b2xVn2":"http://www.lighthouselabs.ca",
	"9sm5xK":"http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
}

app.listen(PORT, () => {console.log(`Example app listening on port ${PORT}!`);
});

app.set( "view engine", "ejs"); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/** ************ ROUTES ************ */

/** *** GET REQUESTS *** */

app.get("/", (req, res) => { 
	res.send("Hello!");
});

app.get("/hello",(req,res)=>{
	res.send(
	"<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
    const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],//update to user_id from username
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],//update to user_id from username
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]],//update to user_id from username
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined) {
  res.status(302);
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/urls.json", (req,res) => {
	res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],//update to user_id from username
  };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],//update to user_id from username
  };
  res.render("register", templateVars);
});

/** *** POSTS **** */

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
const { email, password } = req.body;
const user = getUserByEmail(email, users);
if (!user) {
  return res.status(403).send("Email not found");
}
if (password !== user.password) {
  return res.status(403).send("Incorrect password");
}
res.cookie("user_id", user.id);    //update to user_id from username
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");     //update to user_id from username
  res.redirect("/login");        // redirect to login
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please provide both email & password");
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send("Email already exists");
  }
  const id = generateRandomString();
  users[id] = {
    id        : id,
    email     : email,
    password  : password,
  };
  res.cookie("user_id", id);     //update to user_id from username
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
};

function getUserByEmail(email, users) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
}
