/** ** MODULE TO HOLD HELPER FUNCTIONS  - helpers.js ** */


/** Function generates new shortURls (6 characters in length) */
const generateRandomString = function() {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) { 
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


/** Finds a user by email in the users object otherwise null  */
function getUserByEmail(email, users) {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};


/** Filters and returns object with URLs associated to user ID */
function urlsForUser(id, urlDatabase) {
  const filteredURL = {};
  for (const urlId in urlDatabase) {
    if (urlDatabase[urlId].userId === id) {
      filteredURL[urlId] = urlDatabase[urlId];
    }
  }
  return filteredURL;
}

/** Export helper functions */
module.exports = { generateRandomString, getUserByEmail, urlsForUser };