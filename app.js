
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var monk = require('monk');
var connection = require('./auth');
var db = monk(connection);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
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

app.get('/tea/:number', routes.tea);
app.put('/tea/:number/arriving', routes.arriving);
app.get('/', routes.list(db)); //make list route default entry
app.get('/list', routes.list(db)); //for linking back to list view
app.get('/newtea', routes.newtea); //for showing newtea view page

app.post('/addtea', routes.addtea(db)); //route to run insert function to MongoDB

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
