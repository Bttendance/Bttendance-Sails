/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.policies = {

  // Default policy for all controllers and actions
  // (`true` allows public access) 
  '*': true,

  SerialController: {
  	'*' : 'isDeV',
  	validate : true,
    request : true
  },

  UserController: {
  	'*' : 'isDeV',
  	create : true,
  	update : 'isDeV',
  	destroy : 'isDeV',
    find : 'isDeV',
  	signin : true,
    auto_signin : true,
    forgot_password : true,
  	signup : true,
  	update_type : 'isUser',
  	join_school : 'isUser',
  	join_course : 'isUser',
    courses : 'isUser',
    schools : 'isUser',
    joinable_courses : 'isUser',
    update_notification_key : ['isUser', 'hasDevice'],
    update_profile_image : ['isUser', 'hasDevice'],
    update_full_name : ['isUser', 'hasDevice'],
    update_email : ['isUser', 'hasDevice'],
    feed : 'isUser',
    employ_school : 'isUser',
    enroll_school : 'isUser',
    attend_course : 'isUser',
    search_user : 'isUser'
  },

  CourseController: {
  	create : 'isUser',
  	update : 'isDeV',
  	destroy : 'isDeV',
    find: 'isDeV',
    feed : 'isUser',
    students : 'isUser',
    grades : 'isUser',
    add_manager : 'isUser',
    remove : 'isDeV'
  },

  PostController: {
  	create : 'isDeV',
  	update : 'isDeV',
  	destroy : 'isDeV',
    find : 'isUser',
    attendance_start : 'isUser',
    attendance_found_device : 'isUser',
    attendance_check_manually : 'isUser',
    create_notice : 'isUser'
  },

  SchoolController: {
  	create : 'isDeV',
  	update : 'isDeV',
  	destroy : 'isDeV',
    find : 'isDeV',
    all : 'isUser'
  }

  /*
	// Here's an example of adding some policies to a controller
	RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		'*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy 
		// (this overrides `false` above)
		nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		feed : ['isNiceToAnimals', 'hasRabbitFood']
	}
	*/
};


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
