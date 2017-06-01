var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true,
	},
	(req, username, password, done) => {
		process.nextTick(function() {
			User.findOne({ 'local.username': username }, (err, user) => {
				if(err)
					return done(err);
				if(user) {
					return done(null, false, req.flash('signupMessage', 'El e-mail está en uso.'));
				} else {
					var newUser = new User();
					newUser.local.username = username;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.country = req.body.country;
					newUser.save((err) => {
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true,
	},
	(req, username, password, done) => {
		User.findOne({'local.username': username}, (err, user) => {
			if(err)
				return done(err);
			if(!user)
				return done(null, false, req.flash('loginMessage', 'Usuario no encontrado.'));
			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.'));
			return done(null, user);
		});
	}));
};