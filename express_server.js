const express = require('express')
const app = express()
const PORT = 8080
const bcrypt = require('bcrypt')
const cookieSession = require('cookie-session')
// const bodyParser = require('body-parser')
const { validateUser, urlsForUser, generateRandomString } = require('./helpers/userFunctions')

app.set('view engine', 'ejs')

const urlDatabase = {
  b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userID: 'Rxj4l3' },
  sgq3y6: { longURL: 'http://www.google.com', userID: 'Rxj4l3' },
  d9Kled: { longURL: 'http://www.github.com', userID: 'lw2c49' },
  MRj39d: { longURL: 'http://www.youtube.com', userID: 'lw2c49' },
  eMbEj2: { longURL: 'http://www.wikipedia.org', userID: 'PpcDq7' },
  pppw4x: { longURL: 'http://www.facebook.com', userID: 'PpcDq7' }
}

const users = {
  d9rjdl: {
    id: 'd9rjdl',
    username: 'Albert',
    email: 'albert@einstein.com',
    password: '$2b$10$NdqA2jc.XBuxVtZzP2crcev4I4JeSZ7UUjPqlYBkm.4d131WN7iaW'
  },
  Apkda2: {
    id: 'Apkda2',
    username: 'Marie',
    email: 'marie@curie.com',
    password: '$2b$10$UxHU8ShE8.rC3JHehXTcte9uR0JyiumLSbA2ExeMvjRYwt986w5lG'
  },
  Tlqsaa: {
    id: 'Tlqsaa',
    username: 'Enrico',
    email: 'enrico@fermi.com',
    password: '$2b$10$tIrseJky.Wgp5dj39/lEdOifoujOJe19mPqeBCX1nNU/eVpOlmocW'
  }
}

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(express.urlencoded())

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase)
})

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n')
})

// home page
app.get('/home', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  }
  res.render('urls_home', templateVars)
})

// diplays URLs for logged in user
app.get('/urls', (req, res) => {
  const userSpecificUrls = urlsForUser(req.session.user_id, urlDatabase)
  const templateVars = {
    urls: userSpecificUrls,
    user: users[req.session.user_id]
  }
  res.render('urls_index', templateVars)
})

// create a new URL
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  }
  res.render('urls_new', templateVars)
})

// user registration page
app.get('/urls/register', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    error: null
  }
  res.render('urls_register', templateVars)
})

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[`${req.params.shortURL}`].longURL
  res.redirect(longURL)
})

app.get('/urls/shorturls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  }
  res.render('urls_shorturls', templateVars)
})

// user login page
app.get('/urls/login', (req, res) => {
  const templateVars = {
    error: null,
    user: users[req.session.user_id]
  }
  res.render('urls_login', templateVars)
})

app.post('/urls', (req, res) => {
  const newShortURL = generateRandomString()
  urlDatabase[`${newShortURL}`] = { longURL: req.body.longURL, userID: req.session.user_id }
  res.redirect('/urls')
})

// edit a URL
app.post('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[`${req.params.shortURL}`].longURL,
    user: users[req.session.user_id]
  }
  res.render('urls_show', templateVars)
})

// delete a URL
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
})

app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL
  urlDatabase[shortURL].longURL = req.body.revisedLongURL
  res.redirect('/urls')
})

// user registration verification
app.post('/register', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const hashedPassword = bcrypt.hashSync(password, 10)
  const username = req.body.username
  if (username === '' || email === '' || password === '') {
    const errorMessage = '* fields cannot be left blank'
    const templateVars = {
      user: users[req.session.user_id],
      error: errorMessage
    }
    res.render('urls_register', templateVars)
  }
  const { user, error } = validateUser(email, hashedPassword, users)
  if (user || error === 'password') {
    const errorMessage = '* user already exists'
    const templateVars = {
      user: users[req.session.user_id],
      error: errorMessage
    }
    res.render('urls_register', templateVars)
  } else {
    const newId = generateRandomString()
    const newUser = { id: newId, username: username, email: email, password: hashedPassword }
    users[newUser.id] = newUser
    req.session.user_id = newId
    res.redirect('urls')
  }
})

// user login verification
app.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const { user, error } = validateUser(email, password, users)
  let errorMessage = ''
  if (user) {
    req.session.user_id = user.id
    res.redirect('urls')
  } else {
    if (error === 'email') {
      console.log('error: email')
      errorMessage = '* email not found'
    } else if (error === 'password') {
      console.log('error: password')
      errorMessage = '* password incorrect'
    }
    const templateVars = {
      user: users[req.session.user_id],
      error: errorMessage
    }
    res.render('urls_login', templateVars)
  }
})

// logout user
app.post('/logout', (req, res) => {
  req.session = null
  res.redirect('/urls/login')
})
