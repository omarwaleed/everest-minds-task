var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({

	section: {
		type: String,
		required: true
	},
	question: {
		type: String,
		required: true
	},
	type: {
		type: String,
		enum: ['multiple', 'single', 'bool', 'long', 'short', 'date']
	},
	questionnaireId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	answers: {
		type: [String]
	}

});

module.exports = mongoose.model('Question', QuestionSchema);