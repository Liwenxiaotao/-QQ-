/**
 * Created by taotao on 2017/5/22.
 */
var MongoClient=require("mongodb").MongoClient;
var setting=require("../setting.js");
function connectDB(callback){
    var url=setting.dburl;
   MongoClient.connect(url,function(err,db){
        if(err){
            callback(err,null);
            return;
        }
        callback(err,db)
    })
}
init();
function init(){
    connectDB(function(err,db){
        if(err){
            console.log(err);
            return;
        }
        db.collection("users").createIndex({"username":1},
        null,
        function(err,result){
            if(err){
                console.log(err);
                return;
            }
            console.log("索引建立成功");
        }
        )
    })
}
exports.insertOne=function(collectionName,json,callback){
    connectDB(function(err,db){
        db.collection(collectionName).insertOne(json,function(err,result){
            callback(null,result);
            db.close();
        });
    })
};
exports.find=function(collectionName,option,callback){
    var result=[];
    var condition=option.condition || {};
    var pageNum=option.pageNum || 0;
    var page=option.page || 0;
    var updateNum=option.updateNum || 0;
    var skipNum=pageNum*(page-1)+updateNum;
    var sort=option.sort || {};
     connectDB(function(err,db){
       var cursor=db.collection(collectionName).find(condition).skip(skipNum).limit(pageNum).sort(sort);
       cursor.each(function(err,doc){
          if(err){
              callback(err,null);
              db.close();
              return;
          }
           if(doc!=null){
               result.push(doc)
           }else{
               callback(null,result);
               db.close();
           }
       })
    })
};
exports.updateMany=function(collectionName,condition,updateData,callback){
   connectDB(function(err,db){
        if(err){
            callback(err,null);
            return;
        }
       db.collection(collectionName).updateMany(condition,updateData,function(err,result){
            if(err){
                callback(err,null);
                return;
            }
           callback(null,result);
       })
    })
};
exports.getSum=function(collectionName,callback){
    connectDB(function(err,db){
        db.collection(collectionName).count({}).then(function(count){
            callback(count);
            db.close();
        })
    })
};