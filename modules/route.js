'use strict';
var passport = require('passport');

var Model = require('./users/model');
var utils = require('./utils');

// index
var index = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    // debugger;
    var user = req.user;

    res.render('index', {
      title: 'Home',
      user: user,
      current: 'home'
    });
  }
};

// sign in
// GET
var logIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('users/login', {
    title: 'Sign In',
    current: 'login'
  });
};

// sign in
// POST
var logInPost = function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }, function(err, user, info) {
    if (err || info) {
      return res.render('users/login', {
        title: 'Sign In',
        current: 'login',
        errorMessage: (err !== null) ? err.message : info.message
      });
    }

    if (!user) {
      return res.render('users/login', {
        title: 'Sign In',
        current: 'login',
        errorMessage: info.message
      });
    }
    return req.logIn(user, function(err) {
      if (err) {
        return res.render('users/login', {
          title: 'Sign In',
          current: 'login',
          errorMessage: err.message
        });
      } else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
};

// sign up
// GET
var signUp = function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('users/register', {
      title: 'Sign Up',
      current: 'register'
    });
  }
};

// sign up
// POST
var signUpPost = function(req, res, next) {
  var user = req.body;
  // debugger;
  var usernamePromise = new Model.UserFinder(user.username);

  return usernamePromise.then(function(model) {
    if (model) {
      res.render('signup', {
        title: 'signup',
        current: 'register',
        errorMessage: 'username already taken'
      });
    } else {
      //****************************************************//
      // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
      //****************************************************//
      var hash = utils.createHash(user.password); // Hash with salt

      var signUpUser = new Model.UserAdder({
        username: user.username,
        password: hash,
        firstName: user.firstName,
        lastName: user.lastName
      });
      signUpUser.then(function(model) {
        // sign in the newly registered user
        logInPost(req, res, next);
      });
    }
  });
};

// sign out
var logOut = function(req, res, next) {
  if (!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
    req.logout();
    res.redirect('/login');
  }
};

// 404 not found
var notFound404 = function(req, res, next) {
  res.status(404);
  res.render('404', {
    title: '404 Not Found'
  });
};

// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET
module.exports.logIn = logIn;
// POST
module.exports.logInPost = logInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.logOut = logOut;

// 404 not found
module.exports.notFound404 = notFound404;
