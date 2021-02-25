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

const urlsForUser = function(id, database) {
  console.log(id);
  console.log(database);
  const myUrls = {};
  for (let url in database) {
   if(database[url].userID === id) {
    myUrls[url] = database[url];
   }
  }
  return myUrls;
};

module.exports = { validateUser, urlsForUser };