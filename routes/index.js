var express = require('express');
var passport = require('passport');
var router = express.Router();

var fs = require("fs");

var multer = require("multer");
var upload = multer({dest: "./uploads"});

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/images");
var conn = mongoose.connection;

var gfs;


var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

conn.once("open", function(){
  gfs = Grid(conn.db);
  router.get("/sultan", function(req,res){
    //renders a multipart/form-data form
    res.render("sultan");
  });

  //segundo parametro es multer.
  router.post("/sultan", upload.single("avatar"), function(req, res, next){
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    });
    //
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function(){fs.unlink("./uploads/"+ req.file.filename, function(err){res.send("success")})})
        .on("err", function(){res.send("Error al subir imagen")})
          .pipe(writestream);
  });

  // envio imagen por filename.
  router.get("/:filename", function(req, res){
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(res);
  });

});

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
  var tipo = req.body.person.tipo;
  con.query("insert into person (nombre,apellido,telefono,email,tipo,created_at) value (\""+nombre+"\",\""+apellido+"\",\""+telefono+"\",\""+email+"\",\""+tipo+"\",NOW())",function(e,r){
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
  var tipo = req.body.person.tipo;
  con.query(" update person set nombre=\""+nombre+"\",apellido=\""+apellido+"\",telefono=\""+telefono+"\",email=\""+email+"\",tipo=\""+tipo+"\" where id="+id,function(e,r){
  });
  res.redirect("/edit/"+id);
});

//Se elimina contacto
router.get("/delete/:personid",function(req,res){
  con.query("delete from person where id="+req.params.personid,function(e,r){
  });
  res.redirect("/lista");
});

module.exports = router;

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}