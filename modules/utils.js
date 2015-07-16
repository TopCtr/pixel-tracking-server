'use strict';
var bCrypt = require('../node_modules/bcrypt-nodejs');

/**
 * @description Generates hash using {@link https://github.com/shaneGirish/bcrypt-nodejs bCrypt}
 * @param {string} password - to be encrypted
 * @return {string} encrypted password
 */
module.exports.createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

/**
 * @description Compare whether the user's password and encrypted forms are match
 * @param {object} user - user with password to compare
 * @param {string} password - password to be compared to
 * @return {boolean}
 */
module.exports.isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.password);
};

/**
 * @description Generate random numbers that look like GUIDs.<br>
 * GUID is an acronym for 'Globally Unique Identifier' or 'Universally Unique Identifier'
 * @return {string}
 * @see http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
module.exports.genUuid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};
