var mongoose = require('mongoose');
var NewsTypeModel = require('../models/newsType');
var NewsType = mongoose.model('NewsType');
var NewsModel = require('../models/news');
var News = mongoose.model('News');

var _ = require('underscore');

// 分类列表
exports.newsTypePage = function (req,res,next) {
    NewsType.find({pid:""}).exec(function (err,newstypes) {
        if(err){
            console.log('NewsType.find err.',err);
        }
        res.render('admin/newsType',{
            title:'分类列表',
            newsType:newstypes
        });
    })
}

// 获取所有分类
exports.newsTypeList = function (req,res,next) {
    NewsType
        .find()
        .populate('newsType','name')
        .exec(function (err,newstypes) {
            if(err){
                console.log('NewsType.findAll err:',err);
            }
            res.json({rs:1,msg:'获取成功',data:newstypes});
        })
}

// 新增分类
exports.newsTypeAdd = function(req,res,next) {
    var name = req.body.name;
    var pid = req.body.pid;
    NewsType.findOne({name:name},function(err,newsType) {
        if(err){
            console.log('newsType.findOne err:',err);
        }
        if(newsType){
            res.json({rs:3,msg:'已有同名分类'})
        }else{
            var _newsType = new NewsType({name:name,pid:pid});
            _newsType.save(function(err,data) {
                if(err){
                    console.log('_newsType.save err:',err);
                }
                res.json({rs:1,msg:'添加成功'});
            })
        }
    })
}

// 分类更新
exports.newsTypeUpdate = function (req,res,next) {
    
    var _id=req.body.id;
    var name=req.body.name;
    var pid=req.body.pid;

    var _newsType;

    NewsType.findOne({_id:_id},function (err,newsType) {
        if(err){
            console.log('NewsType.findOne err:',err);
        }
        if(newsType){
            _newsType = _.extend(newsType,{name:name,pid:pid});
            _newsType.save(function(err) {
                if(err){
                    console.log('NewsType.save err:',err);
                }
                res.json({
                    rs:1,
                    msg:'修改成功'
                });
            })
        }
    })
}

// 分类删除
exports.newsTypeDel = function(req,res,next) {
    var _id=req.body.id;
    NewsType.remove({_id:_id},function(err,data) {
        if(err){
            console.log('NewsType.remove err:',err);
        }
        // console.log('remove_rs:',data);
        res.json({
            rs:1,
            msg:'删除成功'
        })
    })
    
}

// 新闻列表页面
exports.newsListPage = function (req,res,next) {
    // News.findAll(function (err,newses) {
    //     if(err){
    //         console.log('News.findAll err:',err);
    //     }
        res.render('admin/newsList',{
            title:'新闻列表',
            // list:newses,
        });
    // })
}

// 新闻列表
exports.newsList = function (req,res,next) {
    News
        .find({})
        .populate('newsType', 'name')
        .exec(function (err,newslist) {
            if(err){
                console.log('News.findAll err:',err);
            }
            res.json({
                rs:1,
                data:newslist,
                msg:'获取成功'
            })
        })
}

// 新闻新增页面
exports.newsAddPage = function (req,res,next) {
    NewsType.findAll(function (err,data) {
        if(err){
            console.log('NewsType.findAll err.',err);
        }
        res.render('admin/newsAdd',{
            title:'添加新闻',
            newsType:data
        });
    })
}

// 新闻新增/修改
exports.news = function(req,res,next) {
    var _news = {
        _id:req.body.id,
        title:req.body.title,
        navType:req.body.navType,
        newsType:req.body.newsType,
        describe:req.body.describe,
        content:req.body.content
    }
    // console.log('node _news:',_news);
    if(_news._id){
        //如果存在，表示为修改
        News
            .findOne({_id:_news._id})
            .exec(function (err,rs_news) {
                if(err){
                    console.log('News.findOne err.',err);
                }
                delete _news._id;
                var _newsObj = _.extend(rs_news,_news);
                _newsObj.save(function (err,rs) {
                    if(err){
                        console.log('News.save err.',err);
                    }
                    if(rs){
                        res.json({
                            rs:1,
                            msg:'保存成功',
                            data:rs
                        })
                    }
                })
            })
    }
    // 否则为新增
    else{
        delete _news._id;
        var newsObj = new News(_news);
        console.log(newsObj.newsType);
        newsObj.save(function (err,data) {
            if(err){
                console.log('News.save err.',err);
            }
            if(data){
                res.json({
                    rs:1,
                    msg:'保存成功',
                    data:data
                })
            }
        })
    }
}

// 新闻删除
exports.newsDel = function (req,res,next) {
    var id = req.body.id;
    if(id){
        News.remove({_id:id},function (err,data) {
            // console.log('remove rs data:',data);
            if(err){
                console.log('News.remove err.',err);
                res.json({
                    rs:0,
                    msg:err
                })
            }else if(data.result.ok==1 && data.result.n==1){
                res.json({
                    rs:1,
                    msg:'删除成功'
                })
            }else{
                res.json({
                    rs:0,
                    msg:'找不到该条数据'
                })
            }
        })
    }
}

// 新闻修改页面
exports.newsUpdatePage = function (req,res,next) {
    var id = req.params.id;
    News
        .find({_id:id})
        .populate('newsType', 'name')
        .exec(function (err,_news) {
            if(err){
                console.log('News.findOne err.',err);
            }
            if(_news.length>0){
                console.log("_news:",_news)
                NewsType.findAll(function (err,newstype) {
                    if(err){
                        console.log('NewsType.findAll err.',err);
                    }
                    res.render('admin/newsUpdate',{
                        title:'编辑新闻',
                        newsType:newstype,
                        news:_news[0],
                    });
                })
            }else{
              var err = new Error('Not Found');
              err.status = 404;
              next(err);
            }
        })
}


