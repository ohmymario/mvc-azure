// Middleware / Checking if the user is online

module.exports = {
  // Check if auth with isAuthenticated()
  // Check for token in the request
  // FOR LOGGED IN PROTECTED ROUTES
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      // if success then go next()
      return next();
    } else {
      // if no auth (token)
      // redirect to the homepage
      res.redirect("/");
    }
  },
  // FOR GUEST ROUTES
  ensureGuest: function (req, res, next) {
    // Check for no (token)
    if (!req.isAuthenticated()) {
      // if no token then go next()
      return next();
    } else {
      // else redirect to the logged in dashboard
      res.redirect("/dashboard");
    }
  },
};
