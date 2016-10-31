var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({

	sectionId: {
		type: Schema.Types.ObjectId,
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
	answer: {
		type: [Schema.Types.Mixed]
	}

});

module.exports = mongoose.model('Section', QuestionSchema);