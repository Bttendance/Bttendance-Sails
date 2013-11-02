var passport = require('passport');
var	LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({id:id}, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function () {
    console.log('username : ' + username);
    	User.findOne({username: username}).done(function(err, user) {
        if (err)
          return console.log(err);

        if (!user)
          return done(null,false,{message: 'Unknown user ' + username});

        if (!User.checkPass(password, user.password))
          return done(null,false,{message: 'Invalid password'});

        return done(null, user);
      })
    });
}));