/**
 * Created by taotao on 2017/5/22.
 */
var crypto=require("crypto");
module.exports=function(password){
    var md5=crypto.createHash("md5");
    var Password=md5.update(password).digest("base64");
    return Password;
};