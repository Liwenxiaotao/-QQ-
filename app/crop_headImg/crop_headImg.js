/**
 * Created by taotao on 2017/5/23.
 */
(function(angular,$){
    angular.module("crop_headImg",["ngRoute"])
        .config(["$routeProvider",function($routeProvider){
            $routeProvider.when("/crop_headImg",{
                templateUrl:"crop_headImg/crop_headImg.html",
                controller:"cropHeadImg"
            })
        }])
        .controller("cropHeadImg",["$scope","$http","$window","$location","$timeout",function($scope,$http,$window,$location,$timeout){
            var username=$window.localStorage.getItem("username");
            $scope.pathImg="../session/"+username+".jpg";
            $scope.loading=false;
            var w="";
            var h="";
            var x="";
            var y="";
            $timeout(function(){
                $('#cropImg').cropper({
                    aspectRatio: 1/1,
                    preview:".preview"
                });
            },500);
            $scope.doCrop=function(){
             var dataObj=$('#cropImg').cropper("getData",true);
               w=dataObj.width;
               h=dataObj.height;
               x=dataObj.x;
               y=dataObj.y;
               $scope.loading=true;
//               console.log(dataObj);
//               alert(x+"___"+"y"+"__"+w+"__"+h);
               $http({
                   url:"/cropHeadImg?w="+w+"&h="+h+"&x="+x+"&y="+y+"&username="+username,
                   method:"get"
               }).then(function(res){
                  if(res.data=="1"){
                    $scope.loading=false;
                    $('#myModal').modal('show');
                    $timeout(function(){
                        location.href="/"
                    },2000)
                  }
               },function(err){
                   console.log(err)
               })
            }
        }])
})(angular,jQuery);