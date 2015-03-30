

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var port = process.env.PORT||3000;
var app = express();

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(multer({dest: "./uploads",
  onFileUploadComplete: function (file, req, res) {
    res.render('success',{
      title:"文件【"+file.originalname+"】上传成功！"
    });
  }
}));
/*app.use(express.bodyParser({uploadDir:'./uploads'}));*/
app.use(express.static(path.join(__dirname,'myapp')));
app.listen(port);

console.log('baidu started on port'+port);

app.get('/',function(req,res)
{
  res.render('index',{
    title:"百度"
  });
  
});


//首次加载初始化页面
app.post('/initpage',function(req,res)
{
   var fileHandler = require('./public/js/GetAllFile'); 
   var path = req.body.userdir;
   var stat = fs.existsSync(path);
   if(stat == true)
   {
     var fileArray = fileHandler.getAllFiles(path).files;
     var data={};
     data['status']=0;
     data['datastatus']=200;
     data['data']=fileArray;
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end(JSON.stringify(data));
   }
   else
   {
     var data={};
     data['status']=0;
     data['datastatus']=400;
     data['data']="亲~此"+path+"文件路径不存在~请重新填写！";
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end(JSON.stringify(data));
   }
  
});

//删除文件操作
app.post('/delFile',function(req,res)
{
   var path = req.body.path;
   fs.unlink(path, function(err){
     var data={};
     data['status']=0;
     if(err)
     {
        data['data']=path+"文件删除失败！";
        data['delstatus']=400;
     }
     else
     {
        data['data']=path+"文件删除成功！";
        data['delstatus']=200;
     }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify(data));
  });
});

//改变文件名操作
app.post('/renameFile',function(req,res)
{
   var newpath = req.body.newPath;
   var oldpath = req.body.oldPath;
   console.log(newpath+","+oldpath);
   var stat = fs.existsSync(newpath);
   var data={};
   if(stat==true)
   {
      data['status']=0;
      data['datastatus']=400;
      data['data']="此文件已经存在~请换一个名字呦~";
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(JSON.stringify(data));
   }
   else
   {
      fs.rename(oldpath, newpath, function(err){
      data['status']=0;
      if(err)
      {
        data['data']="文件从文件名["+oldpath.split('/')[oldpath.split('/').length-1]+"]改为["+
        newpath.split('/')[newpath.split('/').length-1]+"]失败！";
        data['delstatus']=401;
      }
      else
      {
        data['data']="文件从文件名["+oldpath.split('/')[oldpath.split('/').length-1]+"]改为["+
        newpath.split('/')[newpath.split('/').length-1]+"]成功！";
        data['delstatus']=200;
      }
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(JSON.stringify(data));
    });
   }
   
});

//文件上传

app.post('/fileUpload', function(req, res, next) {
    var data = {};
    if(req.body==null||req.files==null)
    {
        data['status']=0;
    }
    var tmp_path = req.files.uploadfile.path;
    // 指定文件上传后的目录 
    var target_path = './uploads/' + req.files.uploadfile.originalname;
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(tmp_path, function() {
         if (err) throw err;
      });
    });
});


//新建文件
app.post('/newFile', function(req, res, next) {
    var fileHandler = require('./public/js/GetAllFile'); 
    var filepath = req.body.path;
    var filename = req.body.filename;
    var originpath = req.body.originpath;
    var fileArray = fileHandler.getAllFiles(originpath).files;
    var data={};
    data['status']=0;
    if(fs.existsSync(filepath)==true)
    {
       data['datastatus']=401;
       data['data']="该文件已经存在！请重新命名！"
       res.writeHead(200, {'Content-Type': 'text/plain'});
       res.end(JSON.stringify(data));
    }
    else
    {
        var filestatus = fs.openSync(filepath,'w+');
        if(filestatus>=3)
        {
            var obj={};
            obj['isInputHidden'] = true;
            obj['isTextHidden'] = false;
            obj['isFlag'] = false;
            obj['isBackColor'] = false;
            obj['path']=filepath;
            obj['filename']=filename;
            obj['filesize']=fileHandler.getAllFiles().filesize(fs.statSync(filepath).size);
            obj['changeTime']=fileHandler.getAllFiles().formatdate(fs.statSync(filepath).mtime.toLocaleString(),"yyyy-MM-dd HH:mm:ss");
            obj['fileinfos']=fs.statSync(filepath);
            fileArray.unshift(obj);
            data['data']=fileArray;
            data['datastatus']=200;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(data));
        }
        else
        {
            data['datastatus']=400;
            data['data']='文件创建失败';
        }
    }
});
