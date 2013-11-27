/**
 * SerialController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SerialController)
   */
   
  _config: {},

	validate: function(req, res) {
		res.contentType('application/json');
		var serial = req.param('serial');

		if (serial != 'welcome' && serial != 'Welcome') {
			console.log("UserController : Wrong Serial : " + serial);
			return res.send(401, { error: "Wrong Serial", toast: "Wrong Serial"});
		} else {
			console.log("UserController : Serial Confirmed : " + serial);
			return res.send(202, { validate: true });
		}

	},
  
};
