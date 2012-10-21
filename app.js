
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === 'toto')
      return done(null, 'toto');
    return done(null, false);
  }
));

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.cookieParser()); 
  app.use(express.bodyParser());
  //app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

// Routes
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/login' })
);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
