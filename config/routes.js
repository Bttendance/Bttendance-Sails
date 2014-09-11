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
  '/api/admin/show': {
    controller: 'admin',
    action: 'show'
  },

  '/api/admin/emails': {
    controller: 'admin',
    action: 'emails'
  },

  '/api/admin/noti': {
    controller: 'admin',
    action: 'noti'
  },

  /************* Analytics APIs ************/
  '/api/analytics/itunes': {
    controller: 'analytics',
    action: 'itunes'
  },

  '/api/analytics/playstore': {
    controller: 'analytics',
    action: 'playstore'
  },

  '/api/analytics/homepage': {
    controller: 'analytics',
    action: 'homepage'
  },

  /************* Migration APIs ************/
  '/api/migration/migrate': {
    controller: 'migration',
    action: 'migrate'
  },

  '/api/migration/migrate1': {
    controller: 'migration',
    action: 'migrate1'
  },

  '/api/migration/migrate2': {
    controller: 'migration',
    action: 'migrate2'
  },

  /************* Sockets API ************/  
  'put /api/sockets/connect': {
    controller: 'socket',
    action: 'connect'
  },

  /************* Users API ************/  
  'post /api/users/signup': {
    controller: 'user',
    action: 'signup'
  },

  'get /api/users/auto/signin': {
    controller: 'user',
    action: 'auto_signin'
  },

  'get /api/users/signin': {
    controller: 'user',
    action: 'signin'
  },

  'put /api/users/forgot/password': {
    controller: 'user',
    action: 'forgot_password'
  },

  'put /api/users/update/password': {
    controller: 'user',
    action: 'update_password'
  },

  'put /api/users/update/full_name': {
    controller: 'user',
    action: 'update_full_name'
  },

  'put /api/users/update/email': {
    controller: 'user',
    action: 'update_email'
  },

  'get /api/users/feed': {
    controller: 'user',
    action: 'feed'
  },

  'get /api/users/courses': {
    controller: 'user',
    action: 'courses'
  },

  'get /api/users/search': {
    controller: 'user',
    action: 'search'
  },

  /************* Devices API ************/  
  'put /api/devices/update/notification_key': {
    controller: 'device',
    action: 'update_notification_key'
  },

  /************* Settings API ************/  
  'put /api/settings/update/attendance': {
    controller: 'setting',
    action: 'update_attendance'
  },  

  'put /api/settings/update/clicker': {
    controller: 'setting',
    action: 'update_clicker'
  },

  'put /api/settings/update/notice': {
    controller: 'setting',
    action: 'update_notice'
  },

  /************* Questions API ************/  
  'get /api/questions/mine': {
    controller: 'question',
    action: 'mine'
  },  

  'post /api/questions/create': {
    controller: 'question',
    action: 'create'
  },

  'put /api/questions/edit': {
    controller: 'question',
    action: 'edit'
  },

  'delete /api/questions/remove': {
    controller: 'question',
    action: 'remove'
  },

  /************* Identifications API ************/  
  'put /api/identifications/update/identity': {
    controller: 'identification',
    action: 'update_identity'
  },

  /************* Schools API ************/  
  'post /api/schools/create': {
    controller: 'school',
    action: 'create'
  },

  'get /api/schools/all': {
    controller: 'school',
    action: 'all'
  },

  'get /api/schools/courses': {
    controller: 'school',
    action: 'courses'
  },

  'put /api/schools/enroll': {
    controller: 'school',
    action: 'enroll'
  },

  /************* Courses API ************/  
  'post /api/courses/create/request': {
    controller: 'course',
    action: 'create_request'
  },  

  'post /api/courses/create/instant': {
    controller: 'course',
    action: 'create_instant'
  },

  'get /api/courses/search': {
    controller: 'course',
    action: 'search'
  },

  'put /api/courses/attend': {
    controller: 'course',
    action: 'attend'
  },

  'put /api/courses/dettend': {
    controller: 'course',
    action: 'dettend'
  },

  'get /api/courses/feed': {
    controller: 'course',
    action: 'feed'
  },

  'put /api/courses/open': {
    controller: 'course',
    action: 'open'
  },

  'put /api/courses/close': {
    controller: 'course',
    action: 'close'
  },

  'get /api/courses/students': {
    controller: 'course',
    action: 'students'
  },

  'put /api/courses/add/manager': {
    controller: 'course',
    action: 'add_manager'
  },

  'get /api/courses/grades': {
    controller: 'course',
    action: 'attendance_grades'
  },

  'get /api/courses/attendance/grades': {
    controller: 'course',
    action: 'attendance_grades'
  },

  'get /api/courses/clicker/grades': {
    controller: 'course',
    action: 'clicker_grades'
  },

  'put /api/courses/export/grades': {
    controller: 'course',
    action: 'export_grades'
  },

  /************* Posts API ************/  
  'post /api/posts/start/attendance': {
    controller: 'post',
    action: 'start_attendance'
  },

  'post /api/posts/start/clicker': {
    controller: 'post',
    action: 'start_clicker'
  },

  'post /api/posts/create/notice': {
    controller: 'post',
    action: 'create_notice'
  },

  'put /api/posts/update/message': {
    controller: 'post',
    action: 'update_message'
  },

  'delete /api/posts/remove': {
    controller: 'post',
    action: 'remove'
  },

  /************* Attendances API ************/  
  'get /api/attendances/from/courses': {
    controller: 'attendance',
    action: 'from_courses'
  },

  'put /api/attendances/found/device': {
    controller: 'attendance',
    action: 'found_device'
  },

  'put /api/attendances/check/manually': {
    controller: 'attendance',
    action: 'check_manually'
  },

  'put /api/attendances/uncheck/manually': {
    controller: 'attendance',
    action: 'uncheck_manually'
  },

  'put /api/attendances/toggle/manually': {
    controller: 'attendance',
    action: 'toggle_manually'
  },

  /************* Clickers API ************/ 
  'put /api/clickers/click': {
    controller: 'clicker',
    action: 'click'
  },

  /************* Notices API ************/ 
  'put /api/notices/seen': {
    controller: 'notice',
    action: 'seen'
  },

  /************* Tutorial Views ************/  
  '/tutorial/clicker': {
    controller: 'tutorial',
    action: 'clicker'
  },

  '/tutorial/attendance': {
    controller: 'tutorial',
    action: 'attendance'
  },

  '/tutorial/notice': {
    controller: 'tutorial',
    action: 'notice'
  }

  // If a request to a URL doesn't match any of the custom routes above,
  // it is matched against Sails route blueprints.  See `config/blueprints.js`
  // for configuration options and examples.
};
 