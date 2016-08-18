var mongoose = require('mongoose');
var ProductTypeModel = require('../models/productType');
var ProductType = mongoose.model('ProductType');
var ProductModel = require('../models/product');
var Product = mongoose.model('Product');
var eventproxy = require('eventproxy');

var _ = require('underscore');

// ------------------------------------------
// 产品分类
// ------------------------------------------
// 产品分类列表页
exports.prdTypes = function (req,res,next) {
    ProductType.find().exec(function (err,productTypes) {
        if(err){
            console.log('ProductType.find err.',err);
        }
        res.render('admin/prdTypes',{
            title:'分类列表',
            productTypes:productTypes
        });
    })
}

// 产品分类添加页面
exports.prdTypeAddPage = function (req,res,next) {
    res.render('admin/prdTypeAdd',{
        title:'添加产品分类',
        msg:''
    })
}
exports.prdTypeAdd = function (req,res,next) {
    var name = req.body.name;
    if(!name || name.length==0){
        console.log('name is null')
        res.render('admin/prdTypeAdd',{
            title:'添加产品分类',
            msg:'分类名字不能为空'
        })
    }else{
        ProductType
            .findOne({name:name})
            .exec(function (err,data) {
                if(err){
                    console.log('ProductType.find err.',err);
                }
                // console.log('find data:',data);
                if(!data){
                    var prdObj = new ProductType({name:name});
                    prdObj.save(function (err,data) {
                        if(err){
                            console.log('ProductType.save err.',err);
                        }
                        // console.log('save data:',data);
                        if(data){
                            res.redirect('/admin/prdType');
                        }
                    });
                }else{
                    console.log('name is repeat.')
                    res.render('admin/prdTypeAdd',{
                        title:'添加产品分类',
                        msg:'分类名字已经存在'
                    })
                }
            });
    }
}

// 产品分类编辑页面
exports.prdTypeUpdatePage = function (req,res,next) {
    var id = req.params.id;
    console.log('id:',id);
    ProductType
        .findOne({_id:id})
        .exec(function (err,data) {
            if(err){
                console.log('ProductType.findOne err.',err);
            }else{
                res.render('admin/prdTypeUpdate',{
                    title:'编辑产品分类',
                    prdType:data,
                    msg:''
                })
            }
        })
}
// 产品分类编辑
exports.prdTypeUpdate = function (req,res,next) {
    var id = req.params.id;
    var name = req.body.name;
    console.log('id:',id);
    if(name && name.length>0){
        var prdTypeObj;
        ProductType
            .findOne({_id:id})
            .exec(function (err,data) {
                if(err){
                    console.log('ProductType.findOne err.',err);
                }else{
                    prdTypeObj = _.extend(data,{name:name});
                    prdTypeObj.save(function (err,data) {
                        if(err){
                            console.log('ProductType.save err.',err);
                        }else{
                            res.redirect('/admin/prdType');
                        }
                    })
                }
            });
    }else{
        res.render('admin/prdTypeUpdate',{
            title:'编辑产品分类',
            prdType:{name:name},
            msg:'分类名称不能为空'
        })
    }
    
}
// 产品分类删除
exports.prdTypeDel = function (req,res,next) {
    var id = req.params.id;
    // console.log('id:',id);
    if(id && id.length>0){
        ProductType
            .remove({_id:id})
            .exec(function (err,data) {
                if(err){
                    console.log('ProductType.findOne err.',err);
                }else {
                    res.redirect('/admin/prdType');
                }
            })
    }
}



