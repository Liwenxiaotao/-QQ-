/**
 * Created by taotao on 2017/5/22.
 */
(function(angular,$){
    angular.module("all_talk",["ngRoute","format_date"])
        .config(["$routeProvider",function($routeProvider){
                $routeProvider.when("/all_talk",{
                    templateUrl:"all_talk/all_talk.html",
                    controller:"allTalkCtrl"
                }).when("/my_talk",{
                    templateUrl:"all_talk/all_talk.html",
                    controller:"allTalkCtrl"
                })
        }])
        .filter("isExist",function(){
            return function(value,arr){
                if($.inArray(value,arr)==-1){
                    return false
                }
                return true
            }
        })
        .controller("allTalkCtrl",["$scope","$http","$window","$timeout","formatDate","$location",function($scope,$http,$window,$timeout,formatDate,$location){
            $('[data-toggle="tooltip"]').tooltip();
            $('#myTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show')
            });
            var username=$window.localStorage.getItem("username");
            $scope.username=username;
            $scope.headImgPath="";
            $scope.content="";
            $scope.showInfo=false;
            $scope.subjects=[];
            $scope.obj={};
            $scope.flag1=false;
            $scope.flag2=true;
            $scope.page=1;
            $scope.pageNum=2;
            $scope.updateNum=0;
            $scope.buttonInfo="加载显示更多...";
            $scope.totalPage=0;
            $scope.commentAll={};
            $scope.favours={};
            $scope.$location=$location;
            $scope.showTalk=$location.path();
            $scope.$watch("$location.path()",function(now,old){
                $scope.showTalk=now;
            });
            //显示、隐藏全文
            $scope.showAll=function(event){
                $(event.target).parent().siblings().removeClass("ng-hide");
                $(event.target).parent().siblings().find("span").removeClass("ng-hide")
                $(event.target).parent().addClass("ng-hide");
            };
            $scope.hideAll=function(){
                $(event.target).parent().addClass("ng-hide");
                $(event.target).parent().siblings().removeClass("ng-hide");
            };
            //获取用户信息
               $http({
                   url:"/getUserInfo?username="+username,
                   method:"get"
               }).then(function(res){
               $scope.headImgPath="../images/"+res.data.result[0].headImg;
            },function(err){
               console.log(err)
            });
//            alert(formatDate.format(new Date()));
            //发布说说
            $scope.postInfo=function(){
               $http({
                   url:"/postInfo",
                   method:"post",
                   data:{
                       username:username,
                       content:$scope.content,
                       headImg: $scope.headImgPath
                   }
               }).then(function(res){
                    if(res.data.data=="success"){
                         $scope.obj={
                            _id:"noRefresh",
                            date:new Date(),
                            username:username,
                            headImg:$scope.headImgPath,
                            content:$scope.content,
                            comment:[],
                            favours:[]};
                        $scope.subjects.unshift($scope.obj);
                        $scope.showInfo=true;
                        $scope.content="";
                        $scope.updateNum++;
                        $timeout(function(){
                            $scope.showInfo=false
                        },1000)
                    }
               },function(err){
                   console.log(err)
               })
            };
            //获取第一页说说
            $http({
                url:"/getAllTalk",
                method:"post",
                data:{
                    username:$scope.username,
                    showTalk:$scope.showTalk,
                    page:$scope.page,
                    pageNum:$scope.pageNum,
                    updateNum:$scope.updateNum
                }
            }).then(function(res){
                for(var i=0;i<res.data.result.length;i++){
                    var id=res.data.result[i]._id;
                    $scope.favours[id]=res.data.result[i].favours;
                    $scope.commentAll[id]=res.data.result[i].comment;
                    for(var j=0;j<$scope.commentAll[id].length;j++){
                        $scope.commentAll[id][j].date=new Date($scope.commentAll[id][j].date);
                    }
                }
                console.log($scope.commentAll);
                $scope.subjects=res.data.result;
                $scope.totalPage=Math.ceil(parseInt(res.data.sum)/parseInt($scope.pageNum));
                $scope.page++;
                if($scope.page>$scope.totalPage){
                    $scope.buttonInfo="没有更多数据...";
                }
            },function(err){
                console.log(err)
            });
            //加载更多数据
            $scope.loadMore=function(){
                if($scope.page>$scope.totalPage){
                    return;
                }
                $http({
                    url:"/getAllTalk",
                    method:"post",
                    data:{
                        username:$scope.username,
                        showTalk:$scope.showTalk,
                        page:$scope.page,
                        pageNum:$scope.pageNum,
                        updateNum:$scope.updateNum
                    }
                }).then(function(res){
                    for(var i=0;i<res.data.result.length;i++) {
                        var id=res.data.result[i]._id;
                        $scope.favours[id]=res.data.result[i].favours;
                        $scope.commentAll[id]=res.data.result[i].comment;
                        for(var j=0;j<$scope.commentAll[id].length;j++){
                            $scope.commentAll[id][j].date=new Date($scope.commentAll[id][j].date);
                        }
                        $scope.subjects.push(res.data.result[i]);
                    }
                    $scope.page++;
                    if($scope.page>$scope.totalPage){
                        $scope.buttonInfo="没有更多数据...";
                    }
                },function(err){
                    console.log(err)
                });
            };
            //发表评论
            $scope.postComment=function(event){
                var id=event.target.getAttribute("data-id");
                var comment=$(event.target).siblings().find("input").val();
                $http({
                    url:"/post_comment",
                    method:"post",
                    data:{
                        comment:comment,
                        id:id,
                        username:username,
                        headImgPath:$scope.headImgPath
                    }
                }).then(function(res){
                    if(res.data=="success"){
                        $(event.target).siblings().find("input").val("");
                        $scope.commentAll[id].unshift({commentData:comment,username:username,date:new Date(),headImgPath:$scope.headImgPath,id:id})
                    }
                },function(err){
                    console.log(err)
                })
            };
            //收起、展开评论
            $scope.showComment=function(event){
                var buttonObj=$(event.target);
                var commentObj= buttonObj.parents(".talk").siblings(".comment");
                if(commentObj.hasClass("ng-hide")){
                    buttonObj.addClass("active");
                    commentObj.removeClass("ng-hide");
                    return;
                }else{
                    buttonObj.removeClass("active");
                    commentObj.addClass("ng-hide");
                }

            };
            //点赞
            $scope.doFavour=function(event){
               var id=event.target.getAttribute("data-id");
              if($.inArray(username,$scope.favours[id])==-1){
                  $http({
                      url:"/do_favour",
                      method:"post",
                      data:{
                          id:id,
                          username:username,
                          method:"push"
                      }
                  }).then(function(res){
                      if(res.data=="success"){
                          $scope.favours[id].push(username);
                          $(event.target).addClass("active");
                      }
                  },function(err){
                      console.log(err)
                  });

              }else{
                  $http({
                      url:"/do_favour",
                      method:"post",
                      data:{
                          id:id,
                          username:username,
                          method:"pull"
                      }
                  }).then(function(res){
                      if(res.data=="success"){
                          $scope.favours[id].splice($.inArray(username,$scope.favours[id]),1);
                          $(event.target).removeClass("active");
                      }
                  },function(err){
                      console.log(err)
                  });

              }
//

            }
        }])
})(angular,jQuery);