/**
 * Created by taotao on 2017/5/21.
 */
var express=require("express");
var router=require("./router/router.js");
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static("./app"));
app.post("/doRegister",router.doRegister);
app.post("/doLogin",router.doLogin);
app.get("/getUserInfo",router.getUserInfo);
app.post("/upHeadImg",router.upHeadImg);
app.get("/cropHeadImg",router.cropHeadImg);
app.post("/postInfo",router.postInfo);
app.post("/getAllTalk",router.getAllTalk);
app.post("/post_comment",router.postComment);
app.post("/do_favour",router.doFavour);
app.post("/get_member_list",router.getMemberList);

io.on("connection",function(socket){
    socket.on("chat",function(msg){
        io.emit("chat",msg);
    })
});

http.listen(1111);