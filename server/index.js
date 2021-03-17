const Koa = require("koa")
const cors = require("koa-cors")
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

app.listen(3030)
console.log("koa2 running in 3030!!!")

