var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', (req, res, next) => {
	res.render('index', {title: 'Express'});
});

router.get('/login', (req, res, next) => {
	res.render('login', {message: req.flash('loginMessaje')});
});

router.get('/registro', (req, res) => {
	res.render('registro', {message: req.flash('signupMessage')});
});

// Solo para el usuario

router.get('/perfil', isLoggedIn, (req, res) => {
	res.render('perfil.ejs', {user: req.user});
});

router.get('/home', isLoggedIn, (req, res) => {
	res.render('home.ejs', {user: req.user});
});

// FIN solo para el usuario

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.post('/registro', passport.authenticate('local-signup', {
	successRedirect: '/perfil',
	failureRedirect: '/registro',
	failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/perfil',
	failureRedirect: '/login',
	failureFlash: true,
}));

module.exports = router;

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}