var express = require('express');
var router = express.Router();
var _ = require('underscore');

var mongoose = require('mongoose');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {

	var currenUser = req.cookies.username;
	console.log(currenUser);
	if (currenUser) {
		User.find({username: currenUser}, function (err) {
			if (err) {res.render('signin');} 
			else {
				res.redirect('/index');
			}
		});
	} else {
		res.render('signin');
	}

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
				res.redirect('/index');
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
	console.log(req.body);
	console.log('------------ RES');
	var username = req.cookies.username;
	var title = req.body.title;
	var description = req.body.description;
	var questions = req.body.question_text;
	var sections = req.body.section_text;
	var types = req.body.type_text;
	var tags = req.body.all_inputs;

	var createdQuestionnaire = new Questionnaire({
		title: title,
		description: description,
		createdBy: username
		// in practice, created by will use the userID not the username
	});

	if (!Array.isArray(questions) && !Array.isArray(sections)) {
		questions = [questions];
		sections = [sections];
	}

	createdQuestionnaire.save(function (err, q) {
		if (err) {
			console.log(err);
		} else {

			for (var i = 0; i < questions.length; i++) {
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
				var createdQ;
				if (qType == "single" || qType == "multiple") {

					// if single or multiple choice question get answers before create question
					var formAnswers = req.body['a'+tags[i]];
					if (formAnswers) {
						// if form answers is an array check if its content doesn't contain empty fields
							// if any empty fields is found, strip it away from the array
						// else form answers is a singlton and therefore check if its not empty and add it to an array
						// and concatinate it to the answers
							// if the singlton is empty, then dont push anything to the array
						if (Array.isArray(formAnswers)) {
							var resultArray = _.without(formAnswers, '');
							console.log(resultArray);
							createdQ = new Question({
								question: questions[i],
								section: sections[i],
								type: qType,
								questionnaireId: q._id,
								answers: resultArray
							});
						} else {
							if (formAnswers != '') {
								createdQ = new Question({
									question: questions[i],
									section: sections[i],
									type: qType,
									questionnaireId: q._id,
									answers: [formAnswers]
								});
							} else {
								createdQ = new Question({
									question: questions[i],
									section: sections[i],
									type: qType,
									questionnaireId: q._id,
									answers: []
								});
							}
						}
					}
				} else {
					createdQ = new Question({
						question: questions[i],
						section: sections[i],
						type: qType,
						questionnaireId: q._id,
						answers: []
					});
				}
				createdQ.save(function (error, ques) {
					if (error) {
						console.log("error", error);
					} else {
						console.log("Success", ques);
					}
				});
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
	var Question = require('../models/question');
	Questionnaire.findById(req.params.id, function (err, doc) {
		if (err) {res.send(err)}
			else {
 			// res.render('view', {doc: doc});
 			Question.find({questionnaireId: doc._id}, function (error, q) {
 				if(error) res.send(error);
 				else {
 					q.sort(function (a, b) {
						// sort according to the value of sections
						if (parseInt(a.section) > parseInt(b.section)) {
							return 1;
						}
						if (parseInt(a.section) < parseInt(b.section)) {
							return -1;
						}
						// a must be equal to b
						return 0;
					});
 					res.render('view', {questionnaire: doc, questions: q});
 				}
 			});
 		}
 	});
});

router.route('/edit/:id')
.get(function (req, res) {
	var Questionnaire = require('../models/questionnaire');
	var Question = require('../models/question');
	Questionnaire.findById(req.params.id, function (err, doc) {
		if (err) {res.send(err)}
			else {
 			// res.render('view', {doc: doc});
 			Question.find({questionnaireId: doc._id}, function (error, q) {
 				if(error) res.send(error);
 				else {
 					q.sort(function (a, b) {
						// sort according to the value of sections
						if (parseInt(a.section) > parseInt(b.section)) {
							return 1;
						}
						if (parseInt(a.section) < parseInt(b.section)) {
							return -1;
						}
						// a must be equal to b
						return 0;
					});
 					res.render('edit', {questionnaire: doc, questions: q});
 				}
 			});
 		}
 	});
});



module.exports = router;
