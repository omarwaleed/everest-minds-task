var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SectionSchema = new Schema({

	questionnaireId: mongoose.objectId;

});

module.exports = mongoose.model('Section', SectionSchema);