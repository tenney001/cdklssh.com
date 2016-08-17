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
        var result = '';
        if(_path.indexOf(url) >-1){
            result = 'current';
        }
        // console.log('result:',result);
        return result;
    }
    next();
})

/* GET home page. */
router.get('/', IndexController.index);


module.exports = router;
