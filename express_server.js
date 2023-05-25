/** ================= MAIN SERVER FILE - express_server.js ================== */



/** ==================== INITIAL SERVER SETUP & CONFIGURATION =============== **
 *               (Dependencies, App Instances, Middleware, Database)          */

/** -------------- DEPENDENCIES (Import required modules/functions) --------- */

const express = require("express"); 
const bcrypt = require("bcryptjs"); 
const cookieSession = require("cookie-session"); 

const { generateRandomString, getUserByEmail, urlsForUser } = 
  require("./helpers");


/** ---------- BASIC CONFIGURATION (Express, View Engine, Middleware) ------ */

/** Create instance of Express to access services (libraries, sessions, etc) */
const app = express(); 

/** Set view engine to EJS to allow use of static template files */
app.set("view engine", "ejs");

/** Starts application server, sets port to listen, send message to console */ 
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`TinyApp's server is listening on port ${PORT}!`);
});

/** middleware (between request & response) to parse URL-encoded bodies */
app.use(express.urlencoded({ extended: true }));

/** middleware - store session data on the client (vs server) within a cookie */
app.use(
  cookieSession({
    name: "my_session",
    keys: ["my_Private_Key"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);


/** -------------------- DATABASE OBJECTS (URLs & Users) -------------------- */

/** URLs - Database object to hold shortened URLs & associated user IDs */
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userId: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "userRandomID",
  }, 
  "1sm5xK": {
    longURL: "http://www.google.ca",
    userId: "user2RandomID",
  },
  "2K6txK": {
    longURL: "http://www.google.com",
    userId: "user2RandomID",      
  },
  "3sm5xK": {
    longURL: "http://www.wikipedia.org",
    userId: "user2RandomID",
  },
  "4K6txK": {
    longURL: "http://www.github.com",
    userId: "user2RandomID",      
  },
  "5ZxnV1": {
    longURL: "http://www.amazon.com",
    userId: "user2RandomID",
  },
};  

/** USERS - Database object for users info (id, email, hashed password)  */
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10), 
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10), 
  },
};




/** ==================== ROUTE HANDLERS (GET & POST) ======================== */
/** ============================ GET ROUTES ================================= */

/** ------- MISC ROUTE HANDLERS (GET /, hello, urls.json & users.json) ------ */

/** GET: redirect to /urls or /login if user is not logged in */
app.get("/", (req, res) => {
  const user = users[req.session["user_id"]];
  if (user) {
    return res.redirect("/urls");  
  }
  res.redirect("/login"); 
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n"); 
});

/** GET: renders home page with welcome message requesting user to login */
app.get("/home", (req, res) => {
  req.session = null;
  const templateVars = {
    user: null,
    welcomeMessage1: "Welcome to TinyApp!",
    welcomeMessage2: "Please register or login using links above to begin using TinyApp."
  };
  res.render("home", templateVars);
});

/** GET: handler for "/urls.json" to show all urls in urlDatabase as JSON */
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // 
});


/** GET: handler for "/users.json" to show all users in application as JSON */
app.get("/users.json", (req, res) => {
  res.json(users);
});



/** --------------- NON-URL GET ROUTES (Home, login, Register) -------------- */

/** GET: handler for registration request page/template
 *       - gets user object based on user_id stored in session cookie
 *  - REDIRECTS: to main urls index if already logged in or after registration
 */
app.get("/register", (req, res) => {
  const user = users[req.session["user_id"]];
  if (user) {
    return res.redirect("urls");
  }
  const templateVars = {
    user: null,
  };
    res.render("register", templateVars);
});


/** GET: renders login page/template
 *       - gets user object based on user_id stored in session cookie
 *  - REDIRECTS: to main urls index page if user is logged in 
 */
app.get("/login", (req, res) => {
  const user = users[req.session["user_id"]];
  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: null,
  };
  res.render("login", templateVars);
});


/** GET: renders logout page with logout message requesting user to login */
app.get("/logout", (req, res) => {
  req.session = null;
  const templateVars = {
    user: null,
    logoutMessage1: "Thanks you for visiting TinyApp!",
    logoutMessage2: "We hope to see you again soon!"
  };
  res.render("logout", templateVars);
});


/** GET: handler to return longURL when shortURL is requested
 *        - gets longURL associated with the provided ID (shortURL)
 *        - does not require user in user log in (anyone can access)
 *  - ERROR: message if the URL is not found in the database
 *  - REDIRECT: to longURL request via shortURL 
 */
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!longURL) {
    return res.send("URL not found");
  } else {
    res.redirect(longURL);
  }
});



/** --------------------------- URL GET ROUTES ------------------------------ */

/** GET: gets URLs associated with the current user in urldatabase
 *       - current user is user_id stored in session cookie user in user object
 *  - ERROR: send a message if the user is not logged in
 *  - REDIRECTS: to /urls/ urls index page and renders if user is logged in 
 */
app.get("/urls", (req, res) => {
  const user = users[req.session["user_id"]];
  const templateVars = {
    urls: urlsForUser(req.session["user_id"], urlDatabase),
    user,
  };
  if (!user) {
    return res.send("You must login/register first");
  }
  res.render("urls_index", templateVars);
});


