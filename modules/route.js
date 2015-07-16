// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');


// custom library
// model
var Model = require('./model');

// index
var index = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/signin');
  } else {
    debugger;
    var user = req.user;

    if (user !== undefined) {
      //  user = user.toJSON();
    }
    res.render('index', {
      title: 'Home',
      user: user,
      current: 'home'
    });
  }
};

// sign in
// GET
var signIn = function(req, res, next) {
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
var signInPost = function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }, function(err, user, info) {
    if (err) {
      return res.render('users/login', {
        title: 'Sign In',
        current: 'login',
        errorMessage: err.message
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
  debugger;
  var usernamePromise = new Model.UserFinder(user.username);
  //usernamePromise = new Model.User({username: user.username}).fetch();

  return usernamePromise.then(function(model) {
    if (model) {
      res.render('signup', {
        title: 'signup',
        current: 'register',
        errorMessage: 'username already exists'
      });
    } else {
      //****************************************************//
      // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
      //****************************************************//
      var password = user.password;
      var hash = bcrypt.hashSync(password);

      var signUpUser = new Model.UserAdder({
        username: user.username,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName
      });
      signUpUser.then(function(model) {
        // sign in the newly registered user
        signInPost(req, res, next);
      });
    }
  });
};

// sign out
var signOut = function(req, res, next) {
  if (!req.isAuthenticated()) {
    notFound404(req, res, next);
  } else {
    req.logout();
    res.redirect('/signin');
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
module.exports.signIn = signIn;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;
