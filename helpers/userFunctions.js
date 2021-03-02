const bcrypt = require("bcrypt");

const generateRandomString = function() {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

const validateUser = function(email, password, database) {
  let response = { user: null, error: "email" }
  for (let user in database) {
    if (database[user].email === email) {
      if (bcrypt.compareSync(password, database[user].password)) {
        response.user = database[user];
        response.error = null;
      } else {
        response.error = "password";
      }
    } 
  }
  return response 
};

const urlsForUser = function(id, database) {
  const myUrls = {};
  for (let url in database) {
   if(database[url].userID === id) {
    myUrls[url] = database[url];
   }
  }
  return myUrls;
};

module.exports = { validateUser, urlsForUser, generateRandomString };