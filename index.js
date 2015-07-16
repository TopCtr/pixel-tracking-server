// vendor libraries
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


// custom libraries
var utils = require('./modules/utils');
// routes
var route = require('./modules/route');
// model
var UserFinder = require('./modules/model').UserFinder;

var app = express();

passport.use(new LocalStrategy(function(username, password, done) {
  console.log('jj  kkk ll');

  new UserFinder(username).then(function(user) {
    if (user === null) {
      return done(null, false, {
        message: 'Invalid username or password'
      });
    } else {
      debugger;
      // if (!bcrypt.compareSync(password, user.password)) {
      if (password !== user.password) {
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

// GET
app.get('/', route.index);

// signin
// GET
app.get('/login', route.signIn);
// POST
app.post('/login', route.signInPost);

// signup
// GET
app.get('/register', route.signUp);
// POST
app.post('/register', route.signUpPost);

// logout
// GET
app.get('/signout', route.signOut);

/********************************/

/********************************/
// 404 not found
app.use(route.notFound404);

var server = app.listen(app.get('port'), function(err) {
  if (err) throw err;

  var message = 'Server is running @ http://localhost:' + server.address().port;
  console.log(message);
});
