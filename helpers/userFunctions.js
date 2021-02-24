const validateUser = function(email, password, database) {
  let response = { user: null, error: "email" }

  for (let user in database) {
    console.log(user);
    if (database[user].email === email) {
      if (database[user].password === password) {
        response.user = database[user];
        response.error = null;
      } else {
        response.error = "password";
      }
    } 
  }
  return response 
};

const findUser = function(email, database) {
  let response = false
  for (let user in database) {
    if (database[user].email === email) {
      response = true
    } 
  }
  return response
};

module.exports = { validateUser, findUser };