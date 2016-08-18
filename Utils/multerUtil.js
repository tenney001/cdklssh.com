var multer = require('multer');
var storage = multer.diskStorage({
    // 设置上传后文件路径
    destination:function (req,file,cb) {
        cb(null,'./public/upload/prdImages');
    },
    // 给上传文件重命名，添加后缀名
    filename:function (req,file,cb) {
        var fileFormat = file.originalname.split('.');
        cb(null,file.fieldname+'_'+Date.now()+'.'+fileFormat[fileFormat.length-1]);
    }
});

// 添加配置文件到multer对象.
var upload = multer({
    storage:storage,
    // 添加上传限制
    limits:{
        fileSize:2*1024*1024    //上传单个文件最大限制为2M
    }
});

// 导出对象
module.exports = upload;