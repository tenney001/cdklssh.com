var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var NewsType = require('./newsType');

//创建新闻文档模型
var NewsSchema = new Schema({
    title:String,
    navType:{
        type:ObjectId,
        ref:'NewsType'
    },
    newsType:{
        type:ObjectId,
        ref:'NewsType'
    },
    describe:String,
    content:String,
    meta: {
        createAt: {
          type: Date,
          default: Date.now()
        },
        updateAt: {
          type: Date,
          default: Date.now()
        }
    }
});

//保存之前处理
NewsSchema.pre('save',function (next) {
    var news = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next();
});

//添加静态方法
NewsSchema.statics = {
    findAll:function(cb) {
        return this
            .find({})
            .sort({'meta.updateAt':-1})
            .exec(cb)
    },
    findById:function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}

module.exports = NewsSchema;