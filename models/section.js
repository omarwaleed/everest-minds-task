var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SectionSchema = new Schema({

	questionnaireId: Schema.Types.ObjectId;

});

module.exports = mongoose.model('Section', SectionSchema);