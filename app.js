var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//cargo express-session
var session = require('express-session');

//rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//acá tiene que ir el código de sesiones, va antes del indexRouter o la carga de los módulos
app.use(session({
  secret: 'IXhsoq80vwAQlej',
  resave: false,
  saveUninitialized: true
}));

//el código de sesion va antes de esta parte
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/',function(req, res){
  var conocido = Boolean(req.session.nombre);
  //estos datos del objeto pasan al index.hbs en views
  res.render('index',{
    title: 'Sesiones en express js',
    conocido: conocido, 
    nombre: req.session.nombre,
    edad: req.session.edad,
    mayor: req.session.mayor 
  });
});

app.post('/ingresar', function(req, res){
  //prueba para ver si recibo bien el dato
  // var nom = req.body.nombre;
  // console.log(nom);

  //si en el mensaje post viene nombre con algún dato, entonces asígnalo a session.nombre
  if(req.body.nombre){
    req.session.nombre = req.body.nombre;
  }
  if(req.body.edad){
    req.session.edad = req.body.edad;

    if(req.body.edad>=18){
      var mayor = true;
    }else{
      mayor = false;
    }
    //console.log(mayor);
    req.session.mayor = mayor;
  }

  res.redirect('/');
});

app.get('/salir', function(req, res){
  //al tomar la ruta /salir la request destruye la sesión y luego la respuesta la redirige al index('/')
  req.session.destroy();
  res.redirect('/');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
