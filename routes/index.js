
// the following is for the app routes prior to hooking to MongoDB
var teas = require('../data');

var tea = require('../tea');

for(var number in teas) {
	teas[number] = tea(teas[number]);
}

exports.tea = function(req, res){
	var number = req.param('number');

	if (typeof teas[number] === 'undefined') {
		res.status(404).json({status: 'error'});
	} else {
		res.json(teas[number].getInformation());
	}
};

exports.arriving = function (req, res) {
	var number = req.param('number');

	if (typeof teas[number] === 'undefined') {
		res.status(404).json({status: 'error'});
	} else {
		teas[number].triggerArriving();
		res.json({status: 'done'});
	}
};

// route to MongoDB data to display on the list view
exports.list = function(db) {
	return function(req, res) {
		var collection = db.get('inventory');
		if (req.session.passport.user === undefined) {
			res.redirect('/login');
		} else {
			collection.find({},{},function(e, docs){
				res.render('list', {
				title : 'Current Tea Inventory',
				"list" : docs
				});
			});
		};
	};
};

// route to show add new tea form page
exports.newtea = function(req, res){
	if (req.session.passport.user === undefined) {
		res.redirect('/login');
	} else {
		res.render('newtea', { title: 'Add New Tea to Inventory' });
	};
};

// route to complete insert function to MongoDB, called when user 'saves' form
exports.addtea = function(db) {
	return function(req, res) {
		var teaNumber = req.body.teanumber;
		var teaOrigin = req.body.teaorigin;
		var teaType = req.body.teatype;
		var teaName = req.body.teaname;
		var currentStock = req.body.currentstock;
		var collection = db.get('inventory');
		collection.insert({
			"number" : teaNumber,
			"name" : teaName,
			"origin" : teaOrigin,
			"type" : teaType,
			"currentStock" : currentStock
		}, function(err, doc) {
			if(err) {
				res.send("Unable to add new tea to database.");
			} else {
				res.location("list");
				res.redirect("list");
			}
		});
	};
};

// *** NOT WORKING *** route to complete delete function to MongoDB, called when user confirms dialog *** NOT WORKING ***
exports.remove = function(db) {
	return function(req, res) {
		var id = req.param('id');
		var collection = db.get('inventory');
		collection.remove({ '_id' : id}, function(err) {
			if (err) {
				res.send("Unable to complete delete operation.");
			} else {
				res.location('list');
				res.redirect('list');
			}
		});
	};
};

//route to login page
exports.login = function(req, res) {
	res.render('login', {title: 'Welcome to the Tea Inventory System'})
};

//route to success or failure pages after login attempt
exports.user = function(req, res) {
	if (req.session.passport.user === undefined) {
		res.redirect('/login');
	} else {
		res.render('user', {
			title: 'Welcome!',
			user: req.user
		})
	};
};

// route to logout user
exports.logout = function(req, res){
  req.logout();
  res.redirect('/login');
};