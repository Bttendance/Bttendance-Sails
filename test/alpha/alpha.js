
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
 
before(function(done) {

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

  }, function(err, sails) {
    app = sails;
    Baseurl = sails.getBaseurl();
    // console.log(sails.config);

    async.series([
      // create device
      function(callback){
        Devices.create({
          type: 'android',
          uuid: 'android_uuid'
        }).exec(callback);
      },
      // create user
      function(callback){
        Users.create({
          username: 'heehwan',
          password: 'password',
          email: 'heehwan.park@bttendance.com',
          full_name: 'Hee Hwan Park',
          device: 1     
        }).exec(callback);
      },
      // associate device - user
      function(callback){
        Devices.update({ id: 1 }, { owner: 1 })
        .exec(callback);
      },
      // create school
      function(callback){
        Schools.create({
          name: 'Bttendance',
          website: 'http://www.bttendance.com',
          type: 'public'
        }).exec(callback);
      },
      // associate school - user
      function(callback){
        Users
        .findOneById(1)
        .populate('employed_schools')
        .exec(function cb(err, user) {
          console.log(user.employed_schools);
          user.employed_schools.add(1);
          user.save(function cb(err, user) {
            callback();
          });
        });
      },
      // create course
      function(callback){
        Courses.create({
          name: 'Test Course',
          school: 1,
          professor_name: 'Hee Hwan Park'
        }).exec(callback);
      },
      // get user
      function(callback){
        Users
        .findOneById(1)
        .populate('device')
        .populate('supervising_courses')
        .populate('attending_courses')
        .populate('employed_schools')
        .populate('serials')
        .populate('enrolled_schools')
        .populate('identifications')
        .exec(callback);
      },
      // get school
      function(callback){
        Schools
        .findOneById(1)
        .populate('serials')
        .populate('courses')
        .populate('professors')
        .populate('students')
        .exec(callback);
      },
      // get course
      function(callback){
        Courses
        .findOneById(1)
        .populate('posts')
        .populate('managers')
        .populate('students')
        .populate('school')
        .exec(callback);
      }
    ], function(err, results){  
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

describe('User', function(done) {

  // ####post : api/user/signup => UserJSON
  //     full_name
  //     username
  //     email
  //     password
  //     device_type
  //     device_uuid
  describe('#SignUp', function(done) {
    it('POST / should create an user', function (done) {

      var params = {};
      params.full_name = 'Tae Hwan Kim';
      params.username = 'TheFinestArtist';
      params.email = 'thefinestartist@bttendance.com';
      params.password = 'password';
      params.device_type = 'iphone';
      params.device_uuid = 'iphone_uuid';

      request(Baseurl).post('/api/user/signup/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.full_name, params.full_name);
        assert.equal(user.username, params.username);
        assert.equal(user.email, params.email);
        assert.ok(passwordHash.verify(params.password, user.password));
        assert.equal(user.device_type, params.device_type);
        assert.equal(user.device_uuid, params.device_uuid);

        done();
      });
    });
  });

  // ####get : api/user/auto/signin => UserJSON
  //     username
  //     password
  //     device_uuid
  describe('#AutoSignIn', function(done) {
    it('GET / should return an user', function (done) {

      var params = {};
      params.username = 'TheFinestArtist';
      params.password = userTFA.password;
      params.device_uuid = 'iphone_uuid';

      request(Baseurl).get('/api/user/auto/signin/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);

        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.device_uuid, params.device_uuid);

        done();
      });
    });
  });

  // ####get : api/user/signin => UserJSON
  //     username or email
  //     password (unhashed)
  //     device_uuid
  describe('#SignIn', function(done) {
    it('GET / should return an user', function (done) {

      var params = {};
      params.username = 'TheFinestArtist';
      params.password = 'password';
      params.device_uuid = 'iphone_uuid';

      request(Baseurl).get('/api/user/signin/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);

        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.ok(passwordHash.verify(params.password, user.password));
        assert.equal(user.device_uuid, params.device_uuid);

        done();
      });
    });
  });

  // ####put : api/user/forgot/password => UserJSON
  //     email
  describe('#ForgotPassword', function(done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.email = userTFA.email;

      request(Baseurl).put('/api/user/forgot/password/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.email, params.email);

        done();
      });
    });
  });

  // ####put : api/user/update/notification_key => UserJSON
  //     username
  //     password
  //     device_uuid
  //     notification_key
  describe('#UpdateNotificationKey', function(done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;
      params.device_uuid = userTFA.device_uuid;
      params.notification_key = 'notification_key';

      request(Baseurl).put('/api/user/update/notification_key/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.device_uuid, params.device_uuid);
        assert.equal(user.notification_key, 'notification_key');

        done();
      });
    });
  });

  // ####put : api/user/update/profile_image => UserJSON
  //     username
  //     password
  //     device_uuid
  //     profile_image
  describe('#UpdateProfileImage', function(done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;
      params.device_uuid = userTFA.device_uuid;
      params.profile_image = 'profile_image';

      request(Baseurl).put('/api/user/update/profile_image/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.device_uuid, params.device_uuid);
        assert.equal(user.profile_image, 'profile_image');

        done();
      });
    });
  });

  // ####put : api/user/update/email => UserJSON
  //     username
  //     password
  //     device_uuid
  //     email
  describe('#UpdateEmail', function(done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;
      params.device_uuid = userTFA.device_uuid;
      params.email = 'thefinestartist@bttendance.com';

      request(Baseurl).put('/api/user/update/email/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.device_uuid, params.device_uuid);
        assert.equal(user.email, 'thefinestartist@bttendance.com');

        done();
      });
    });
  });

  // ####put : api/user/update/full_name => UserJSON
  //     username
  //     password
  //     device_uuid
  //     full_name
  describe('#UpdateFullName', function(done) {
    it('PUT / should return an user', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;
      params.device_uuid = userTFA.device_uuid;
      params.full_name = 'Tae Hwan Kim';

      request(Baseurl).put('/api/user/update/full_name/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);

        userTFA = JSON.parse(res.text);
        var user = JSON.parse(res.text);
        assert.equal(user.username, params.username);
        assert.equal(user.password, params.password);
        assert.equal(user.device_uuid, params.device_uuid);
        assert.equal(user.full_name, 'Tae Hwan Kim');

        done();
      });
    });
  });

  // ####get : api/user/feed => PostJSON LIST
  //     username
  //     password
  //     page
  describe('#Feed', function(done) {
    it('GET / should return an all posts', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;

      request(Baseurl).get('/api/user/feed/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);
        done();
      });
    });
  });

  // ####get : api/user/courses => CourseJSON LIST + grade (integer percent)
  //     username
  //     password
  describe('#Courses', function(done) {
    it('GET / should return an all courses', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;

      request(Baseurl).get('/api/user/courses/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);
        done();
      });
    });
  });

  // ####get : api/user/schools => SchoolJSON LIST
  //     username
  //     password
  describe('#Schools', function(done) {
    it('GET / should return an all schools', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;

      request(Baseurl).get('/api/user/schools/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);
        done();
      });
    });
  });

  // ####put : api/user/attend/course => UserJSON
  //     username
  //     password
  //     course_id
  describe('#Attend Course', function(done) {
    it('GET / should return an user with new course', function (done) {

      var params = {};
      params.username = userTFA.username;
      params.password = userTFA.password;

      request(Baseurl).get('/api/user/schools/?' + querystring.stringify(params))
      .expect('Content-Type', /json/)
      .expect(200).end(function(err, res) {
        if (err) throw(err);
        done();
      });
    });
  });

});

after(function(done) {
  app.lower(done);
});
