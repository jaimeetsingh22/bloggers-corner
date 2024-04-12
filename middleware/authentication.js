const { validateUser } = require("../services/authenticate");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName]; // ek se jada cookie bhi jaa sakta hai to uske liye array diya gaya hai
    if (!tokenCookieValue) return next();

    try {
      const userPayload = validateUser(tokenCookieValue);

      req.user = userPayload;
    } catch (error) {
      console.log(error);
    }

   return next();
  };
}

module.exports = { checkForAuthenticationCookie };
