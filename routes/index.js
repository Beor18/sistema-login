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

router.get('/alta', isLoggedIn, (req, res) => {
	res.render('alta.ejs', {user: req.user});
});

router.get('/save', isLoggedIn, (req, res) => {
	res.render('save.ejs', {user: req.user});
});

router.get('/lista', isLoggedIn, (req, res) => {
	con.query("select * from person",function(e,r){
  	res.render("lista.ejs",{persons:r});
});
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


router.post("/save",function(req,res){
  console.log(req.body.person.nombre)
  var nombre = req.body.person.nombre;
  var apellido = req.body.person.apellido;
  var telefono = req.body.person.telefono;
  var email = req.body.person.email;
  con.query("insert into person (nombre,apellido,telefono,email,created_at) value (\""+nombre+"\",\""+apellido+"\",\""+telefono+"\",\""+email+"\",NOW())",function(e,r){
  });
  res.redirect("/perfil");
});



// Se edita contacto
router.get("/edit/:personid",function(req,res){
con.query("select * from person where id="+req.params.personid,function(e,r){
  res.render("edit.ejs",{person:r[0]});
});
});

// Se actualiza contacto
router.post("/update",function(req,res){
  console.log(req.body.person.nombre)
  var id = req.body.person.id;
  var nombre = req.body.person.nombre;
  var apellido = req.body.person.apellido;
  var telefono = req.body.person.telefono;
  var email = req.body.person.email;
  con.query(" update person set nombre=\""+nombre+"\",apellido=\""+apellido+"\",telefono=\""+telefono+"\",email=\""+email+"\" where id="+id,function(e,r){
  });
  res.redirect("/edit/"+id);
});

//Se elimina contacto
router.get("/delete/:personid",function(req,res){
  con.query("delete from person where id="+req.params.personid,function(e,r){
  });
  res.redirect("/");
});

module.exports = router;

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}