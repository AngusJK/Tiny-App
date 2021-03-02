const { assert } = require('chai');

const { getUserByEmail, validateUser } = require('../helpers/userFunctions.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email and password', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.strictEqual(user.id, expectedOutput);
  });
  it('should return <undefined> if an email is not in the database', function() {
    const expectedOutput = undefined;
    assert.strictEqual(getUserByEmail("myfavouriteband@wutangclan.com", testUsers), expectedOutput);
  });
});

describe('validateUser', function() {
  it('should return email error if email not present in database', function() {
    const expectedOutput = { user: null, error: "email" };
    assert.deepEqual(validateUser("dracula@transylvania.com", "purple-monkey-dinosaur", testUsers), expectedOutput);
  });
  it('should return password error if email is present in database but password is incorrect', function() {
    const expectedOutput = { user: null, error: "password" };
    assert.deepEqual(validateUser("user@example.com", "iwanttosuckyourblood", testUsers), expectedOutput);
  });
});

