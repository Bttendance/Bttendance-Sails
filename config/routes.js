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

  /************* Sockets API ************/  
  'put /api/sockets/connect': {
    controller: 'sockets',
    action: 'connect'
  },

  /************* Users API ************/  
  'post /api/users/signup': {
    controller: 'users',
    action: 'signup'
  },

  'get /api/users/auto/signin': {
    controller: 'users',
    action: 'auto_signin'
  },

  'get /api/users/signin': {
    controller: 'users',
    action: 'signin'
  },

  'put /api/users/forgot/password': {
    controller: 'users',
    action: 'forgot_password'
  },

  'put /api/users/update/password': {
    controller: 'users',
    action: 'update_password'
  },

  'put /api/users/update/full_name': {
    controller: 'users',
    action: 'update_full_name'
  },

  'put /api/users/update/email': {
    controller: 'users',
    action: 'update_email'
  },

  'get /api/users/feed': {
    controller: 'users',
    action: 'feed'
  },

  'get /api/users/courses': {
    controller: 'users',
    action: 'courses'
  },

  'get /api/users/search': {
    controller: 'users',
    action: 'search'
  },

  /************* Devices API ************/  
  'put /api/devices/update/notification_key': {
    controller: 'devices',
    action: 'update_notification_key'
  },

  /************* Settings API ************/  
  'put /api/settings/update/attendance': {
    controller: 'settings',
    action: 'update_attendance'
  },  

  'put /api/settings/update/clicker': {
    controller: 'settings',
    action: 'update_clicker'
  },

  'put /api/settings/update/notice': {
    controller: 'settings',
    action: 'update_notice'
  },

  'put /api/settings/update/clicker/defaults': {
    controller: 'settings',
    action: 'update_clicker_defaults'
  },

  /************* Questions API ************/  
  'get /api/questions/mine': {
    controller: 'questions',
    action: 'mine'
  },  

  'post /api/questions/create': {
    controller: 'questions',
    action: 'create'
  },

  'put /api/questions/edit': {
    controller: 'questions',
    action: 'edit'
  },

  'delete /api/questions/remove': {
    controller: 'questions',
    action: 'remove'
  },

  /************* Identifications API ************/  
  'put /api/identifications/update/identity': {
    controller: 'identifications',
    action: 'update_identity'
  },

  /************* Schools API ************/  
  'post /api/schools/create': {
    controller: 'schools',
    action: 'create'
  },

  'get /api/schools/all': {
    controller: 'schools',
    action: 'all'
  },

  'get /api/schools/courses': {
    controller: 'schools',
    action: 'courses'
  },

  'put /api/schools/enroll': {
    controller: 'schools',
    action: 'enroll'
  },

  /************* Courses API ************/  
  'post /api/courses/create/request': {
    controller: 'courses',
    action: 'create_request'
  },  

  'post /api/courses/create/instant': {
    controller: 'courses',
    action: 'create_instant'
  },

  'get /api/courses/search': {
    controller: 'courses',
    action: 'search'
  },

  'put /api/courses/attend': {
    controller: 'courses',
    action: 'attend'
  },

  'put /api/courses/dettend': {
    controller: 'courses',
    action: 'dettend'
  },

  'get /api/courses/feed': {
    controller: 'courses',
    action: 'feed'
  },

  'put /api/courses/open': {
    controller: 'courses',
    action: 'open'
  },

  'put /api/courses/close': {
    controller: 'courses',
    action: 'close'
  },

  'get /api/courses/students': {
    controller: 'courses',
    action: 'students'
  },

  'put /api/courses/add/manager': {
    controller: 'courses',
    action: 'add_manager'
  },

  'get /api/courses/grades': {
    controller: 'courses',
    action: 'attendance_grades'
  },

  'get /api/courses/attendance/grades': {
    controller: 'courses',
    action: 'attendance_grades'
  },

  'get /api/courses/clicker/grades': {
    controller: 'courses',
    action: 'clicker_grades'
  },

  'put /api/courses/export/grades': {
    controller: 'courses',
    action: 'export_grades'
  },

  /************* Posts API ************/  
  'post /api/posts/start/attendance': {
    controller: 'posts',
    action: 'start_attendance'
  },

  'post /api/posts/start/clicker': {
    controller: 'posts',
    action: 'start_clicker'
  },

  'post /api/posts/create/notice': {
    controller: 'posts',
    action: 'create_notice'
  },

  'put /api/posts/update/message': {
    controller: 'posts',
    action: 'update_message'
  },

  'delete /api/posts/remove': {
    controller: 'posts',
    action: 'remove'
  },

  /************* Attendances API ************/  
  'get /api/attendances/from/courses': {
    controller: 'attendances',
    action: 'from_courses'
  },

  'put /api/attendances/found/device': {
    controller: 'attendances',
    action: 'found_device'
  },

  'put /api/attendances/check/manually': {
    controller: 'attendances',
    action: 'check_manually'
  },

  'put /api/attendances/uncheck/manually': {
    controller: 'attendances',
    action: 'uncheck_manually'
  },

  'put /api/attendances/toggle/manually': {
    controller: 'attendances',
    action: 'toggle_manually'
  },

  /************* Clickers API ************/ 
  'put /api/clickers/click': {
    controller: 'clickers',
    action: 'click'
  },

  /************* Notices API ************/ 
  'put /api/notices/seen': {
    controller: 'notices',
    action: 'seen'
  },

  /************* Tokens API ************/  
  '/verify/:token_key': {
    controller: 'tokens',
    action: 'verify'
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
 