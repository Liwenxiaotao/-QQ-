/**
 * Created by taotao on 2017/5/23.
 */
(function(angular,$){
    angular.module("up_headImg",["ngRoute"])
        .config(["$routeProvider",function($routeProvider){
            $routeProvider.when("/up_headImg",{
               templateUrl:"up_headImg/up_headImg.html" ,
               controller:"upHeadImg"
            })
        }])
        .controller("upHeadImg",["$scope","$window","$http","$location","$timeout",function($scope,$window,$http,$location,$timeout){
            $scope.username=$window.localStorage.getItem("username");
            $scope.loading=false;
            $scope.tagTo=function(){
                $scope.loading=true;
                $timeout(function(){
                    $scope.loading=false;
                    $location.path("/crop_headImg")
                },1000);

            }
        }])
})(angular,jQuery);