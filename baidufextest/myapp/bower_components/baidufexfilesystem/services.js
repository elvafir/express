var fileServices = angular.module('FileServices', []);
fileServices.service('DataServices',['$http','$q',function($http,$q){
	this.makeHttpRequest = function(url, method, params, config) {
            var httpRequest;
            var defer = $q.defer();

            params = params || {};

            if (method == 'GET') {
                httpRequest = config ? $http.get(url, config) : $http.get(url);
            } else if (method == 'POST') {
                /*angular.extend(params, {"hqc_name": hacToken,isajax:true});*/
                httpRequest = config ? $http.post(url, params, config) : $http.post(url, params);
                console.log('eneter');
                console.log(httpRequest);
            }
            httpRequest.success(function(data) {
                if (data.status == 0) {
                    defer.resolve(data);
                } else {
                    defer.reject(data);
                }
            }).error(function(msg) {
                defer.reject(msg);
            });

            return {
                promise: defer.promise
            }
        };

    this.rebuildFileData = function(filePath,DataArray) {

            var DataFileList = DataArray;
            console.log('path:'+filePath);
            for(var i=0;i<DataFileList.length;i++)
            {
                if(DataFileList[i].path==filePath)
                {
                    console.log("DataFileList[i].path");
                    console.log(DataFileList[i].path);
                    DataFileList.splice(i,1);break;
                }
            }
            return DataFileList;

        };
   this.renameFile = function(newname,row,DataArray) {

            var DataFileList = DataArray;
            var renameObj = {};
            for(var i=0;i<DataFileList.length;i++)
            {
                if(DataFileList[i].path == row.path)
                {
                    DataFileList[i].filename = newname;
                    var dataList = DataFileList[i].path.split('/');
                    dataList[dataList.length-1] = newname;
                    DataFileList[i].path = dataList.join('/');
                    renameObj['newPath'] = DataFileList[i].path; break;
                }
            }
            renameObj['newFileList'] = DataFileList;
            return renameObj;
   };

}]);