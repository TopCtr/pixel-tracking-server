'use strict';
var fileDb = require('./fileDb');
var User = require('./User');

module.exports.UserFinder = function(username) {
  var user = fileDb.findByUsername(username);

  this.then = function(cb) {
    cb(user);
  };

  this.toJSON = function() {
    return JSON.stringify({
      username: username,
      password: 'a'
    });
  };
};



module.exports.UserAdder = function(user) {
  var highestId = fileDb.highestId();
  debugger;
  var u = new User.User(highestId + 1, user.username, user.password, user.firstName, user.lastName);
  fileDb.add(u);
  return {
    then: function (cb) {
        cb(u);
    }
  };
};
