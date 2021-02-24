const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const { validateUser, findUser } = require("./helpers/userFunctions");

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  urlDatabase[`${newShortURL}`] = req.body.longURL;
  const templateVars = { 
    shortURL: newShortURL, 
    longURL: urlDatabase[`${newShortURL}`], 
    user: users[req.cookies["user_id"]] 
  };
  res.render("urls_show", templateVars);
});

//
// DELETE
//
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
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
    user: users[req.cookies["user_id"]] 
  }
  res.render("urls_register", templateVars);
});

//
// UPDATE
//
app.post("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[`${req.params.shortURL}`], 
    user: users[req.cookies["user_id"]] 
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[`${req.params.shortURL}`];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]] 
  }
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { user, error } = validateUser(email, password, users);
  if(user) {
    res.cookie("user_id", user.id);
    res.redirect("urls");
  } else {
    res.send(`There was an error of type ${error}.`);
    //res.end();
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.write("Status 400: Bad request. Fields cannot be empty.");
    res.end();
  }
  const userExists = findUser(email, users);
  console.log(userExists);
  if(userExists) {
    res.send("Status 400: Bad request. This user already exists.")
    res.end();
  } else {
    const newId = generateRandomString();
    const newUser = { "id": newId, "email": email, "password": password };
    users[newUser.id] = newUser;
    res.cookie("user_id", newUser.id);
    res.redirect("urls");
  }
});

