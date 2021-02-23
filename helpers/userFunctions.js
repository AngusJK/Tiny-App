const validateUser = function(email, password, database) {
  const currentUser = database[email];
  if (currentUser) {
    if (currentUser.password === password) {
      return { user: currentUser, error: null };
    } else {
      return { user: null, error: "password" };
    }
  } else {
    return { user: null, error: "user" };
  }
};

module.exports = validateUser;