/**
 * 这里是书籍列表模块
 * @type {[type]}
 */
var fexModule = angular.module("FileModule",['FileServices','ui.bootstrap']);
fexModule.controller('FileCtrl',['$rootScope','$scope','$modal','$http','DataServices',function($rootScope,$scope,$modal,$http,DataServices) {
	
     $scope.open = function (size) 
     {
        var modalInstance = $modal.open({
            templateUrl: 'myAlert.html',
            controller: 'ModalCtrl',
            size: size,
            resolve: {
                items: function () {
                  return $scope.alert;
                }
              }
            });
     }
     $scope.findAllFiles = function(inputvalue)
     {
        if(typeof inputvalue=="undefined")
        {
            /*alert("文件目录查询输入框不能为空");*/
            $scope.alert = "文件目录查询输入框不能为空";
            $scope.open();
        }
        else
        {
            if(inputvalue.split('/')[inputvalue.split('/').length-1]=='')
            {
                $scope.alert = "不要直接查找根目录下文件哟！格式[D://xxx]";
                $scope.open();
            }
            else
            {
                var dir = {};
                dir['userdir'] = inputvalue;
                DataServices.makeHttpRequest('http://localhost:3000/initpage','POST',dir).promise.then(function (data) {
                //获取后台数据，交给服务处理
                if(data.datastatus==200)
                {
                  $scope.allFileInfos = data.data;
                }
                else if(data.datastatus==400)
                {
                  $scope.alert = data.data;
                  $scope.open();
                }
                
                
                });
            }
        }

     }

     $scope.handlerFileDelete=function()
     {
        var fileObj={};
        var delObj = $scope.delFileInfos;
        console.log(delObj);
        if(delObj == undefined)
        {
           $scope.alert = "亲~没有选中文件呢~";
           $scope.open();
        }
        else
        {
          fileObj['path'] = delObj["path"];
          DataServices.makeHttpRequest('http://localhost:3000/delFile','POST',fileObj).promise.then(function (data) {
            //获取后台数据，交给服务处理
                if(data.delstatus==400)
                {
                    $scope.alert = data.data;
                    $scope.open();
                }
                else if(data.delstatus==200)
                {
                    $scope.alert = data.data;
                    $scope.open();
                    $scope.allFileInfos = DataServices.rebuildFileData(delObj['path'],$scope.allFileInfos);
                }
                
            });
        }
     }

     $scope.handlerMouseClick =function(row)
     {
        if(row.isFlag == true&&row.isBackColor ==true)
        {
            row.isFlag =false;
            row.isBackColor =false;
        }
        else
        {
            row.isFlag = true;
            row.isBackColor =true;
        }
        $scope.delFileInfos = row;
     }

     $scope.handlerRenameClick = function(row)
     {
        row.isTextHidden=true;
        row.isInputHidden=false;
     }
     $scope.handlerCreateNewFile = function(newname)
     {
        if($('#filedir').val()=='')
        {
            $scope.alert = "亲！需要在页面右上角Input框中加入新建文件路径呢~";
            $scope.open();
        }
        else
        {
            var filePath = $('#filedir').val()+'/'+newname;
            console.log("filePath:"+ filePath);
            var newFileObj={};
            newFileObj['path']=filePath;
            newFileObj['originpath']=$('#filedir').val();
            newFileObj['filename']=newname;
            DataServices.makeHttpRequest('http://localhost:3000/newFile','POST',newFileObj).promise.then(function (data) {
            //获取后台数据，交给服务处理
               if(data.datastatus==401)
               {
                  $scope.alert = data.data;
                  $scope.open();
               }
               else if(data.datastatus==400)
               {
                  $scope.alert = data.data;
                  $scope.open();
               }
               else if(data.datastatus==200)
               {
                  $scope.isStartCreateFile=false;
                  $scope.allFileInfos = data.data;   
               }
              
            });
        }
     }
     $scope.handlerStartNewFile = function()
     {
        $scope.isStartCreateFile=true;
     }
     $scope.handlerRenameFile =function(row,newname)
     {
        if(newname == undefined)
        {
            $scope.alert = "名字不能为空~";
            $scope.open();
        }
        else
        {
            var fileRenameParam={};
            var oldPath = row.path;
            var newPath = $('#filedir').val()+'/'+newname;
            fileRenameParam['oldPath'] = oldPath;
            fileRenameParam['newPath'] = newPath;
            function handlerRename()
            {
              var allInfos =  $scope.allFileInfos;
              $scope.allFileInfos = DataServices.renameFile(newname,row,allInfos).newFileList;
              row.isTextHidden=false;
              row.isInputHidden=true;
            }
            DataServices.makeHttpRequest('http://localhost:3000/renameFile','POST',fileRenameParam).promise.then(function (data) {
                //获取后台数据，交给服务处理
                if(data.datastatus==400)
                {
                    $scope.alert = data.data;
                    $scope.open();
                }
                else if(data.datastatus==401)
                {
                    $scope.alert = data.data;
                    $scope.open();
                }
                else if(data.delstatus==200)
                {
                    handlerRename();
                    $scope.alert = data.data;
                    $scope.open();
                }
                    
            });
        }
    
     }
     
}]);


fexModule.controller('ModalCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;


  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
