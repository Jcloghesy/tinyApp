/** ******** MAIN SERVER FILE - express_server.js ******* */

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const { generateRandomString, getUserByEmail, urlsForUser } = require("./helpers");

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
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
}

app.listen(PORT, () => {console.log(`Example app listening on port ${PORT}!`);
});

app.set( "view engine", "ejs"); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    name: "session",
    keys: ["mySecKey"],
    maxAge: 24 * 60 * 60 * 1000,
});


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
  if (!req.session["user_id"]) {
    res.send(
      '<html><body><h1>Please log in <a href="/login">login</a> </h1></body></html>'
    );
  }
  const templateVars = {
    urls: urlsForUser(req.session["user_id"], urlDatabase),
    user: users[req.session["user_id"]],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]];//update to user_id from username
  const templateVars = {
    user: users[req.session["user_id"]],
    id: req.params.id,
    longURL: urlsForUser(req.session["user_id"]),
  };
  if (!user) {
    res.redirect("/login");
  } else {
    res.render("urls_show", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.session["user_id"]],//update to user_id from username
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
  const longURL = urlDatabase[req.params.id].longURL;
  if (!longURL) {
    res.send("URL Ids do not exist");
  } else {
    res.redirect(longURL);
  }
});

app.get("/urls.json", (req,res) => {
	res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  const user = users[req.session["user_id"]];//update to user_id from username
  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: user,
    };
    res.render("login", templateVars);
  }
});

app.get("/register", (req, res) => {
  const user = users[req.session["user_id"]];//update to user_id from username
  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: user,
    };
    res.render("registration", templateVars);
  }
});


/** *** POSTS **** */

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const user = users[req.session["user_id"]];
  if (!user) {
    res.send("You must login/register");
  } else {
    const id = generateRandomString(6);
    const obj = { longURL: longURL, userID: user.id };
    urlDatabase[id] = obj;
    res.redirect(`/urls/${id}`);
  }
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[shortURL] = newLongURL;
  res.redirect("/urls/");
  if (urlDatabase[shortURL].userID === req.session["user_id"]) {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect("/urls");
    console.log("urlDatabase: ", urlDatabase);
  } else if (!req.session["user_id"]) {
    res.redirect("/urls");
  } else if (!urlDatabase[shortURL]) {
    res.redirect("/urls");
  }
  res.send("You do not have permission edit");
});

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
  if (urlDatabase[shortURL].userID === req.session["user_id"]) {
    delete urlDatabase[shortURL];
  } else if (!req.session["user_id"]) {
    res.redirect("/urls");
  } else if (!urlDatabase[shortURL]) {
    res.redirect("/urls");
  } else {
    res.send("You do not have permission to delete");
  }
});

app.post("/login", (req, res) => {
const { email, password } = req.body;
const user = getUserByEmail(email, users);
if (!user) {
  return res.status(403).send("Email not found");
}
if (!bcrypt.compareSync(password, user.password)) {
   res.status(403).send("Incorrect password");
   return;
}
res.session.user_id = user.id;    //update to user_id from username
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;     //update to user_id from username
  res.redirect("/login");        // redirect to login
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("Please provide both email & password");
    return;
  }
  if (getUserByEmail(email, users)) {
    res.status(400).send("Email already exists");
    return;
  }
  const userId = generateRandomString(7);
  users[userId] = {
    id        : userId,
    email     : email,
    password  : password,
    password  : bcrypt.hashSync(password, 10),
  };
  res.session.user_id = user.id; //update to user_id from username
  res.redirect("/urls");        // redirect to urls
});
