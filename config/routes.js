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
 * For more information on routes, check out:
 * http://links.sailsjs.org/docs/config/routes
 */

module.exports.routes = {

  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  //
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
  '/': {
    view: 'homepage'
  },

  /************* Users APIs ************/  
  'get /api/users/auto/signin': {
    controller: 'users',
    action: 'auto_signin'
  },

  'put /api/users/forgot/password': {
    controller: 'users',
    action: 'forgot_password'
  },

  'put /api/users/update/profile_image': {
    controller: 'users',
    action: 'update_profile_image'
  },

  'put /api/users/update/full_name': {
    controller: 'users',
    action: 'update_full_name'
  },

  'put /api/users/update/email': {
    controller: 'users',
    action: 'update_email'
  },

  /************* Devices APIs **********/  
  'put /api/devices/update/notification_key': {
    controller: 'devices',
    action: 'update_notification_key'
  },

  /************* Courses APIs **********/  
  'post /api/courses/create/request': {
    controller: 'courses',
    action: 'create_request'
  },

  'put /api/courses/add/manager': {
    controller: 'courses',
    action: 'add_manager'
  },

  'put /api/courses/export/grades': {
    controller: 'courses',
    action: 'export_grades'
  },

  /************* Posts APIs ************/  
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

  /********* Attendances APIs **********/  
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

  /********* Tokens APIs **********/  
  '/verify/:token_key': {
    controller: 'tokens',
    action: 'verify'
  },
  

  /*********** Old APIs Start **********/
  'get /api/user/auto/signin': {
    controller: 'user',
    action: 'auto_signin'
  },

  'put /api/user/forgot/password': {
    controller: 'user',
    action: 'forgot_password'
  },

  'put /api/user/update/notification_key': {
    controller: 'user',
    action: 'update_notification_key'
  },

  'put /api/user/update/profile_image': {
    controller: 'user',
    action: 'update_profile_image'
  },

  'put /api/user/update/full_name': {
    controller: 'user',
    action: 'update_full_name'
  },

  'put /api/user/update/email': {
    controller: 'user',
    action: 'update_email'
  },

  'put /api/user/attend/course': {
    controller: 'user',
    action: 'attend_course'
  },

  'put /api/user/employ/school': {
    controller: 'user',
    action: 'employ_school'
  },

  'put /api/user/enroll/school': {
    controller: 'user',
    action: 'enroll_school'
  },

  'get /api/user/search/user': {
    controller: 'user',
    action: 'search_user'
  },

  'put /api/course/add/manager': {
    controller: 'course',
    action: 'add_manager'
  },

  'post /api/post/attendance/start': {
    controller: 'post',
    action: 'attendance_start'
  },

  'put /api/post/attendance/found/device': {
    controller: 'post',
    action: 'attendance_found_device'
  },

  'put /api/post/attendance/check/manually': {
    controller: 'post',
    action: 'attendance_check_manually'
  },

  'post /api/post/create/notice': {
    controller: 'post',
    action: 'create_notice'
  },

  'get /api/post/:post_id': {
    controller: 'post',
    action: 'find_post'
  }
  /*********** Old APIs End **********/

  // If a request to a URL doesn't match any of the custom routes above,
  // it is matched against Sails route blueprints.  See `config/blueprints.js`
  // for configuration options and examples.
};
 