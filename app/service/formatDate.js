/**
 * Created by taotao on 2017/5/24.
 */
(function(angular){
   var Format= angular.module("format_date",[]);
    Format.service("formatDate",function(){
        this.format=function(date){
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var min=date.getMinutes();
                var s=date.getSeconds();
                if(parseInt(min)<10){
                    min="0"+min
                }
                if(parseInt(s)<10){
                    s="0"+s
                }
            return(y+"年"+m+"月"+d+"日"+"  "+h+":"+min+":"+s)
            }
    })
})(angular);