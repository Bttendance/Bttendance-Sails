/**
 * Notification.js
 *
 * @module			:: Json Handler
 * @description	:: Contains logic for notification JSON handling.
 *
 *  {
 *      "type": "type",
 *      "title" : "title",
 *      "message": "message"
 *  }
 */

var gcm = require('node-gcm');
var apn = require('apn');

// Function to get id list
// user.populate('device')
exports.send = function (user, title, message, type, courseId) {
  if (!user.device.notification_key)
    return;

  var locale = user.locale;
  if (!locale || locale != 'ko')
    locale = 'en';
  message = sails.__({ phrase: message, locale: locale });

  if (user.device.type == 'android') {

    var msg = new gcm.Message({
        collapseKey: 'bttendance',
        delayWhileIdle: false,
        timeToLive: 4,
        data: {
          type: type,
          courseId: courseId,
          title: title,
          message: message
        }
    });

    var registrationIds = [];
    registrationIds.push(user.device.notification_key);

    var sender;
    // if (process.env.NODE_ENV == 'development')
    //  	sender = new gcm.Sender('AIzaSyCqiq_YpGtSzIi7lr5SGcL5a74nJxm6K3o');
    // else
       sender = new gcm.Sender('AIzaSyByrjmrKWgg1IvZhFZspzYVMykKHaGzK0o');

    sender.send(msg, registrationIds, 4, function (err, result) {
      if (err)
        console.log(err);
      else
        console.log("Android notification has been sent to " + user.fullName + " (" + user.email + ")");
    });

  } else if (user.device.type == 'iphone') {

    var options;
    if (process.env.NODE_ENV == 'development') {
      options = { cert: './assets/certification/cert_development.pem',
                  certData: null,
                  key: './assets/certification/key_development.pem',
                  keyData: null,
                  // passphrase: "bttendance",
                  ca: null,
                  gateway: "gateway.sandbox.push.apple.com",
                  port: 2195,
                  enhanced: true,
                  errorCallback: undefined,
                  cacheLength: 100 };
    } else { //production
      options = { cert: './assets/certification/cert_production.pem',
                  certData: null,
                  key: './assets/certification/key_production.pem',
                  keyData: null,
                  // passphrase: "bttendanceutopia",
                  ca: null,
                  gateway: "gateway.push.apple.com",
                  port: 2195,
                  enhanced: true,
                  errorCallback: undefined,
                  cacheLength: 100 };
    }

    var apnConnection = new apn.Connection(options);
    var myDevice = new apn.Device(user.device.notification_key); //for token
    var note = new apn.Notification();

    var alert = "Notification from " + title;
    if (message)
      alert = title + " : " + message;

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = alert;
    note.payload = {
      'type' 			: type,
      'courseId' : courseId,
      'title' 		: title,
      'message'   : message
    };
    apnConnection.pushNotification(note, myDevice);
    console.log("iOS notification has been sent to " + user.fullName + " (" + user.email + ")");
  }
};

exports.resendAttedance = function (attendanceId) {

  Attendance
  .findOneById(attendanceId)
  .populate('post')
  .exec(function (err, attendance) {
    if (err || !attendance)
      return;

    Course
    .findOneById(attendance.post.course)
    .populate('students')
    .exec(function (err, course) {
      if (err || !course)
        return;

      var unchecked = [];
      for (var i = 0; i < course.students.length; i++)
        unchecked.push(course.students[i].id);

      for (var i = 0; i < attendance.checkedStudents.length; i++) {
        var index = unchecked.indexOf(attendance.checkedStudents[i]);
        if (index > -1)
          unchecked.splice(index, 1);
      }

      User
      .findById(unchecked)
      .populate('device')
      .populate('setting')
      .sort('id DESC').exec(function (err, users) {
        if (err || !users)
          return;

        for (var i = 0; i < users.length; i++)
          if (users[i].setting && users[i].setting.attendance) {
            var locale = users[i].locale;
            if (!locale || locale != 'ko')
              locale = 'en';
            exports.send(users[i], course.name, sails.__({ phrase: "Attendance check is on-going", locale: locale }), "attendance_on_going", course.id);
          }
      });
    });
  });
};

exports.resendClicker = function (clickerId) {

  Clicker
  .findOneById(clickerId)
  .populate('post')
  .exec(function (err, clicker) {
    if (err || !clicker)
      return;

    Course
    .findOneById(clicker.post.course)
    .populate('students')
    .exec(function (err, course) {
      if (err || !course)
        return;

      var unchecked = [];
      for (var i = 0; i < course.students.length; i++)
        unchecked.push(course.students[i].id);

      for (var i = 0; i < clicker.a_students.length; i++) {
        var index = unchecked.indexOf(clicker.a_students[i]);
        if (index > -1)
          unchecked.splice(index, 1);
      }

      for (var i = 0; i < clicker.b_students.length; i++) {
        var index = unchecked.indexOf(clicker.b_students[i]);
        if (index > -1)
          unchecked.splice(index, 1);
      }

      for (var i = 0; i < clicker.c_students.length; i++) {
        var index = unchecked.indexOf(clicker.c_students[i]);
        if (index > -1)
          unchecked.splice(index, 1);
      }

      for (var i = 0; i < clicker.d_students.length; i++) {
        var index = unchecked.indexOf(clicker.d_students[i]);
        if (index > -1)
          unchecked.splice(index, 1);
      }

      for (var i = 0; i < clicker.e_students.length; i++) {
        var index = unchecked.indexOf(clicker.e_students[i]);
        if (index > -1)
          unchecked.splice(index, 1);
      }

      User
      .findById(unchecked)
      .populate('device')
      .populate('setting')
      .sort('id DESC').exec(function (err, users) {
        if (err || !users)
          return;

        for (var i = 0; i < users.length; i++)
          if (users[i].setting && users[i].setting.clicker) {
            var locale = users[i].locale;
            if (!locale || locale != 'ko')
              locale = 'en';
            exports.send(users[i], course.name, sails.__({ phrase: "Clicker is on-going", locale: locale }), "clicker_on_going", course.id);
          }
      });
    });
  });
};
