module.exports = {
  User: function(argument) {
    var username = argument.username;
    var user = {
      username: username,
      password: 'a'
    }
    this.then = function(cb) {
      cb(user);
    }
    this.toJSON = function() {
      return JSON.stringify({
        username: username,
        password: 'a'
      });
    }
  }
};
