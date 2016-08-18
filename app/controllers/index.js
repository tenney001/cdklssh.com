var mongoose = require('mongoose');
var ProductTypeModel = require('../models/productType');
var ProductType = mongoose.model('ProductType');
var ProductModel = require('../models/product');
var Product = mongoose.model('Product');
var EventProxy = require('eventproxy');


// 首页
exports.index = function(req,res,next) {
    res.render('index',{
        title:'首页'
    })
}

// 关于我们
exports.about = function (req,res,next) {
    res.render('about',{
        title:'关于我们'
    })
}

// 产品列表
exports.products = function (req,res,next) {
    res.render('products',{
        title:'产品服务'
    })
}

// 联系我们
exports.contact = function (req,res,ne) {
    res.render('contact',{
        title:'联系我们'
    })
}