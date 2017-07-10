var express = require('express');
var passport = require('passport');
var router = express.Router();
var mysql = require('mysql');
var path = require('path');
var fileUpload = require('express-fileupload');


router.use(fileUpload());



router.get('/', (req, res, next) => {
	//res.render('index', {title: 'Express'});

  var consuno = "select * from person order by destacadas desc limit 5";
  var consdos = "select * from person";
  con.query(consuno,function(e,r){
    res.render("index.ejs",{
      persons:r,
      user: req.user
      });
});


});

router.get('/login', (req, res, next) => {
	res.render('login', {message: req.flash('loginMessaje')});
});

router.get('/registro', (req, res) => {
	res.render('registro', {message: req.flash('signupMessage')});
});

// Solo para el usuario

router.get('/perfil', isLoggedIn, (req, res) => {
  con.query("select * from person ORDER BY id DESC LIMIT 2", function(e,r){
    res.render('perfil.ejs', {
      person:r,
      user: req.user
    });
  });

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

//Subida de imagen a base de datos y carpeta
   if(req.method == "POST"){
      var post  = req.body;
      var nombre = req.body.nombre;
      var apellido = req.body.apellido;
      var telefono = req.body.telefono;
      var email = req.body.email;
      var tipo = req.body.tipo;
      var link = req.body.link;
      var destacadas = req.body.destacadas;
 
   if (!req.files)
 return res.status(400).send('Error.');
 
 var file = req.files.avatar;
 var img_name="http://loganserver.hopto.org:3000/carga/"+file.name;
 
    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
              file.mv('./public/carga/'+file.name, function(err) {
                             
               if (err)
 
                 return res.status(500).send(err);
      con.query("insert into person (nombre,apellido,telefono,email,tipo,imagen,destacadas,link,created_at) value (\""+nombre+"\",\""+apellido+"\",\""+telefono+"\",\""+email+"\",\""+tipo+"\",\""+img_name+"\",\""+destacadas+"\",\""+link+"\",NOW())",function(e,r){
      });
      res.redirect("/perfil");
    });
          } else {
            message = "El formato no es valido, por favor suba lo siguiente '.png','.gif','.jpg'";
            res.render('index.ejs',{message: message});
          }
   } else {
      res.render('index.ejs');
   }
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



router.get("/pelicula/:personid",function(req,res){
con.query("select * from person where id="+req.params.personid,function(e,r){
  res.render("test.ejs",{
    person:r[0],
    user: req.user
  });
});
});

module.exports = router;

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}
