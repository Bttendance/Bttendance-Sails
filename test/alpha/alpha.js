'use strict';

var Sails = require('sails');
var assert = require('assert');
var request = require('supertest');
var querystring = require('querystring');
var passwordHash = require('password-hash');
var async = require('async');

var app;
var Baseurl;

// basic models
var userHH;
var schoolBT;
var courseBT;
var postAttd;
var postClick;
var postNoti;

// new models
var userTFA;

before(function (done) {

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
    // console.log(sails.config);

    async.series([
      // create device
      function (callback){
        Device.create({
          type: 'android',
          uuid: 'android_uuid'
        }).exec(callback);
      },
      // create user
      function (callback){
        User.create({
          username: 'heehwan',
          password: 'password',
          email: 'heehwan.park@bttendance.com',
          name: 'Hee Hwan Park',
          device: 1
        }).exec(callback);
      },
      // associate device - user
      function (callback){
        Device.update({ id: 1 }, { owner: 1 })
        .exec(callback);
      },
      // create school
      function (callback){
        Schools.create({
          name: 'Bttendance',
          website: 'http://www.bttendance.com',
          type: 'public'
        }).exec(callback);
      },
      // associate school - user
      function (callback){
        User
        .findOneById(1)
        .populate('employedSchools')
        .exec(function cb(err, user) {
          console.log(user.employedSchools);
          user.employedSchools.add(1);
          user.save(function cb(err, user) {
            callback ();
          });
        });
      },
      // create course
      function (callback){
        Course.create({
          name: 'Test Course',
          school: 1,
          professorName: 'Hee Hwan Park'
        }).exec(callback);
      },
      // get user
      function (callback){
        User
        .findOneById(1)
        .populate('device')
        .populate('supervisingCourses')
        .populate('attendingCourses')
        .populate('employedSchools')
        .populate('serials')
        .populate('enrolledSchools')
        .populate('identifications')
        .exec(callback);
      },
      // get school
      function (callback){
        Schools
        .findOneById(1)
        .populate('serials')
        .populate('courses')
        .populate('professors')
        .populate('students')
        .exec(callback);
      },
      // get course
      function (callback){
        Course
        .findOneById(1)
        .populate('posts')
        .populate('managers')
        .populate('students')
        .populate('school')
        .exec(callback);
      }
    ], function (err, results){
      userHH = results[6].toOldObject();
      schoolBT = results[7].toOldObject();
      courseBT = results[8].toOldObject();

      console.log(userHH);
      console.log(schoolBT);
      console.log(courseBT);

      done(err, sails);
    });
  });
});

