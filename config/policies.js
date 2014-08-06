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
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!documentation/
 */


module.exports.policies = {

  // Default policy for all controllers and actions
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
    update_identity: 'isUser'
  },

  SchoolsController: {
    create: 'isUser',
    all: 'isUser',
    courses: 'isUser',
    enroll: 'isUser'
  },

  CoursesController: {
    create_request: 'isUser',
    create_instant: 'isUser',
    search: 'isUser',
    attend: 'isUser',
    dettend: 'attending',
    feed: 'attending_or_supervising',
    open: 'supervising',
    close: 'supervising',
    students: 'supervising',
    add_manager: 'supervising',
    attendance_grades: 'supervising',
    clicker_grades: 'supervising',
    export_grades: 'supervising'
  },

  PostsController: {
    start_attendance: 'supervising',
    start_clicker: 'supervising',
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
  }

};

  /*
  // Here's an example of adding some policies to a controller
  RabbitController: {

    // Apply the `false` policy as the default for all of RabbitController's actions
    // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
    '*': false,

    // For the action `nurture`, apply the 'isRabbitMother' policy 
    // (this overrides `false` above)
    nurture : 'isRabbitMother',

    // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
    // before letting any users feed our rabbits
    feed : ['isNiceToAnimals', 'hasRabbitFood']
  }
  */

/**
 * Here's what the `isNiceToAnimals` policy from above might look like:
 * (this file would be located at `policies/isNiceToAnimals.js`)
 *
 * We'll make some educated guesses about whether our system will
 * consider this user someone who is nice to animals.
 *
 * Besides protecting rabbits (while a noble cause, no doubt), 
 * here are a few other example use cases for policies:
 *
 *	+ cookie-based authentication
 *	+ role-based access control
 *	+ limiting file uploads based on MB quotas
 *	+ OAuth
 *	+ BasicAuth
 *	+ or any other kind of authentication scheme you can imagine
 *
 */

/*
module.exports = function isNiceToAnimals (req, res, next) {
	
	// `req.session` contains a set of data specific to the user making this request.
	// It's kind of like our app's "memory" of the current user.
	
	// If our user has a history of animal cruelty, not only will we 
	// prevent her from going even one step further (`return`), 
	// we'll go ahead and redirect her to PETA (`res.redirect`).
	if ( req.session.user.hasHistoryOfAnimalCruelty ) {
		return res.redirect('http://PETA.org');
	}

	// If the user has been seen frowning at puppies, we have to assume that
	// they might end up being mean to them, so we'll 
	if ( req.session.user.frownsAtPuppies ) {
		return res.redirect('http://www.dailypuppy.com/');
	}

	// Finally, if the user has a clean record, we'll call the `next()` function
	// to let them through to the next policy or our controller
	next();
};
*/
