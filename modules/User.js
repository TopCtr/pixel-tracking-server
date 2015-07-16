'use strict';

/**
 * @description Module to manage authentication and users with file base database.
 * User object to store in the database
 * @constructor
 * @param {number} user.id        - Unique id of the user
 * @param {string} user.username  - The username or better the email
 * @param {string} user.password  - The password of the user
 * @param {string} user.firstName - First name
 * @param {string} user.lastName  - Last name
 */
module.exports.User = function(id, username, password, firstName, lastName) {
  if (typeof id === 'object') {
    this.id = id.id;
    this.username = id.username;
    this.password = id.password;
    this.firstName = id.firstName;
    this.lastName = id.lastName;
  } else if (typeof id === 'number') {
    this.id = id;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  } else {
    throw new Error('Invalid Argument Supply For User Constructor');
  }

  this.toObject = function() {
    return {
      'id': this.id,
      'username': this.username,
      'password': this.password,
      'firstName': this.firstName,
      'lastName': this.lastName
    }
  }
}
