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
	}
});

router.route('/new')
.get(function (req, res) {
	res.render('newQuestionnaire') ;
})
.post(function (req, res) {

	var Question = require('../models/question');
	var Questionnaire = require('../models/questionnaire');

	console.log('------------');
	console.log(req.body, req.cookies);
	console.log('------------ RES');
	var username = req.cookies.username;
	var title = req.body.title;
	var description = req.body.description;
	var questions = req.body.question_text;
	var sections = req.body.section_text;
	var types = req.body.type_text;

	var createdQuestionnaire = new Questionnaire({
		title: title,
		description: description,
		createdBy: username
	});

	createdQuestionnaire.save(function (err, q) {
		if (err) {
			console.log(err);
		} else {
			for (var i = 0; i < questions.length - 1; i++) {
				var qType;
				switch (types[i]) {
					case 'Multiple Choice':
						qType = "multiple";
						break;
					case 'Single Choice':
						qType = "single";
						break;
					case 'True/False':
						qType = "bool";
						break;
					case 'Long Description':
						qType = "long";
						break;
					case 'Short Description':
						qType = "short";
						break;
					case 'Date/Time':
						qType = "date";
						break;
					default:
						break;
				}
				var createdQ = new Question({
					question: questions[i],
					section: sections[i],
					type: qType,
					questionnaireId: q._id
				});
				createdQ.save(function (error, ques) {
					if (error) {
						console.log("error", error);
					} else {
						console.log("Success", ques);
					}
				})
			}
		}
	});


	res.redirect('/index');
});

router.get('/index', function (req, res) {

	var Questionnaire = require('../models/questionnaire');
	var allQs = Questionnaire.find({username: req.cookies.username});

	res.render('index', {q: allQs});

});

router.get('/qs', function (req, res) {

	console.log('Called');
	var Questionnaire = require('../models/questionnaire');
	console.log("username", req.cookies.username);
	var allQs = Questionnaire.find({createdBy: req.cookies.username}, function (error, docs) {
		if (error) {res.send();}
		else res.json(docs);
	});
	// console.log(allQs);
	// res.json(allQs);
});

router.get('/view/:id', function (req, res) {
	 var Questionnaire = require('../models/questionnaire');
	 Questionnaire.findById(req.params.id, function (err, doc) {
	 	res.send(doc);
	 });
});



module.exports = router;
