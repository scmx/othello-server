(function () {

  var users = [];

  var nextId = 1;

  var User = function (opts) {
    opts = opts || {};
    this.nickname = opts.nickname
  };

  User.prototype.persist = function () {
    if (this.id) {
      if (user = User.find(this.id)) {
        user = this;
      }
    } else if (this.isValid()) {
      this.id = nextId++;
      users.push(this);
    }
  };

  User.prototype.isValid = function () {
    var user = User.findBy({ nickname: this.nickname });

    if (user) {
      return user.id == this.id;
    } else {
      return true;
    }
  };

  User.prototype.destroy = function () {
    if (this.id) {
      for (var n = 0; n < users.length; n++) {
        if (users[n].id == this.id) {
          users.splice(users.indexOf(users[n], 1));
        }
      }
    } else {
      throw { name: "NotFoundException",
              message: "Cannot destroy user without an id" };
    }
  };

  User.findBy = function (opts) {
    var user;
    for (var n = 0; n < users.length; n++) {
      var success = true;
      for (prop in opts) {
        if (!opts.hasOwnProperty(prop)) continue;
        if (users[n][prop] !== opts[prop]) {
          success = false;
          break;
        }
      }
      if (success) {
        user = users[n];
        break;
      }
    }
    return user;
  };

  User.findByNickname = function (nickname) {
    var user;
    for (var n = 0; n < users.length; n++) {
      if (users[n].nickname === nickname) {
        user = users[n];
        break;
      }
    }
    return user;
  };

  User.find = function (id) {
    var user;
    for (var n = 0; n < users.length; n++) {
      if (users[n].id === id) {
        user = users[n];
        break;
      }
    }
    return user;
  };

  User.deleteAll = function () {
    users = [];
    nextId = 1;
  };

  User.all = function () {
    return users;
  };

  if (module && module.exports) {
    module.exports = User;
  } else {
    this.User = User;
  }

})();
