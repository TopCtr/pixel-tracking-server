"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ejs = require('ejs');
var engine = require('ejs-locals');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var colors = require('colors');


var utils = require('./modules/utils');
var route = require('./modules/route');
var UserFinder = require('./modules/users/model').UserFinder;

var app = express();

passport.use(new LocalStrategy(function(username, password, done) {
  console.log('LocalStrategy');

  new UserFinder(username).then(function(user) {
    if (user === null) {
      return done(null, false, {
        message: 'Invalid username or password'
      });
    } else {
      if (!utils.isValidPassword(user, password)) {
        return done(null, false, {
          message: 'Invalid username or password'
        });
      } else {
        return done(null, user);
      }
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  new UserFinder(username).then(function(user) {
    done(null, user);
  });
});


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

/** Sets default public directory */
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(session({
  genid: function(req) {
    return utils.genUuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());


//Sending the pixel
app.get('/JKSBTUS/:brand/:action/:gclid', function(req, response) {
  var brand = req.params.brand.toLowerCase();
  var action = req.params.action.toLowerCase();
  var gclid = req.params.gclid;


  if (action !== 'signup' && action !== 'deposit') {
    response.setHeader('Content-Type', 'text/html');
    response.writeHead(response.statusCode);
    response.status(500);
    response.write('Error - Malformed url');
    response.end();
    return;
  }

  var pixelOptions = {
    root: __dirname + '/public/images/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  response.sendFile('p.gif', pixelOptions
  // ,function(err){if(err){console.log(err);response.status(err.status).end();}else{console.log('Sent: p.gif');}}
  );

});

// GET
app.get('/', route.index);

// logIn
// GET
app.get('/login', route.logIn);
// POST
app.post('/login', route.logInPost);

// signup
// GET
app.get('/register', route.signUp);
// POST
app.post('/register', route.signUpPost);

// logout
// GET
app.get('/logout', route.logOut);
app.get('/account', route.account);


// 404 not found
app.use(route.notFound404);

var server = app.listen(app.get('port'), function(err) {
  if (err)
    throw err;

  var message = 'Server is running @ http://localhost:' + server.address().port;
  console.log(message.green);
});
