'use strict';

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

  DeprecatedController: {
    'updateApp': true
  },

  SocketController: {
    'connect': true
  },

  UserController: {
    signup: true,
    autoSignin: true,
    signin: true,
    forgotPassword: true,
    updatePassword: 'isUser',
    updateName: 'isUser',
    updateEmail: 'isUser',
    feed: 'isUser',
    courses: 'isUser',
    search: 'isUser'
  },

  DeviceController: {
    updateNotificationKey: 'isUser'
  },

  SettingController: {
    updateAttendance: 'isUser',
    updateClicker: 'isUser',
    updateNotice: 'isUser',
    updateCurious: 'isUser',
    updateClickerDefaults: 'isUser'
  },

  QuestionController: {
    mine: 'isUser',
    create: 'isUser',
    edit: 'isUser',
    remove: 'isUser'
  },

  IdentificationController: {
    updateIdentity: 'enrolled'
  },

  SchoolController: {
    create: 'isUser',
    all: 'isUser',
    courses: 'isUser',
    enroll: 'isUser'
  },

  CourseController: {
    info: 'attendingOrSupervising',
    createInstant: 'isUser',
    search: 'isUser',
    attend: 'isUser',
    dettend: 'attending',
    feed: 'attendingOrSupervising',
    open: 'supervising',
    close: 'supervising',
    students: 'attendingOrSupervising',
    addManager: 'supervising',
    attendance_grades: 'supervising',
    clicker_grades: 'supervising',
    export_grades: 'supervising'
  },

  PostController: {
    startClicker: 'supervising',
    startAttendance: 'supervising',
    createNotice: 'supervising',
    updateMessage: 'supervising',
    remove: 'supervising'
  },

  AttendanceController: {
    fromCourses: 'isUser',
    foundDevice: true,
    checkManually: 'isUser',
    uncheckManually: 'isUser',
    toggleManually: 'isUser'
  },

  ClickerController: {
    click: 'isUser'
  },

  NoticeController: {
    seen: 'isUser'
  },

  TutorialController: {
    '*': true
  }

};
