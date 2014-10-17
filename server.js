var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var port = 8888;

var app = express();

app.use(session({secret: 'whatever-I-want'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
	clientID: '609234289187889',
	clientSecret: 'a2f8ec5efe75e70f1d98d7f282213b63',
	callbackURL: 'http://localhost:8888/auth/facebook/callback'
}, function(token, refreshToken, profile, done){
	return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var requireAuth = function(req, res, next) {
  console.log("is authed?", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}


app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/login',
	successRedirect: '/me'
}), function(req, res){
	console.log(req.session);
});

app.get('/me', function(req, res){
	if(req.user){
		res.status(200).send(JSON.stringify(req.user));	
	} else {
		res.send('Please Login');
	}
	
});



app.listen(port, function () {
	console.log('listening on port ' + port);
});



