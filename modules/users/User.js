'use strict';

/**
 * @description Class represent user
 * @constructor
 * @param {number} id        - Unique id of the user
 * @param {string} username  - The username or better the email
 * @param {string} password  - The password of the user
 * @param {string} firstName - First name
 * @param {string} lastName  - Last name
 * @throws Invalid Argument Supply
 */
module.exports.User = function(id, username, password, firstName, lastName) {
  if (typeof id === 'object') { // Initialize from object
    this.id = id.id;
    this.username = id.username;
    this.password = id.password;
    this.firstName = id.firstName;
    this.lastName = id.lastName;
  } else if (typeof id === 'number') { // Initialize from arguments
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  } else {
    throw new Error('Invalid Argument Supply For User Constructor');
  }
  /**
   * @method
   * @return {object}  user           - User object to store in the database
   * @property {number}  user.id        - Unique id of the user
   * @property {string}  user.username  - The username or better the email
   * @property {string}  user.password  - The password of the user
   * @property {string}  user.firstName - First name
   * @property {string}  user.lastName  - Last name
   */
  this.toObject = function() {
    return {
      'id': this.id,
      'username': this.username,
      'password': this.password,
      'firstName': this.firstName,
      'lastName': this.lastName
    };
  };
};
