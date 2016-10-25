var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionnaireSchema = new Schema({

	title: String,
	description: String

});

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);