var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//创建新闻文档模型
var ProductTypeSchema = new Schema({
    name:String,
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
ProductTypeSchema.pre('save',function (next) {
    var product = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next();
});

//添加静态方法
ProductTypeSchema.statics = {
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

module.exports = ProductTypeSchema;