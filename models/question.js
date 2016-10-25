var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({

	sectionId: mongoose.objectId;

});

module.exports = mongoose.model('Section', QuestionSchema);