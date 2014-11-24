'use strict';

/**
 * Bootstrap
 */

var Sails = require('sails');
var assert = require('assert');
var request = require('supertest');

/**
 * Before ALL the test bootstrap the server
 */

var app;
var Baseurl;

before(function (done) {

  // TODO: Create the database
  // Database.createDatabase.....

  Sails.lift({

    port: 1338,

    log: {
      level: 'error'
    },

    connections: {
      default: 'main',
      main: {
        adapter: 'sails-memory'
      }
    },

    models: {
      connection: 'main',
      migrate: 'safe'
    },

    hooks: {
      grunt: false
    }

  }, function (err, sails) {
    app = sails;
    Baseurl = sails.getBaseurl();
    done(err, sails);
  });

});


describe('Basic', function (done) {
  it("should cause error", function (done) {
    assert.notEqual(1, 2, "error");
    done();
  });
});

describe('User', function (done) {
  it("should be able to create", function (done) {
    User.create({username: "heeheee", password: "asdfasdf", name: "heeheee", email: "a@b.c"}, function (err, user) {
      assert.notEqual(user, undefined);
      done();
    });
  });
});

describe('Routes', function (done) {
  it('GET / should return 200', function (done) {
    request(Baseurl).get('/api/users').expect(200, function (err) {
      if (err) throw(err);
      done();
    });
  });
});

/**
 * After ALL the tests, lower sails
 */
after(function (done) {
  // TODO: Clean up db
  // Database.clean...

  app.lower(done);
});
