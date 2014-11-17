/**
 * Attendances.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var Noti = require('../utils/notifications');
var Arrays = require('../utils/arrays');
var Moment = require('moment');

module.exports = {

	attributes: {

    // auto, manual
    type: {
      type: 'string',
      required: true
    },

    checked_students: {
      type: 'json'
    },

    late_students: {
      type: 'json'
    },

		clusters: {
			type: 'json'
		},

		post: {
			model: 'Posts'
		},

    toJSON: function() {
      var obj = this.toObject();
      delete obj.clusters;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.clusters = this.clusters;
      return obj;
    }
	},

  beforeValidate: function(values, next) {
    next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {
    if (!values.checked_students)
      values.checked_students = new Array();
    if (!values.late_students)
      values.late_students = new Array();
    if (!values.clusters)
      values.clusters = new Array();
    next();
  },

  afterCreate: function(values, next) {

    async.until(
      function () {
        var createdAt = Moment(values.createdAt);
        var diff = Moment().diff(createdAt);
        console.log('diff : ' + diff);
        return diff > 60 * 1000;
      },
      function (callback) {
        setTimeout(function() { 
          bttendance(values.id, function cb(err, attendance) {
            if (!err && attendance) {
              PostsCache.updateAttendance(attendance);
              sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
            }
            callback();
          });
        }, 1000);
      },
      function (err) {
      }
    );

    next();
  },

  beforeUpdate: function(values, next) {
    next();
  },

  afterUpdate: function(values, next) {
    
    var createdAt = Moment(values.createdAt);
    var diff = Moment().diff(createdAt);
    if (diff >= 60 * 1000)
      Attendances
      .findOneById(values.id)
      .populateAll()
      .exec(function callback(err, attendance) {
        if (attendance && attendance.post && attendance.post.course) {
          PostsCache.updateAttendance(attendance);
          sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
        }
      });
    
    next();
  },

  beforeDestroy: function(values, next) {
    next();
  },

  afterDestroy: function(values, next) {
    next();
  },

};

//current attendance id
//cb for updated Attendance.populateAll())  
var bttendance = function(id, cb) {

  Attendances
  .findOneById(id)
  .populate('post')
  .exec(function callback(err, attendance) {
    if (err || !attendance || !attendance.post) 
      return cb(err);

    Courses
    .findOneById(attendance.post.course)
    .populate('students')
    .populate('managers')
    .exec(function callback(err, course) {
      if (err || !course)
        return cb(err);

      Bttendance
      .destroy({
        attendanceID : id
      })
      .exec(function callback(err, bttendances) {
        if (err || !bttendances || bttendances.length == 0)
          return cb(err);

        console.log('bttendances');
        console.log(bttendances);

        var uuids = [];
        var emails = [];
        for (var i = bttendances.length - 1; i >= 0; i--) {
          if (uuids.indexOf(bttendances[i].uuid) < 0)
            uuids.push(bttendances[i].uuid);

          if (emails.indexOf(bttendances[i].email) < 0)
            emails.push(bttendances[i].email);
        }

        console.log('uuids');
        console.log(uuids);
        console.log('emails');
        console.log(emails);

        Devices
        .find({
          uuid : uuids
        })
        .exec(function callback(err, devices) {
          if (err || !devices) {
            restructorBttendances(bttendances);
            return cb(err);
          }

          console.log('devices');
          console.log(devices);

          // Total User in Course
          var courseUsers = [];
          for (var i = course.students.length - 1; i >= 0; i--)
            courseUsers.push(course.students[i]);
          for (var i = course.managers.length - 1; i >= 0; i--)
            courseUsers.push(course.managers[i]);

          // Vaild User Sets
          var validEmails = []; //user array
          for (var i = emails.length - 1; i >= 0; i--) {
            for (var j = courseUsers.length - 1; j >= 0; j--) {
              if (courseUsers[j].email == emails[i]) {
                validEmails.push(courseUsers[j]);
                break;
              }
            }
          }

          console.log('validEmails');
          console.log(validEmails);

          // Vaild ID Sets
          var validIDSets = [];
          for (var i = bttendances.length - 1; i >= 0; i--) {

            var emailID = 0;
            for (var j = validEmails.length - 1; j >= 0; j--)
              if (bttendances[i].email == validEmails[j].email)
                emailID = validEmails[j].id;

            var uuidID = 0;
            for (var j = devices.length - 1; j >= 0; j--)
              if (bttendances[i].uuid == devices[j].uuid)
                uuidID = devices[j].owner;

            if (emailID > 0 && uuidID > 0)
              validIDSets.push([emailID, uuidID]);
          }

          console.log('validIDSets');
          console.log(validIDSets);

          // Backup Clusters
          var clusters = [];
          for (var i = 0; i < attendance.clusters.length; i++) {
            var cluster = [];
            for (var j = 0; j < attendance.clusters[i].length; j++)
              cluster.push(attendance.clusters[i][j]);
            clusters.push(cluster);
          }

          console.log('clusters');
          console.log(clusters);

          for (var k = validIDSets.length - 1; k >= 0; k--) {

            var userids = new Array();
            userids.push(validIDSets[k][0]);
            userids.push(validIDSets[k][1]);

            // Re Clustering - userids[0] : A, userids[1] : B
            //          Find Cluster Number which User A, B included (say it's a,b)
            // Case 1 : None included => Make new cluster and add
            // Case 2 : One included => Add other to the cluster
            // Case 3 : Both included Same => Do nothing
            // Case 4 : Both included Diff => Merge two cluster

            // Find Cluster Number a, b
            var a = -1;
            var b = -1;
            for (var i = 0; i < clusters.length; i++) {
              for (var j = 0; j < clusters[i].length; j++) {
                if (clusters[i][j] == userids[0])
                  a = i;
                if (clusters[i][j] == userids[1])
                  b = i;
              }
            }

            // Case 3
            if (a == b && a != -1)
              continue;

            // Case 1
            else if (a == b && a == -1)
              clusters.push(userids);

            // Case 2
            else if (a != -1 && b == -1)
              clusters[a].push(userids[1]);

            // Case 2
            else if (a == -1 && b != -1)
              clusters[b].push(userids[0]);

            // Case 4
            else {
              var new_cluster = new Array();
              for (var i = 0; i < clusters.length; i++) {
                if (i != a && i != b)
                  new_cluster.push(clusters[i]);
              }

              var merged_array = clusters[a].concat(clusters[b]);
              new_cluster.push(merged_array);

              clusters = new_cluster;
            }

            // Found if any cluster has more than 2 users
            var a = -1; // cluster which has more than 2 users
            var b = -1; // cluster which author is included
            for (var i = 0; i < clusters.length; i++)
              for (var j = 0; j < clusters[i].length; j++)
                if (clusters[i][j] == attendance.post.author)
                  b = i;

            for (var i = 0; i < clusters.length; i++)
              if (i != b && clusters[i].length >= 2)
                a = i;

            if (a != -1) {
              var new_cluster = new Array();
              for (var i = 0; i < clusters.length; i++) {
                if (i != a && i != b)
                  new_cluster.push(clusters[i]);
              }

              var merged_array = clusters[a].concat(clusters[b]);
              new_cluster.push(merged_array);

              clusters = new_cluster;
            }
          }

          var b = -1; // cluster which author is included
          for (var i = 0; i < clusters.length; i++)
            for (var j = 0; j < clusters[i].length; j++)
              if (clusters[i][j] == attendance.post.author)
                b = i;

          // Student IDs
          var students = Arrays.getIds(course.students);

          // Backup CheckedStudents
          var checkedStudents = [];
          for (var i = 0; i < clusters[b].length; i++)
            if (students.indexOf(clusters[b][i]) >= 0
              && attendance.late_students.indexOf(clusters[b][i]) < 0)
              checkedStudents.push(clusters[b][i]);

          console.log('checkedStudents');
          console.log(checkedStudents);

          // noti users
          var notiable = [];
          for (var i = checkedStudents.length - 1; i >= 0; i--)
            if (students.indexOf(checkedStudents[i]) >= 0
              && attendance.checked_students.indexOf(checkedStudents[i]) < 0
              && attendance.late_students.indexOf(checkedStudents[i]) < 0)
              notiable.push(checkedStudents[i]);

          console.log('notiable');
          console.log(notiable);

          // send notifications
          Users
          .findOneById(notiable)
          .populate('device')
          .populate('setting')
          .exec(function callback(err, users) {
            if (!err && users)
              for (var i = users.length - 1; i >= 0; i--)
                if (users[i].setting && users[i].setting.attendance)
                  Noti.send(users[i], course.name, "Attendance has been checked", "attendance_checked", course.id);
          }); 

          // update Attendance
          Attendances
          .update({
            id : id
          }, {
            checked_students : checkedStudents,
            clusters : clusters
          }).exec(function callback(err, attendance) {
            if (err || !attendance)
              return cb(err);

            Attendances
            .findOneById(id)
            .populateAll()
            .exec(function callback(err, attendance) {
              if (err || !attendance)
                return cb(err);

              return cb(null, attendance);
            });
          });
        });
      });
    });
  });
}

var restructorBttendances = function(bttendances) {
  if (!bttendances)
    return;

  for (var i = bttendances.length - 1; i >= 0; i--) {
    Bttendance
    .create({
      attendanceID : bttendances[i].attendanceID,
      email : bttendances[i].email,
      uuid : bttendances[i].uuid
    }).exec(function callback(err, attendanceCluser) {
    });
  };
}
