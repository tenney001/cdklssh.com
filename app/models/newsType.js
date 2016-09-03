var mongoose = require('mongoose');
var NewsTypeSchema = require('../schemas/newsType');
var NewsType = mongoose.model('NewsType',NewsTypeSchema);

module.exports = NewsType;