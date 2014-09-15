/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var locale = 'en';

module.exports = {	
	signin: function(req, res){
		UsersController({})
	},

	setLocale: function(req, res){
		var language = req.param('language');
		if (language == 'ko') {
			locale = 'ko';
			return res.redirect('/homepage-ko');
		} 
	},
};

