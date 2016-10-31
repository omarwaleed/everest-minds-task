var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('signin');
});

router.post('/login', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	console.log('-----------');
	console.log(username);
	console.log(password);
	console.log('-----------');

	if (username != null && username != '' && password != null && password != '') {

		console.log('passed first if');

		User.findOne({username: username, password: password}, function (err, user) {
			console.log('inside something');
			if (err) {
				console.log(err);
			}
			if (user != null) {
				console.log('in not null if');
				res.cookie('username', user.username);
				// res.send("OK");
				res.redirect('/new');
			}
		});

		console.log('somewhere after');

	}
});

router.route('/signup')
.get(function (req, res) {
	res.render('signup', {message: null});
})
.post(function (req, res) {
	// handles the sign up process
	// i intentionally didnt use passport for the quickness

	var username = req.body.username;
	var password = req.body.password;
	console.log(username,password);
	if (username != null && username != '' && password != null && password != '') {
		console.log('entered');
		var createdUser = new User({
			username: username,
			password: password
		});
		createdUser.save(function (error, user) {
			if (error) {
				console.log('Error', error);
				res.render('signup', {message: 'error happened'});
			}
			else {
				console.log('New user', user);
				res.render('signin');
			}
		});
		console.log('Finished');
		// createdUser.save(function (err) {
		// 	if (err) {
		// 		console.log('Error');
		// 		res.render('/signup', {message: "Username already exists"});
		// 	} else {
		// 		console.log('Success');
		// 		res.render('/signin');
		// 		// res.send("Signed in");
		// 	}
		// });
	}
});

router.route('/new')
.get(function (req, res) {
	res.render('newQuestionnaire') ;
});



module.exports = router;
