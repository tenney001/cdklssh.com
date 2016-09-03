var express = require('express');
var upload = require('../../Utils/multerUtil');
var router = express.Router();
var Product = require('../controllers/product');
var Login = require('../controllers/login');

router.use(function (req,res,next) {
    res.locals.setNavActive = function (url) {
        var _path = '/admin'+req.path;
        var result = '';
        if(_path.indexOf(url) >-1){
            result = 'active';
        }
        return result;
    }
    // 判断登录
    if(!req.session.user && req.path !=='/login'){
        return res.redirect('/admin/login');
    }else{
        next();
    }
})

/* Admin. */
// login page
router.get('/login',Login.getLogin);

// postLogin
router.post('/login',Login.postLogin);

// login page
router.get('/index',Login.index);

// logout get
router.get('/logout',Login.logout);

// productTypes----------------------------------------------
// productTypes list page
router.get('/prdType', Product.prdTypes);

// productType add page
router.get('/prdType/add',Product.prdTypeAddPage);

// productType add post
router.post('/prdType/add',Product.prdTypeAdd);

// productType update page
router.get('/prdType/update/:id',Product.prdTypeUpdatePage);

// productType update post
router.post('/prdType/update/:id',Product.prdTypeUpdate);

// productType delete get
router.get('/prdType/del/:id',Product.prdTypeDel);


// products------------------------------------------------------
// products list page
router.get('/product', Product.products);

// product add page
router.get('/product/add', Product.productAddPage);

// product add post
router.post('/product/add',upload.single('photo'), Product.productAdd);

// product update page
router.get('/product/update/:id',Product.productUpdatePage);

// product update post
router.post('/product/update/:id',upload.single('photo'),Product.productUpdate);

// product delete get
router.get('/product/del/:id',Product.productDel);



module.exports = router;