/** GET: handler to return longURL when shortURL is requested
 *        - gets user object based on user_id stored in session
 *  - ERROR: message if user not logged in
 *  - REDIRECT: to page using urls_new template or /login if not logged in
 */
app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]];
  if (!user) {
  return res.redirect("/login");
  }
  const templateVars = {
    user: user,
  };
  res.render("urls_new", templateVars);
});


/** GET: handler to return longURL when shortURL is requested
 *        - gets user object based on user_id stored in session
 *  - ERROR: message if url not in database, user not logged in, url not user's 
 *  - REDIRECT: to page using urls_show template 
 */
app.get("/urls/:id", (req, res) => {
  const user = users[req.session["user_id"]];
  if (!urlDatabase[req.params.id]) {
    return res.send("URL doesn't exist");
  }
  if (!user) {
    return res.send("You must login/register first");
  }
  if (urlDatabase[req.params.id].userId !== req.session["user_id"]) {
    return res.send("Not Autherized to access this page");
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user,
  };
  res.render("urls_show", templateVars);
});



/** =========================== POST ROUTES ================================= */

/** --------------------------- URL POST ROUTES ----------------------------- */

/** POST: LIST URLS handler for list all URLs associated with specific user_id
 *        - gets user object based on user_id stored in session
 *        - uses shortURL for requested URL entry & deletes urlDatabase
 *        - gets longURL from request body & generate random shortURL
 *  - ERROR: message if user is not logged in - please login/register
 *  - REDIRECT: to /urls/ user's url index & shows new shorturl if logged in
 */
app.post("/urls", (req, res) => {
  const userId = req.session["user_id"]; 
  const user = users[userId]; 
  if (!user) {
    return res.send("You must login");
  }
  const longURL = req.body.longURL; 
  const shortURL = generateRandomString(); 
  urlDatabase[shortURL] = {
    longURL,
    userId,
  };
  res.redirect(`/urls/${shortURL}`);
});


/** POST: EDIT handler for user to edit specific URL
 *        - gets user object based on user_id stored in session
 *        - uses shortURL for requested URL entry & deletes urlDatabase
 *  - ERROR: message if url not in database, user not logged in, url not user's 
 *  - REDIRECT: to /urls/ - user's main url index page after successful edit
*/
app.post("/urls/:id", (req, res) => {
  const user = users[req.session["user_id"]];
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[shortURL].longURL = newLongURL;
  if (!urlDatabase[req.params.id]) {
    return res.send("URL doesn't exist");
  }
  if (!user) {
    return res.send("You must login/register first");
  }
  if (urlDatabase[req.params.id].userId !== req.session["user_id"]) {
    return res.send("Not Autherized to access this page");
  }
  res.redirect("/urls");
});


/** POST: DELETE URLs handler for users to delete specific url
 *        - gets user object based on user_id stored in session
 *        - uses shortURL for requested URL entry & deletes urlDatabase
 *  - ERROR: message if url not in database, user not logged in, url not user's 
 *  - REDIRECT: to /urls/ - user's main url index page after successful deletion
 */
app.post("/urls/:id/delete", (req, res) => {
  const user = users[req.session["user_id"]];
  const shortURL = req.params.id;
  if (!urlDatabase[req.params.id]) {
  return res.send("URL doesn't exist");
  }
  if (!user) {
  return res.send("You must login/register first");
  }
  if (urlDatabase[req.params.id].userId !== req.session["user_id"]) {
  return res.send("Not authorized to access this page");
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});




/** -------------- NON-URL POST ROUTES (login, logout, Register) ------------ */

/** POST: lOGIN handler for users to login into app (email & pass submit button)
 *        - obtains email & password from form submission & checks database obj 
 *  - REQUIRES: both email & password submitted & stores in session
 *  - ERROR: messages if info missing or email not found / pass not matching   
 *  - REDIRECTS: to login if error or to user's urls with successful login
 */
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (!user) {
  return res.status(403).send("Email not found");
  }
  if (!bcrypt.compareSync(password, user.password)) {
  return res.status(403).send("Incorrect password");
  }
  req.session.user_id = user.id; 
  res.redirect("/urls"); 
});


/** POST: LOGOUT handler for logout request (button click)
 *        - upon logout clears session
 *  - REDIRECTS to the "/login" page after logout
 */
app.post("/logout", (req, res) => {
  req.session = null; 
  res.redirect("/logout"); 
});


/** POST: REGISTER handler for registration - form (email & pass submit button)
 *        - renders registration page with form requesting email & password
 *  - REQUIRES both email & password & stores user_id in the session cookie
 *  - ERROR: message if email / password missing or user account already exists
 *  - REDIRECTS: to /url showing blank list of user's urls upon registration
 */
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Insert your email or password");
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send("Email is already exist");
  }
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password: bcrypt.hashSync(password, 10),
  };
  req.session.user_id = id; 
  res.redirect("/urls");
});

