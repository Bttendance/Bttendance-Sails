var passport = require('passport');

module.exports = {
	
	appName: "Bttendance",
	port: 1337,
	environment: 'development',
	log: {
		level: 'verbose'
	},
	express: {
		customMiddleware: function(app)
		{
			app.use(passport.initialize());
			app.use(passport.session());
		}
	}
 
};