// ------------------------------------------
// 产品
// ------------------------------------------
// 产品列表页
exports.products = function (req,res,next) {
    Product
        .find()
        .populate('productType', 'name')
        .exec(function (err,products) {
        if(err){
            console.log('Product.find err:',err);
        }
        res.render('admin/products',{
            title:'产品列表',
            products:products,
        });
    })
}
// 产品新增页面
exports.productAddPage = function (req,res,next) {
    ProductType.find(function (err,data) {
        if(err){
            console.log('ProductType.findAll err.',err);
        }
        res.render('admin/productAdd',{
            title:'添加产品',
            prdType:data
        });
    })
}
// 产品新增
exports.productAdd = function (req,res,next) {
    var prdObj = {
        name:req.body.name,
        productType:req.body.productType,
        describe:req.body.describe,
        content:req.body.content
    };
    if(!req.file || req.file.path.length==0){
        res.status(400);
        res.send('产品主图不能为空');
    }else if(!prdObj.name || prdObj.name.length==0){
        res.status(400);
        res.send('产品名称不能为空');
    }else if(!prdObj.productType || prdObj.productType.length==0){
        res.status(400);
        res.send('产品类型不能为空');
    }else if(!prdObj.describe || prdObj.describe.length==0){
        res.status(400);
        res.send('产品描述不能为空');
    }else if(!prdObj.content || prdObj.content.length==0){
        res.status(400);
        res.send('产品内容不能为空');
    }else{
        prdObj.photoName = req.file.originalname;
        prdObj.photoUrl = req.file.path.split('public')[1];

        var _prdObj = new Product(prdObj);
        _prdObj.save(function (err,data) {
            if(err){
                console.log('Product.save err.',err);
            }else{
                res.redirect('/admin/product');
            }
        })
    }
}
// 产品更新页面
exports.productUpdatePage = function (req,res,next) {
    var id = req.params.id;
    if(id && id.length>0){
        var ep = new eventproxy();
        ep.all(['product','prdType'],function (product,prdTypes) {
            res.render('admin/productUpdate',{
                title:'编辑产品',
                product:product,
                prdTypes:prdTypes
            })
        })
        Product
            .findOne({_id:id})
            .populate('productType','name')
            .exec(function (err,data) {
                if(err){
                    console.log('Product.findOne err.',err);
                }else{
                    ep.emit('product', data);
                }
            });
        ProductType
            .find()
            .exec(function (err,data) {
                if(err){
                    console.log('ProductType.find err.',err);
                }else{
                    ep.emit('prdType',data);
                }
            });
    }
}
// 产品更新
exports.productUpdate = function (req,res,next) {
    var id = req.params.id;
    if(id && id.length>0){
        var prdObj = {
            _id:req.body.prdid,
            name:req.body.name,
            productType:req.body.productType,
            describe:req.body.describe,
            content:req.body.content
        };
        if(req.file && req.file.path.length>0){
            prdObj.photoName = req.file.originalname;
            prdObj.photoUrl = req.file.path.split('public')[1];
        }else{
            prdObj.photoName = req.body.photoName;
            prdObj.photoUrl = req.body.photoUrl;
        }
        var _prdObj;
        console.log('prdObj:',prdObj);
        Product
            .findOne({_id:prdObj._id})
            .exec(function (err,data) {
                if(err){
                    console.log('Product.findOne err.',err);
                }else{
                    delete prdObj._id;
                    _prdObj = _.extend(data,prdObj);
                    _prdObj.save(function (err,data) {
                        if(err){
                            console.log('Product.save err.',err);
                        }else{
                            res.redirect('/admin/product');
                        }
                    })
                }
            })
    }
}

// 产品删除
exports.productDel = function (req,res,next) {
    var id = req.params.id;
    if(id && id.length>0){
        Product
            .remove({_id:id})
            .exec(function (err,data) {
                if(err){
                    console.log('Product.remove err.',err);
                }else{
                    res.redirect('/admin/product');
                }
            })
    }
}


// 产品新增/修改
// exports.product = function(req,res,next) {
//     var _news = {
//         _id:req.body.id,
//         title:req.body.title,
//         navType:req.body.navType,
//         newsType:req.body.productType,
//         describe:req.body.describe,
//         content:req.body.content
//     }
//     // console.log('node _news:',_news);
//     if(_news._id){
//         //如果存在，表示为修改
//         News
//             .findOne({_id:_news._id})
//             .exec(function (err,rs_news) {
//                 if(err){
//                     console.log('News.findOne err.',err);
//                 }
//                 delete _news._id;
//                 var _newsObj = _.extend(rs_news,_news);
//                 _newsObj.save(function (err,rs) {
//                     if(err){
//                         console.log('News.save err.',err);
//                     }
//                     if(rs){
//                         res.json({
//                             rs:1,
//                             msg:'保存成功',
//                             data:rs
//                         })
//                     }
//                 })
//             })
//     }
//     // 否则为新增
//     else{
//         delete _news._id;
//         var newsObj = new Product(_news);
//         console.log(newsObj.productType);
//         newsObj.save(function (err,data) {
//             if(err){
//                 console.log('News.save err.',err);
//             }
//             if(data){
//                 res.json({
//                     rs:1,
//                     msg:'保存成功',
//                     data:data
//                 })
//             }
//         })
//     }
// }

