var mongoose = require('mongoose');
var ProductTypeModel = require('../models/productType');
var ProductType = mongoose.model('ProductType');
var ProductModel = require('../models/product');
var Product = mongoose.model('Product');
var EventProxy = require('eventproxy');


// 首页
exports.index = function(req,res,next) {
    Product
        .find()
        .exec(function (err,data) {
            if(err){
                console.log('Product.find err.',err);
            }
            // console.log('list:',data);
            res.render('index',{
                title:'首页',
                list:data
            })
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
    var ptype = req.query.prdType;
    // console.log('ptype:',ptype);
    var conditions = {};
    if(ptype){
        conditions.productType = ptype;
    }
    var ep = new EventProxy();
    ep.all(['product','prdType'],function (products,prdTypes) {
        // console.log('products:',products);
        res.render('products',{
            title:'产品服务',
            products:products,
            prdTypes:prdTypes
        })
    })
    Product
        .find(conditions)
        .exec(function (err,data) {
            if(err){
                console.log('Product.find err.',err);
            }
            ep.emit('product',data);
        });
    ProductType
        .find()
        .exec(function (err,data) {
            if(err){
                console.log('ProductType.find err.',err);
            }
            ep.emit('prdType',data);
        })
    
}

// 产品详细
exports.productDetail = function (req,res,next) {
    var id = req.params.id;
    if(!id){
        res.send('参数错误');
    }
    Product
        .findOne({_id:id})
        .exec(function (err,data) {
            if(err){
                console.log('Product.find err.',err);
            }
            res.render('productDetail',{
                title:'产品服务',
                obj:data
            })
        })
}

// 联系我们
exports.contact = function (req,res,ne) {
    res.render('contact',{
        title:'联系我们'
    })
}