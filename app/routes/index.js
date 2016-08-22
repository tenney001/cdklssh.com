var express = require('express');
var router = express.Router();
var IndexController = require('../controllers/index');
var mongoose = require('mongoose');
var ProductTypeModel = require('../models/productType');
var ProductType = mongoose.model('ProductType');
var Moment = require('moment')


router.use(function (req,res,next) {
    res.locals.moment = function (t) {
        return Moment(t).format('YYYY-MM-DD');
    }
    res.locals.setCurrentNav = function (url) {
        var _path = req.path;
        var _query = req.query;
        var result = '';

        _path = _query.prdType ? _path+'?prdType='+_query.prdType : _path;
        // console.log('_path:',_path);
        // console.log('url:',url);

        if(_path.indexOf(url) > -1 && url!="/"){
            result = 'active';
        }else if(_path == url && _path=="/"){
            result = 'active';
        }
        return result;
    }
    next();
})

/* GET home page. */
router.get('/', IndexController.index);

// about page.
router.get('/about', IndexController.about);

// products page.
router.get('/products', IndexController.products);

// products detail page.
router.get('/products/:id', IndexController.productDetail);

// contact page.
router.get('/contact', IndexController.contact);


module.exports = router;
