/**
 * Created by taotao on 2017/5/24.
 */
(function(angular){
    angular.module("member_list",["ngRoute"])
        .config(["$routeProvider",function($routeProvider){
            $routeProvider.when("/member_list/:page",{
                templateUrl:"member_list/member_list.html",
                controller:"memberList"
            })
        }])
        .controller("memberList",["$scope","$http","$route","$routeParams",function($scope,$http,$route,$routeParams){
               $scope.subject=[];
               $scope.page=parseInt($routeParams.page);
               $scope.totalPage=1;
               $scope.pageNum=12;
               $http({
                   url:"/get_member_list",
                   method:"post",
                   data:{
                       page: $scope.page,
                       pageNum:$scope.pageNum
                   }
               }).then(function(res){
                   $scope.subject=res.data.result;
                   $scope.totalPage=Math.ceil(res.data.count/$scope.pageNum);
               },function(err){
                   console.log(err)
               });

            $scope.goPage=function(page) {
                if(page>=1 && page<=$scope.totalPage){
                    $route.updateParams({page:page});
                }
            }

        }])
})(angular);