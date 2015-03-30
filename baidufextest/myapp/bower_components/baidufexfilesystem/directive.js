var umDirective = angular.module('UmDirective', []);
umDirective.directive('myEchart',function(){
        return{
            restrict: 'A',
            scope:true,
            link:function(scope, elem, attr){
                scope.$on("showChart0",function(e, data){
                    if(data.id){
                        $("#"+data.id).setOption(data);
                    }else{
                    	$(elem).css('height','400px');
                    	console.log(elem.context);
                    	myChart = echarts.init(elem.context);
                        myChart.setOption(data);
                    }
                });
            }
        }
 });


umDirective.directive('repeatFinished',['$timeout',function($timeout){
        return{
            link:function(scope){
                if(scope.$last)
                {
                    $timeout(function()
                    {
                        scope.$emit('repeatFinished');
                    })
                }
        }
 }}]);