
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var passport = require('./auth');
var monk = require('monk');
var dbconnection = require('./dbauth');
var db = monk(dbconnection);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('secret'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(function (req, res, next) {
	res.set('X-Powered-By', 'Tea Inventory');
	next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes for JSON data
app.get('/tea/:number', routes.tea);
app.put('/tea/:number/arriving', routes.arriving);

//routes for MongoDB data
app.get('/', routes.list(db)); //make list route default entry
app.get('/list', routes.list(db)); //for linking back to list view
app.get('/newtea', routes.newtea); //for showing newtea view page
app.post('/addtea', routes.addtea(db)); //route to run insert function to MongoDB
app.delete('/delete/:id', routes.remove(db)); // ***NOT WORKING *** route to run delete function to MongoDB *** NOT WORKING ***

//routes for user auth using passport
app.get('/login', routes.login); //display login page
app.post('/login', passport.authenticate('local', { // verify login and redirects for success and failure
	failureRedirect: '/login',
	successRedirect: '/list'
}));
app.get('/user', routes.user); //welcome page for login success
app.get('/logout', routes.logout);

//start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});