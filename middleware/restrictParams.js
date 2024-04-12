function RestrictUserToVisiteRouteAfterLogIn() {
  return (req, res, next) => {
    if ( req.path === "/user/signin") {
      if (!req.cookies.token) return next();
      return res.redirect("/");
    }

    if(req.path === "/user/signup"){
        if(!req.cookies.token)  return next();

        return res.redirect('/');
    }

    next();
  };
}


module.exports = {
    RestrictUserToVisiteRouteAfterLogIn
}
 