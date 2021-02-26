const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { validateUser, urlsForUser } = require("./helpers/userFunctions");

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "Rxj4l3" },
  "sgq3y6": { longURL: "http://www.google.com", userID: "Rxj4l3" },
  "d9Kled": { longURL: "http://www.github.com", userID: "lw2c49"},
  "MRj39d": { longURL: "http://www.youtube.com", userID: "lw2c49"},
  "8MbEj2": { longURL: "http://www.wikipedia.org", userID: "PpcDq7"},
  "pppw4x": { longURL: "http://www.facebook.com", userID: "PpcDq7"},
};

let users = {
  "Rxj4l3": {
    id: "Rxj4l3",
    username: "Joel",
    email: "embiid@sixers.com",
    password: "joel21"
  },
  "lw2c49": {
    id: "lw2c49",
    username: "Ben",
    email: "simmons@sixers.com",
    password: "ben25"
  },
  "PpcDq7": {
    id: "PpcDq7",
    username: "Ja",
    email: "morant@grizzlies.com",
    password: "ja12"
  }
}

const bodyParser = require("body-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

const generateRandomString = function() {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//
// GET requests
//
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/home", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_home", templateVars);
  console.log(users);
});

app.get("/urls", (req, res) => {
  const userSpecificUrls = urlsForUser(req.cookies["user_id"], urlDatabase);
  const templateVars = { 
    urls: userSpecificUrls, 
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]] 
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    error: null
  }
  res.render("urls_register", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[`${req.params.shortURL}`].longURL;
  res.redirect(longURL);
});

app.get("/urls/shorturls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]] 
  }
  res.render("urls_shorturls", templateVars);
});

app.get("/urls/login", (req, res) => {
  const templateVars = {
    error: null,
    user: users[req.cookies["user_id"]]
  }
  res.render("urls_login", templateVars);
});
//
// POST requests
//
app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  urlDatabase[`${newShortURL}`] = { longURL: req.body.longURL, userID: req.cookies["user_id"] };
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[`${req.params.shortURL}`].longURL, 
    user: users[req.cookies["user_id"]] 
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.revisedLongURL;
  res.redirect("/urls")
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const username = req.body.username;
  if (username === "" || email === "" || password === "") {
    const errorMessage = "* fields cannot be left blank"
    const templateVars = {
      user: users[req.cookies["user_id"]], 
      error: errorMessage
    }
    res.render("urls_register", templateVars);
  }
  const { user, error } = validateUser(email, hashedPassword, users);
  if(user || error === "password") {
    const errorMessage = "* user already exists"
    const templateVars = {
      user: users[req.cookies["user_id"]], 
      error: errorMessage
    }
    res.render("urls_register", templateVars);
  } else {
    const newId = generateRandomString();
    const newUser = { "id": newId, "username": username, "email": email, "password": hashedPassword };
    users[newUser.id] = newUser;
    res.cookie("user_id", newUser.id);
    res.redirect("urls");
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { user, error } = validateUser(email, password, users);
  let errorMessage = "";
  if(user) {
    res.cookie("user_id", user.id);
    res.redirect("urls");
  } else { 
    if(error === "email") {
      errorMessage = "* email not found";
    } else if(error === "password") {
      errorMessage = "* password incorrect";
    }
    const templateVars = {
      user: users[req.cookies["user_id"]], 
      error: errorMessage
    }
    res.render("urls_login", templateVars);
  };
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls/login");
});


