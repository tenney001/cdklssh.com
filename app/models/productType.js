var mongoose = require('mongoose');
var ProductTypeSchema = require('../schemas/productType');
var ProductType = mongoose.model('ProductType',ProductTypeSchema);

module.exports = ProductType;