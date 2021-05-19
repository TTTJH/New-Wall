const Koa = require("koa")
const cors = require("koa2-cors")
const http = require("http")
const koaBody = require('koa-body');
const router = require("./routes/router")//装载了众多子路由的router.js
const Jwt = require("./utils/jwt") //jsonwebtoken的生成与验证
const koaStatic = require("koa-static")//koa-static静态文件设置
const tokenVerify = require("./utils/tokenVerify")
const db = require("./database/connect")//mongodb数据库的连接操作
const {UserModel, } = require("./database/schema&model")//mongoose的schema和model

const app = new Koa()

//app加载路由中间件
app.use(cors()) //允许全部跨域
app.use(router.routes(),router.allowedMethods()) //挂载路由中间件
app.use((ctx,next) => tokenVerify(ctx,next)) //启用编写的token验证中间件
app.use(koaStatic(__dirname+"/uploads"))//加载koa-static静态文件目录中间件

const server = http.createServer(app.callback())
const io = require('socket.io')(server,{cors:{origin:['http://localhost:3000']}})
io.on('connection', socket => {
        console.log("user connect!")
        //将目前在线用户发送给前端
        const users = [];
        for (let [id, socket] of io.of("/").sockets) {
          users.push({
            userInfo: JSON.parse(socket.handshake.query.userInfo),//从前端传递的uerId
            id
          });
        }
        socket.emit("users", users);

        //新用户上线提醒
        io.emit("user connected",{
          userInfo: JSON.parse(socket.handshake.query.userInfo),//从前端传递的uerId
          id:socket.id
        })

        //后端接收消息
        //data结构 --->  {userInfo,content}
        socket.on("message",(data) => {
          //向全体成员发送消息
            io.emit("message",data)
        })

        //后端接收like事件
        socket.on("like",(data) => {
          console.log("后端like事件被触发")
          let {to} = data
          console.log(data)
          socket.to(to).emit("like",data)
        })

        //私人消息
        socket.on("privateMsg",({content,to,fromUserInfo,toUserInfo}) => {
          socket.to(to).emit("privateMsg",{
            content,
            from:socket.id,
            fromUserInfo,
            toUserInfo
          })
        })

        //comment事件
        socket.on("comment",(data) => {
            console.log("后台comment事件被触发")
            socket.to(data.to).emit("comment",data)
        })
        socket.on("disconnect", () => {
          console.log("user disconnect!")
          //将目前在线用户发送给前端
          const users = [];
          for (let [id, socket] of io.of("/").sockets) {
            users.push({
              userInfo: JSON.parse(socket.handshake.query.userInfo),//从前端传递的uerId
              id
            });
          }
          io.emit("user disconnect", users);//向全体成员发送最新的users列表
        })
})

//-------------重要代码start---------------------
//token测试
// let jwt = new Jwt({username:"ttttjh",password:"tttjh"},"Hello Token")
// let token = jwt.generToken()
// console.log(token)
// let result = jwt.verifyToken(token)
// console.log(result)
//-------------重要代码end---------------------
//连接数据库
db.connect()
    .then(val => {
        console.log(val)
    })
    .catch(err => {
        console.log(err)
    })

// app.listen(3030)
server.listen(3030)
console.log("koa2 running in 3030!!!")
