'use strict';
var fileDb = require('./fileDb');
var User = require('./User');
/**
 * @description Module to manage users within file base database.
 * @constructor
 * @requires User
 * @requires fileDb
 */


module.exports.UserFinder = function(username) {
  var user = fileDb.findByUsername(username);
  this.then = function(cb) {
    cb(user);
  };
};


module.exports.UserAdder = function(user) {
  var highestId = fileDb.highestId();
  debugger;
  var u = new User.User(highestId + 1, user.username, user.password, user.firstName, user.lastName);
  fileDb.add(u);
  return {
    then: function(cb) {
      cb(u);
    }
  };
};