// 产品删除
// exports.productDel = function (req,res,next) {
//     var id = req.body.id;
//     if(id){
//         News.remove({_id:id},function (err,data) {
//             // console.log('remove rs data:',data);
//             if(err){
//                 console.log('News.remove err.',err);
//                 res.json({
//                     rs:0,
//                     msg:err
//                 })
//             }else if(data.result.ok==1 && data.result.n==1){
//                 res.json({
//                     rs:1,
//                     msg:'删除成功'
//                 })
//             }else{
//                 res.json({
//                     rs:0,
//                     msg:'找不到该条数据'
//                 })
//             }
//         })
//     }
// }

// // 产品修改页面
// exports.productUpdatePage = function (req,res,next) {
//     var id = req.params.id;
//     News
//         .find({_id:id})
//         .populate('newsType', 'name')
//         .exec(function (err,_news) {
//             if(err){
//                 console.log('News.findOne err.',err);
//             }
//             if(_news.length>0){
//                 console.log("_news:",_news)
//                 ProductType.findAll(function (err,newstype) {
//                     if(err){
//                         console.log('ProductType.findAll err.',err);
//                     }
//                     res.render('admin/productUpdate',{
//                         title:'编辑产品',
//                         newsType:newstype,
//                         news:_news[0],
//                     });
//                 })
//             }else{
//               var err = new Error('Not Found');
//               err.status = 404;
//               next(err);
//             }
//         })
// }









// 获取所有分类
// exports.productTypeList = function (req,res,next) {
//     NewsType
//         .find()
//         .populate('newsType','name')
//         .exec(function (err,newstypes) {
//             if(err){
//                 console.log('ProductType.findAll err:',err);
//             }
//             res.json({rs:1,msg:'获取成功',data:newstypes});
//         })
// }

// // 新增分类
// exports.productTypeAdd = function(req,res,next) {
//     var name = req.body.name;
//     var pid = req.body.pid;
//     ProductType.findOne({name:name},function(err,newsType) {
//         if(err){
//             console.log('ProductType.findOne err:',err);
//         }
//         if(newsType){
//             res.json({rs:3,msg:'已有同名分类'})
//         }else{
//             var _productType = new ProductType({name:name,pid:pid});
//             _productType.save(function(err,data) {
//                 if(err){
//                     console.log('_productType.save err:',err);
//                 }
//                 res.json({rs:1,msg:'添加成功'});
//             })
//         }
//     })
// }

// // 分类更新
// exports.productTypeUpdate = function (req,res,next) {
    
//     var _id=req.body.id;
//     var name=req.body.name;
//     var pid=req.body.pid;

//     var _productType;

//     ProductType.findOne({_id:_id},function (err,newsType) {
//         if(err){
//             console.log('ProductType.findOne err:',err);
//         }
//         if(newsType){
//             _productType = _.extend(newsType,{name:name,pid:pid});
//             _productType.save(function(err) {
//                 if(err){
//                     console.log('ProductType.save err:',err);
//                 }
//                 res.json({
//                     rs:1,
//                     msg:'修改成功'
//                 });
//             })
//         }
//     })
// }

// // 分类删除
// exports.productTypeDel = function(req,res,next) {
//     var _id=req.body.id;
//     ProductType.remove({_id:_id},function(err,data) {
//         if(err){
//             console.log('ProductType.remove err:',err);
//         }
//         // console.log('remove_rs:',data);
//         res.json({
//             rs:1,
//             msg:'删除成功'
//         })
//     })
    
// }


// // 产品列表
// exports.productList = function (req,res,next) {
//     News
//         .find({})
//         .populate('newsType', 'name')
//         .exec(function (err,newslist) {
//             if(err){
//                 console.log('News.findAll err:',err);
//             }
//             res.json({
//                 rs:1,
//                 data:newslist,
//                 msg:'获取成功'
//             })
//         })
// }



