const JWT = require("jsonwebtoken");

const secreteKey = ".adgjmptw@123";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profile: user.profileImageURL,
    role: user.role,
  };

  const token = JWT.sign(payload, secreteKey);

  return token;
}

function validateUser(token) {
  const user = JWT.verify(token, secreteKey);
  return user;
}

module.exports = {
  createTokenForUser,
  validateUser,
};
