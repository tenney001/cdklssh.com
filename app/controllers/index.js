var mongoose = require('mongoose');
var ProductTypeModel = require('../models/productType');
var ProductType = mongoose.model('ProductType');
var ProductModel = require('../models/product');
var Product = mongoose.model('Product');
var EventProxy = require('eventproxy');



exports.index = function(req,res,next) {
    res.render('index',{
        title:'首页'
    })
}