describe('User', function (done) {

  // ####post : api/user/signup => UserJSON
  //     name
  //     username
  //     email
  //     password
  //     deviceType
  //     deviceUuid
  describe('#SignUp', function (done) {
    it('POST / should create an user', function (done) {

      var params = {};
      params.name = 'Tae Hwan Kim';
      params.username = 'TheFinestArtist';
      params.email = 'thefinestartist@bttendance.com';
      params.password = 'password';
      params.deviceType = 'iphone';
      params.deviceUuid = 'iphone_uuid';

      request(Baseurl).post('/api/user/signup/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.name, params.name);
        assert.equal(user.username, params.username);
        assert.equal(user.email, params.email);
        assert.ok(passwordHash.verify(params.password, user.password));
        assert.equal(user.deviceType, params.deviceType);
        assert.equal(user.deviceUuid, params.deviceUuid);

        done();
      });
    });
  });

  // ####get : api/user/auto/signin => UserJSON
  //     username
  //     password
  //     deviceUuid
  describe('#AutoSignIn', function (done) {
    it('GET / should return an user', function (done) {

      var params = {};
      params.username = 'TheFinestArtist';
      params.password = userTFA.password;
      params.deviceUuid = 'iphone_uuid';

      request(Baseurl).get('/api/user/auto/signin/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);

        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.deviceUuid, params.deviceUuid);

        done();
      });
    });
  });

  // ####get : api/user/signin => UserJSON
  //     username or email
  //     password (unhashed)
  //     deviceUuid
  describe('#SignIn', function (done) {
    it('GET / should return an user', function (done) {

      var params = {};
      params.username = 'TheFinestArtist';
      params.password = 'password';
      params.deviceUuid = 'iphone_uuid';

      request(Baseurl).get('/api/user/signin/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);

        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.ok(passwordHash.verify(params.password, user.password));
        assert.equal(user.deviceUuid, params.deviceUuid);

        done();
      });
    });
  });

  // ####put : api/user/forgot/password => UserJSON
  //     email
  describe('#ForgotPassword', function (done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.email = userTFA.email;

      request(Baseurl).put('/api/user/forgot/password/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.email, params.email);

        done();
      });
    });
  });

  // ####put : api/user/update/notificationKey => UserJSON
  //     user
  //     password
  //     deviceUuid
  //     notificationKey
  describe('#UpdateNotificationKey', function (done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;
      params.deviceUuid = userTFA.deviceUuid;
      params.notificationKey = 'notificationKey';

      request(Baseurl).put('/api/user/update/notificationKey/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.deviceUuid, params.deviceUuid);
        assert.equal(user.notificationKey, 'notificationKey');

        done();
      });
    });
  });

  // ####put : api/user/update/profile_image => UserJSON
  //     username
  //     password
  //     deviceUuid
  //     profileImage
  describe('#UpdateProfileImage', function (done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;
      params.deviceUuid = userTFA.deviceUuid;
      params.profileImage = 'profileImage';

      request(Baseurl).put('/api/user/update/profileImage/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.deviceUuid, params.deviceUuid);
        assert.equal(user.profileImage, 'profileImage');

        done();
      });
    });
  });

  // ####put : api/user/update/email => UserJSON
  //     username
  //     password
  //     deviceUuid
  //     email
  describe('#UpdateEmail', function (done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.user = userTFA.user;
      params.password = userTFA.password;
      params.deviceUuid = userTFA.deviceUuid;
      params.email = 'thefinestartist@bttendance.com';

      request(Baseurl).put('/api/user/update/email/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.deviceUuid, params.deviceUuid);
        assert.equal(user.email, 'thefinestartist@bttendance.com');

        done();
      });
    });
  });

  // ####put : api/user/update/name => UserJSON
  //     username
  //     password
  //     deviceUuid
  //     name
  describe('#UpdateName', function (done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;
      params.deviceUuid = userTFA.deviceUuid;
      params.name = 'Tae Hwan Kim';

      request(Baseurl).put('/api/user/update/name/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.deviceUuid, params.deviceUuid);
        assert.equal(user.name, 'Tae Hwan Kim');

        done();
      });
    });
  });

  // ####get : api/user/feed => PostJSON LIST
  //     username
  //     password
  //     page
  describe('#Feed', function (done) {
    it('GET / should return an all posts', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;

      request(Baseurl).get('/api/user/feed/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);
        done();
      });
    });
  });

  // ####get : api/user/courses => CourseJSON LIST + grade (integer percent)
  //     username
  //     password
  describe('#Course', function (done) {
    it('GET / should return an all courses', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;

      request(Baseurl).get('/api/user/courses/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);
        done();
      });
    });
  });

  // ####get : api/user/schools => SchoolJSON LIST
  //     username
  //     password
  describe('#Schools', function (done) {
    it('GET / should return an all schools', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;

      request(Baseurl).get('/api/user/schools/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);
        done();
      });
    });
  });

  // ####put : api/user/attend/course => UserJSON
  //     username
  //     password
  //     courseId
  describe('#Attend Course', function (done) {
    it('GET / should return an user with new course', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;

      request(Baseurl).get('/api/user/schools/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function (err, res) {
        if (err) throw(err);
        done();
      });
    });
  });

});

after(function (done) {
  app.lower(done);
});
