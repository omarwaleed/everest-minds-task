var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SectionSchema = new Schema({

	name: {
		type: String,
		required: true
	},
	questionnaireId: {
		type: [Schema.Types.ObjectId],
		required: true
	}

});

module.exports = mongoose.model('Section', SectionSchema);