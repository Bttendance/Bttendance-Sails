'use strict';

/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  '/': {
    view: 'homepage'
  },

  /************* Admin APIs ************/
  '/api/admin/show'   : 'AdminController.show',
  '/api/admin/user'   : 'AdminController.user',
  '/api/admin/analyze': 'AdminController.analyze',
  '/api/admin/emails' : 'AdminController.emails',

  /************* Analytics APIs ************/
  '/api/analytics/itunes'   : 'AnalyticsController.itunes',
  '/api/analytics/playstore': 'AnalyticsController.playstore',
  '/api/analytics/homepage' : 'AnalyticsController.homepage',

  /************* Migration APIs ************/
  '/api/migration/migrate1': 'MigrationController.migrate1',
  '/api/migration/migrate2': 'MigrationController.migrate2',
  '/api/migration/migrate3': 'MigrationController.migrate3',
  '/api/migration/migrate4': 'MigrationController.migrate4',
  '/api/migration/migrate5': 'MigrationController.migrate5',

  /************* Socket API ************/
  'PUT /api/socket/connect': 'SocketController.connect',

  /************* User API ************/
  'POST /api/user/signup'         : 'UserController.signup',
  'GET /api/user/auto/signin'     : 'UserController.autoSignin',
  'POST /api/user/signin'         : 'UserController.signin',
  'PUT /api/user/forgot/password' : 'UserController.forgotPassword',
  'PUT /api/user/update/password' : 'UserController.updatePassword',
  'PUT /api/user/update/name'     : 'UserController.updateName',
  'PUT /api/user/update/email'    : 'UserController.updateEmail',
  'GET /api/user/courses'         : 'UserController.courses',
  'GET /api/user/search'          : 'UserController.search',

  /************* Device API ************/
  'PUT /api/device/update/notification_key': 'DeviceController.updateNotificationKey',

  /************* Settings API ************/
  'PUT /api/settings/update/attendance'      : 'SettingsController.updateAttendance',
  'PUT /api/settings/update/clicker'         : 'SettingsController.updateClicker',
  'PUT /api/settings/update/notice'          : 'SettingsController.updateNotice',
  'PUT /api/settings/update/curious'         : 'SettingsController.updateCurious',
  'PUT /api/settings/update/clicker/defaults': 'SettingsController.updateClickerDefaults',

  /************* Question API ************/
  'GET /api/question/mine'     : 'QuestionController.mine',
  'POST /api/question/create'  : 'QuestionController.create',
  'PUT /api/question/edit'     : 'QuestionController.edit',
  'DELETE /api/question/remove': 'QuestionController.remove',

  /************* Identification API ************/
  'PUT /api/identification/update/identity': 'IdentificationController.updateIdentity',

  /************* School API ************/
  'POST /api/school/create': 'SchoolController.create',
  'GET /api/school/all'    : 'SchoolController.all',
  'GET /api/school/courses': 'SchoolController.courses',
  'PUT /api/school/enroll' : 'SchoolController.enroll',

  /************* Course API ************/
  'GET /api/course/info'             : 'CourseController.info',
  'POST /api/course/create/instant'  : 'CourseController.createInstant',
  'GET /api/course/search'           : 'CourseController.search',
  'PUT /api/course/attend'           : 'CourseController.attend',
  'PUT /api/course/dettend'          : 'CourseController.dettend',
  'GET /api/course/feed'             : 'CourseController.feed',
  'PUT /api/course/open'             : 'CourseController.open',
  'PUT /api/course/close'            : 'CourseController.close',
  'GET /api/course/students'         : 'CourseController.students',
  'PUT /api/course/add/manager'      : 'CourseController.addManager',
  'GET /api/course/attendance/record': 'CourseController.attendanceRecord',
  'GET /api/course/clicker/record'   : 'CourseController.clickerRecord',
  'PUT /api/course/export/record'    : 'CourseController.exportRecord',

  /************* Post API ************/
  'POST /api/post/start/attendance': 'PostController.startAttendance',
  'POST /api/post/start/clicker'   : 'PostController.startClicker',
  'POST /api/post/create/notice'   : 'PostController.createNotice',
  'PUT /api/post/update/message'   : 'PostController.updateMessage',
  'DELETE /api/post/remove'        : 'PostController.remove',

  /************* Attendance API ************/
  'GET /api/attendance/from/courses'    : 'AttendanceController.fromCourses',
  'PUT /api/attendance/found/device'    : 'AttendanceController.foundDevice',
  'PUT /api/attendance/check/manually'  : 'AttendanceController.checkManually',
  'PUT /api/attendance/uncheck/manually': 'AttendanceController.uncheckManually',
  'PUT /api/attendance/toggle/manually' : 'AttendanceController.toggleManually',

  /************* Clicker API ************/
  'PUT /api/clicker/click': 'ClickerController.click',

  /************* Notice API ************/
  'PUT /api/notice/seen': 'NoticeController.seen',

  /************* Tutorial API ************/
  '/tutorial/clicker'   : 'TutorialController.clicker',
  '/tutorial/attendance': 'TutorialController.attendance',
  '/tutorial/notice'    : 'TutorialController.notice',

  /************* Deprecated API ************/
  '/api/sockets/connect'                : 'DeprecatedController.updateApp',
  '/api/users/signup'                   : 'DeprecatedController.updateApp',
  '/api/users/auto/signin'              : 'DeprecatedController.updateApp',
  '/api/users/signin'                   : 'DeprecatedController.updateApp',
  '/api/users/forgot/password'          : 'DeprecatedController.updateApp',
  '/api/users/update/password'          : 'DeprecatedController.updateApp',
  '/api/users/courses'                  : 'DeprecatedController.updateApp',
  '/api/devices/update/notification_key': 'DeprecatedController.updateApp',
  '/api/identifications/update/identity': 'DeprecatedController.updateApp',
  '/api/schools/create'                 : 'DeprecatedController.updateApp',
  '/api/schools/all'                    : 'DeprecatedController.updateApp',
  '/api/schools/enroll'                 : 'DeprecatedController.updateApp',
  '/api/courses/info'                   : 'DeprecatedController.updateApp',
  '/api/courses/create/instant'         : 'DeprecatedController.updateApp',
  '/api/courses/search'                 : 'DeprecatedController.updateApp',
  '/api/courses/attend'                 : 'DeprecatedController.updateApp',
  '/api/courses/dettend'                : 'DeprecatedController.updateApp',
  '/api/courses/feed'                   : 'DeprecatedController.updateApp',
  '/api/courses/open'                   : 'DeprecatedController.updateApp',
  '/api/courses/close'                  : 'DeprecatedController.updateApp',
  '/api/courses/add/manager'            : 'DeprecatedController.updateApp',
  '/api/courses/students'               : 'DeprecatedController.updateApp',
  '/api/courses/attendance/grades'      : 'DeprecatedController.updateApp',
  '/api/courses/clicker/grades'         : 'DeprecatedController.updateApp',
  '/api/courses/export/grades'          : 'DeprecatedController.updateApp',
  '/api/posts/start/attendance'         : 'DeprecatedController.updateApp',
  '/api/posts/start/clicker'            : 'DeprecatedController.updateApp',
  '/api/posts/create/notice'            : 'DeprecatedController.updateApp',
  '/api/posts/create/curious'           : 'DeprecatedController.updateApp',
  '/api/posts/update/message'           : 'DeprecatedController.updateApp',
  '/api/posts/remove'                   : 'DeprecatedController.updateApp',

  // If a request to a URL doesn't match any of the custom routes above,
  // it is matched against Sails route blueprints.  See `config/blueprints.js`
  // for configuration options and examples.
};
