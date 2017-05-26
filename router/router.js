/**
 * Created by taotao on 2017/5/22.
 */
var db=require("../module/db");
var formidable=require("formidable");
var md5=require("../module/md5");
var fs=require("fs");
var gm =require("gm");
var path=require("path");
var ObjectId=require("mongodb").ObjectID;
exports.doRegister=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            res.send("-2");
            return;
        }
       var username=fields.user;
       var password=md5(md5(fields.password)+"taotao");
       db.find("users",{condition:{username:username}},function(err,result){
           if(err){
               console.log(err);
               res.send("-2");
               return;
           }
           if(result.length!=0){
               res.send("-1");
               return;
           }
           db.insertOne("users",{username:username,password:password,headImg:"default.jpg"},function(err,result){
               if(err){
                   console.log("err");
                   res.send("-2");
               }else{
                   res.send("1");
               }
           })
       })
    })
};
exports.doLogin=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            res.send("-3");
            return
        }
        var username=fields.username;
        var password=md5(md5(fields.password)+"taotao");
        db.find("users",{condition:{username:username}},function(err,result){
            if(err){
                console.log(err);
                res.send("-3");
                return;
            }
            if(result.length==0){
                res.send("-2");
                return
            }
            if(password!=result[0].password){
                res.send("-1");
                return;
            }else{
                res.send("1");
                return;
            }

        })
    })
};
exports.getUserInfo=function(req,res,next){
        var username=req.query.username;
        db.find("users",{condition:{username:username}},function(err,result){
            if(err){
                console.log(err);
                res.send("-2");
                return;
            }
            res.json({result:result});
        })
};
exports.upHeadImg=function(req,res,next){
   var form=new formidable.IncomingForm();
    form.uploadDir="./app/session";
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            return;
        }

        if(files.imgHead.size==0){
            return;
        }
//       console.log(files);
        var username=fields.username;
        var oldname=files.imgHead.path;
        var newname="./app/session/"+username+".jpg";
         fs.rename(oldname,newname,function(err){
            if(err){
                console.log(err);
                return;
            }
         })
    })
};
exports.cropHeadImg=function(req,res,next){
    var username=req.query.username;

    var w= req.query.w;
    var h= req.query.h;
    var x= req.query.x;
    var y= req.query.y;
    var oldPath=path.normalize(__dirname+"/../app/session/"+username+".jpg");
    var newPath=path.normalize(__dirname+"/../app/images/"+username+".jpg");
    fs.stat(newPath,function(err,stats){
        if(!err){
            fs.unlink(newPath);
        }
        gm(oldPath).crop(w,h,x,y).resize(100, 100, "!").write(newPath,function(err){
            if(err){
                console.log(err);
                return;
            }
            fs.unlink(oldPath);
            db.updateMany("users",{username:username},{$set:{headImg:username+".jpg"}},function(err,result){
                if(err){
                    console.log(err);
                    return;
                }
                res.send("1")
            })
        });
    });
};
exports.postInfo=function(req,res,next){
    var form=new formidable.IncomingForm;
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            return;
        }
        var username=fields.username;
        var content=fields.content;
        var headImg=fields.headImg;
        db.insertOne("talkList",{
            username:username,
            content:content,
            date:new Date(),
            headImg:headImg,
            favours:[],
            comment:[]},function(err,result){
            res.send({data:"success"});
        })
    })
};
exports.getAllTalk=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            return
        }
        var username=fields.username;
        var page=fields.page;
        var pageNum=fields.pageNum;
        var updateNum=fields.updateNum;
        var condition=fields.showTalk=="/all_talk"?{}:{username:username};
        var sum=0;
        db.getSum("talkList",condition,function(count){
            sum=count;
            db.find("talkList",{condition:condition,sort:{date:-1},page:page,pageNum:pageNum,updateNum:updateNum},function(err,result){
                res.send({
                    result:result,
                    sum:sum
                });
            })
        });

    });
};
exports.postComment=function(req,res,next){
     var form=new formidable.IncomingForm();
     form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            return
        }
         var commentData=fields.comment;
         var username=fields.username;
         var id=fields.id;
         var headImgPath=fields.headImgPath;
         console.log(fields)
        db.updateMany("talkList",{_id:ObjectId(id)},{$push:{comment:{
            commentData:commentData,
            username:username,
            headImgPath:headImgPath,
            date:new Date(),
            id:id
        }}},function(err,result){
              if(err){
                  console.log(err)
              }
            res.send("success")
        })
     })
};
exports.doFavour=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            return
        }
        var id=fields.id;
        var username=fields.username;
        var method=fields.method;
        if(method=="push"){
            db.updateMany("talkList",{_id:ObjectId(id)},{$push:{favours:username}},function(err,result){
                if(err){
                    console.log(err);
                    return
                }
                res.send("success");
            })
        }
        if(method=="pull"){
            db.updateMany("talkList",{_id:ObjectId(id)},{$pull:{favours:username}},function(err,result){
                if(err){
                    console.log(err);
                    return
                }
                res.send("success");
            })
        }
    })
};
exports.getMemberList=function(req,res,next){
   var form=new formidable.IncomingForm();
   form.parse(req,function(err,fields,files){
       if(err){
           console.log(err);
           return
       }
       var page=fields.page;
       var pageNum=fields.pageNum;
       db.getSum("users",{},function(count){
            db.find("users",{page:page,pageNum:pageNum},function(err,result){
                if(err){
                    console.log(err);
                    return
                }
                res.send({
                    result:result,
                    count:count
                })
            })
       })
   })
};
