/**
 * Created by taotao on 2017/5/22.
 */
angular.module('myApp', [
    'ngRoute',
    "lo_register",
    "all_talk",
    "up_headImg",
    "crop_headImg"
]).config(["$routeProvider",function($routeProvider){
        $routeProvider.otherwise({redirectTo: '/lo_register'});
    }]).controller("myCtrl",["$scope","$window","$location",function($scope,$window,$location){
                $scope.loginCondition=$window.localStorage.getItem("login") || false;
                $scope.userName=$window.localStorage.getItem("username") || "";
                $scope.$location=$location;
                if($scope.loginCondition){
                   $location.path("/all_talk");
                }
                $scope.$watch("$location.path()",function(now,old){
//                    if(now=="/lo_register"){
//                        $scope.loginCondition=false;
//                        $scope.userName="";
//                        return;
//                    }
                    $scope.loginCondition=$window.localStorage.getItem("login") || false;
                    $scope.userName=$window.localStorage.getItem("username") || "";
                });
                $scope.exit=function(){
                    $window.localStorage.removeItem("login");
                    $window.localStorage.removeItem("username");
                    $location.path("/lo_register");
                }
    }]);
