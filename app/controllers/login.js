// login page
exports.getLogin = function (req,res,next) {
    res.render('admin/login',{
        title:'登录'
    })
}

// login post
exports.postLogin = function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    if(username === 'admin' && password === 'kls@admin'){
        // 登录成功，跳转到首页
        req.session.user = 'admin';
        res.redirect('/admin/product');
    }else{
        res.redirect('/admin/login');
    }
}

// admin index
exports.index = function (req,res,next) {
    res.redirect('/admin/product');
}

// logout get
exports.logout = function (req,res,next) {
    req.session.user = null;
    res.redirect('/admin/login');
}