/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/
  '*': 'isDev',

  AdminController: {
    '*': true
  },

  AnalyticsController: {
    '*': true
  },

  MigrationController: {
    '*': true
  },

  SocketsController: {
    'connect': true
  },

  UsersController: {
    signup: true,
    auto_signin: true,
    signin: true,
    forgot_password: true,
    update_password: 'isUser',
    update_full_name: 'isUser',
    update_email: 'isUser',
    feed: 'isUser',
    courses: 'isUser',
    search: 'isUser'
  },

  DevicesController: {
    update_notification_key: 'isUser'
  },

  SettingsController: {
    update_attendance: 'isUser',
    update_clicker: 'isUser',
    update_notice: 'isUser',
  },

  QuestionsController: {
    mine: 'isUser',
    create: 'isUser',
    edit: 'isUser',
    remove: 'isUser'
  },

  IdentificationsController: {
    update_identity: 'enrolled'
  },

  SchoolsController: {
    create: 'isUser',
    all: 'isUser',
    courses: 'isUser',
    enroll: 'isUser'
  },

  CoursesController: {
    info: 'attending_or_supervising',
    create_instant: 'isUser',
    search: 'isUser',
    attend: 'isUser',
    dettend: 'attending',
    feed: 'attending_or_supervising',
    open: 'supervising',
    close: 'supervising',
    students: 'attending_or_supervising',
    add_manager: 'supervising',
    attendance_grades: 'supervising',
    clicker_grades: 'supervising',
    export_grades: 'supervising'
  },

  PostsController: {
    start_clicker: 'supervising',
    start_attendance: 'supervising',
    create_notice: 'supervising',
    update_message: 'supervising',
    remove: 'supervising'
  },

  AttendancesController: {
    from_courses: 'isUser',
    found_device: true,
    check_manually: 'isUser',
    uncheck_manually: 'isUser',
    toggle_manually: 'isUser'
  },

  ClickersController: {
    click: 'isUser'
  },

  NoticesController: {
    seen: 'isUser'
  },

  TokensController: {
    verify: true
  },

  TutorialController: {
    '*': true
  }

};
