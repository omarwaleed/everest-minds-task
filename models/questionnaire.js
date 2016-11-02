var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionnaireSchema = new Schema({

	title: {type: String, required: true},
	description: {type: String, required: true},
	createdBy: {type: String, required: true}

});

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);