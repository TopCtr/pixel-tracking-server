'use strict';
var fs = require('fs');
var debug = require('debug')('fileDb');
var User = require('./User');

/**
 * @description Very simple storage - file base database
 * @requires fs
 * @requires User
 * @module modules/fileDb
 */

/**
 * @private
 * @type {string}
 **/
var filePath = './users.db';
/**
 * @private
 * @type {array<object>}
 **/
var data = [];

/**
 * @description Return the highest id on the database
 * @method
 * @return {number}
 */
module.exports.highestId = function() {
  var id = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id > id) {
      id = data[i].id;
    }
  }
  return id;
};

/**
 * @description Find user by id
 * @param {number} id - id to find by
 * @param {userCallback} fn - A callback to run.
 * @method
 * @TODO Can I remove it>
 **/
module.exports.findById = function(id, fn) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return fn(null, data[i]);
    }
  }
  fn(new Error('User ' + id + ' does not exist'));
};
/**
 * @description Callback with user object
 * @callback userCallback
 * @param {object|null} error - Something other than null means you have an error
 * @param {object} user - User object
 */



/**
 * @description Find user by username
 * @param {string} username - username to find by
 * @return {User|null}
 **/
module.exports.findByUsername = function(username) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].username === username) {
      return new User.User(data[i]);
    }
  }
  return null;
};





module.exports.add = function(usr) {
  if (!(usr instanceof User.User)) {
    throw new Error('usr must be instance of User class');
  }
  data.push(usr.toObject());
  flush();
  return data.length;
};

module.exports.del = function(num) {
  data.splice(num, 1);
  flush();
  return data.length;
};

/**
 * @private
 */
function flush() {
  fs.writeFileSync(filePath, JSON.stringify(data));
}

/**
 * @private
 */
function load() {
  data = JSON.parse(fs.readFileSync(filePath).toString());
}


process.on('exit', function() {
  flush();
});


if (fs.existsSync(filePath)) { // Load if the file is there
  console.log('Loading ' + filePath);
  debug('Loading ' + filePath);
  load();
} else { // Otherwise, create it.
  console.log(filePath + ' Not exists - create it');
  debug(filePath + ' Not exists - create it');
  flush();
}
