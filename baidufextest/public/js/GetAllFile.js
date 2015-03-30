var fs = require("fs");
exports.getAllFiles = function(path)
{
	console.log(path);
	var fileList = new Array();
	var format = function(time, format)
	{
		var t = new Date(time);
		var tf = function(i)
		{
			return (i < 10 ? '0' : '') + i
		};
		return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
			switch(a){
			case "yyyy":
				return tf(t.getFullYear());break;
			case "MM":
				return tf(t.getMonth() + 1);break;
			case "mm":
				return tf(t.getMinutes());break;
			case "dd":
				return tf(t.getDate());break;
			case "HH":
				return tf(t.getHours());break;
			case "ss":
				return tf(t.getSeconds());break;
			}
		});
	}
	var filesize = function(size)
	{
		
		if(size < 1024)
		{
			return size+'B';
		}
		else
		{
			var k = parseFloat(size/1024);
			if(k<1024)
			{
				return Math.ceil(parseFloat(k))+'KB';
			}
			else
			{
				var m = parseFloat(k/1024);
				if(m < 1024) 
				{
					return Math.ceil(parseFloat(m))+"MB"
				}
				else
				{
					return Math.ceil(parseFloat(m/1024))+"GB";
				}
			}
		}
	}
	var walk = function(path,fileList)
	{
		files = fs.readdirSync(path);
		
		files.forEach(function(item){
			var tempPath = path+'/'+item;
			var fileStatus = fs.statSync(tempPath);
			if (fileStatus === undefined) return;
			if(fileStatus.isDirectory())
			{
				walk(tempPath, fileList);
			}
			else
			{
				var obj={};
				obj['index']=fileList.length;
				obj['isInputHidden'] = true;
				obj['isTextHidden'] = false;
				obj['isFlag'] = false;
				obj['isBackColor'] = false;
				obj['path']=tempPath;
				obj['filename']=tempPath.split('/')[tempPath.split('/').length-1];
				obj['filesize']=filesize(fs.statSync(tempPath).size);
				obj['changeTime']=format(fs.statSync(tempPath).mtime.toLocaleString(),"yyyy-MM-dd HH:mm:ss");
				obj['fileinfos']=fs.statSync(tempPath);
				fileList.push(obj); 
			}
		});
	}
	if(path!=undefined)
	walk(path,fileList);
	return {
		"files": fileList,
		"filesize":filesize,
		"formatdate":format
	}
}
