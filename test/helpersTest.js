const { assert } = require('chai');

const { validateUser } = require('../helpers/userFunctions.js');

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

