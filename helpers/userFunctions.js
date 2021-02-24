const validateUser = function(id, password, database) {
  const currentUser = database[id];
  if (currentUser) {
    if (currentUser.password === password) {
      return { user: currentUser, error: null };
    } else {
      return { user: null, error: "password" };
    }
  } else {
    return { user: null, error: "id" };
  }
};

const findUser = function(email, database) {
  let response = false
  for (let user in database) {
    if (database[user].email === email) {
      response = true
    } 
  }
  return response
}

module.exports = { validateUser, findUser };