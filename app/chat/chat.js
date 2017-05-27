/**
 * Created by taotao on 2017/5/26.
 */
(function(angular,$,io){
    angular.module("chat",["ngRoute"])
        .config(["$routeProvider",function($routeProvider){
            $routeProvider.when("/chat",{
                templateUrl:"chat/chat.html",
                controller:"chat"
            })
        }])
        .controller("chat",["$scope","$location","$timeout","$window","$http",function($scope,$location,$timeout,$window,$http){
            $('#myModal').modal({
                keyboard:false,
                backdrop:'static'
            })
            $('#myModal').on('hidden.bs.modal', function (e) {
                $timeout(function(){
                    $location.path("/all_talk")
                },50)
            })
            $('[data-toggle="popover"]').popover("show");


            $scope.subject=[];
            $scope.username=$window.localStorage.getItem("username");
            $scope.word="";
            var headImgPath="";
            var socket=io();
            $http({
                url:"/getUserInfo?username="+$scope.username,
                method:"get"
            }).then(function(res){
                headImgPath="../images/"+res.data.result[0].headImg;
            },function(err){
                console.log(err)
            });
            $scope.send=function(event){
                socket.emit("chat",{
                    username:$scope.username,
                    word:$scope.word,
                    headImgPath:headImgPath
                });
                   $scope.word="";
                   $(event.target).parent().siblings().get(0).focus()
            };
            socket.on("chat",function(msg){
                $timeout(function(){
                    $scope.subject.push(msg);
                },100)
            })
        }])
})(angular,jQuery,io);