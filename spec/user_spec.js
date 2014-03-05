var User = require('../lib/user');

describe("User", function () {
  var user;

  beforeEach(function () {
    user = new User;
  });

  describe("new", function () {
    it("has a nickname", function () {
      user = new User({ nickname: 'Albert' });
      expect(user.nickname).toBe('Albert');
    });
  });

  describe("#isValid()", function () {
    beforeEach(function () {
      User.deleteAll();
      new User({ nickname: 'Albert' }).persist();
      user = new User({ nickname: 'Albert' });
    });

    it("wont be valid", function () {
      expect(user.isValid()).toBe(false);
    });
  });

  describe("#persist()", function () {
    beforeEach(function () {
      User.deleteAll();
      user = new User({ nickname: 'Albert' });
    });

    it("recieves an id", function () {
      user.persist();
      expect(user.id).toBe(1);
    });

    it("wont persist duplicate", function () {
      user.persist();
      user = new User({ nickname: 'Albert' });
      user.persist();
      expect(user.id).toBeUndefined();
    });

    it("recieves an increasing id", function () {
      user.persist();
      user = new User({ nickname: 'Alfred' })
      user.persist();
      expect(user.id).toBe(2);
    });

    it("can update an already persisted user", function () {
      user.persist();
      user.persist();
    });
  });

  describe("#destroy()", function () {
    beforeEach(function () {
      User.deleteAll();
      user = new User({ nickname: 'Albert' });
    });

    it("must destroy", function () {
      user.persist();
      user.destroy();
      expect(User.findBy({ id: 1 })).toBeUndefined();
    });

    it("throws expection when not persisted", function () {
      expect(user.destroy).toThrow();
    });
  });

  describe(".findByNickname()", function () {
    beforeEach(function () {
      new User({ nickname: 'Albert' }).persist();
      user = User.findByNickname('Albert');
    });

    it("is defined", function () {
      expect(user).toBeDefined();
    });
  });

  describe(".findBy()", function () {
    beforeEach(function () {
      new User({ nickname: 'Albert' }).persist();
    });

    it("finds by id", function () {
      expect(User.findBy({ id: 1 })).toBeDefined();
    });

    it("finds by nickname", function () {
      expect(User.findBy({ nickname: 'Albert' })).toBeDefined();
    });
  });

  describe(".find()", function () {
    beforeEach(function () {
      new User({ nickname: 'Albert' }).persist();
      user = User.find(1);
    });

    it("is defined", function () {
      expect(User).toBeDefined();
    });
  });
});
