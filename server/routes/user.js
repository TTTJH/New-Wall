//-----------------user子路由模块-----------------------
const Router = require("koa-router")
const md5 = require("md5")//md5包用于password字段加密
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const fs = require("fs")//nodejs的文件模块
const multiparty = require("multiparty")//解析文件上传模块
const util = require("util")//工具模块
const Jwt = require("../utils/jwt")
const tokenParse = require("../utils/tokenParse")//token解析函数
const {UserModel,} = require("../database/schema&model")//导入Model对象

const user = new Router()
//-----------使用中间件----------------------
user.use(koaBodyParser())

//--------------获取用户个人信息路由--------------------
user.get("/getInfo",async (ctx) => {
    let {token} =  ctx.request.headers
    let jwt = new Jwt()//实例化一个jwt对象来进行token验证
    let tokenVerifyResult = jwt.verifyToken(token)
    if(tokenVerifyResult.code == 200){//token验证通过
        //数据库查询
        await UserModel.findOne({"username":tokenVerifyResult.data.username})
            .then(val => {
                let userInfo = {
                    userId:val._id,
                    username:val.username,
                    nickname:val.nickname,
                    gender:val.gender,
                    avatar:val.avatar,
                    tags:val.tags
                }
                ctx.body = {code:200,data:userInfo}
            })
    }else{//token验证失败
        ctx.body = {code:100,msg:"token验证失败"}
    }
})

//根据id获取userInfo
user.get("/getInfoById",async (ctx,next) => {
    let {userId} = ctx.request.query
    //查询数据库
    await  UserModel.findOne({_id:userId})
        .then(val => {
            ctx.body = {code:200,data:val}
        })
        .catch(err => {
            ctx.body = {code:100,msg:"获取userinfo失败，请重试"}
        })
})

//--------------用户登入路由--------------------
user.post("/login",async (ctx) => {
     let {username,password} = ctx.request.body
     password = md5(password)
     //数据库查询
     await UserModel.findOne({"username":username})
         .then(val => {
               if(val && (password === val.password)){ //username和password都正确
                    let data = {
                         userId:val._id,
                         username:val.username,
                         nickname:val.nickname,
                         gender:val.gender,
                        avatar:val.avatar,
                         tags:val.tags
                    }
                    let jwt = new Jwt(data,"user-secret")
                    let token = jwt.generToken()
                    ctx.body = {code:200,data:{token}}
               }else if(val && (password !== val.password)){
                    ctx.body = {code:100,msg:"密码错了哦"}
               }else if(!val){
                    ctx.body = {code:100,msg:"该账户不存在哦"}
               }
          })
         .catch((err) => {
             console.log(err)
              ctx.body = {code:100,msg:"服务器过累啦，稍候再试"}
          })
})

//--------------测试路由--------------------
user.get("/images",async (ctx) => {
    console.log("/images被访问")
    ctx.body = ["people1","people1","people2","people2","people3","people3"]
})

//--------------用户注册路由-------------------------
user.post("/register",async (ctx) => {
     let {username,password,nickname,gender} = ctx.request.body
     let user = new UserModel({
          username,
          password:md5(password),//进行字段加密
          nickname,
          gender,
         avatar:`avatar${Math.round(Math.random()*2)+1}.jpg`,//注册默认头像
          // avatar:`avatar.jpg`,//注册默认头像
         tags:["萌新入驻"],//注册默认tag
     })
     //这里使用Model.save()的Promise链式调用方法，因为回调函数的写法在函数内部无法进行ctx.body使得路由返回结果为not found
     await user.save()
         .then((val) => {
              let data = {
                   userId:val._id,
                   username:val.username,
                   nickname:val.nickname,
                   gender:val.gender,
                  avatar:val.avatar,//注册默认头像
              }
              let jwt = new Jwt(data,"user-secret")
              let token = jwt.generToken()
              ctx.body = {code:200,data:{token}}
          })
         .catch(() => {
              ctx.body = {code:100,msg:"服务器暂停营业，请稍候"}
         })
})

//---------------用户名检查路由----------------------
user.post("/username_check",async (ctx) => {
     let {username} = ctx.request.body
     //进行数据库操作
     await UserModel.findOne({"username":username})
         .then(val => {
             if(!val){
                 ctx.body = {code:200,msg:"该用户名可以使用"}
             }else{
                 ctx.body = {code:100,msg:"该用户名已经被注册,换一个吧"}
             }
         })
         .catch(err => {
             ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
         })
})

//----------------昵称检查------------------------
user.post("/nickname_check",async (ctx) => {
     let {nickname} = ctx.request.body
     await UserModel.findOne({"nickname":nickname})
         .then(val => {
             if(!val){
                 ctx.body = {code:200,msg:"该昵称还没被使用，快注册！"}
             }else{
                 ctx.body = {code:100,msg:"这个好听的昵称已经被人抢先注册啦！"}
             }
         })
         .catch(err => {
             ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
         })
})

//------------头像上传路由-------------------
user.post('/avatar',async (ctx,next) => {
    //token解析操作
    let userInfo = tokenParse(ctx.request.headers.token)
    //multiparty模块的使用
    let form = new multiparty.Form({uploadDir: './uploads'})
    form.parse(ctx.req, async (err,fields,files) => {
        if(err) {
            ctx.body = {code:100,msg:"上传失败!"}
        }
        let imageName = files.file[0].path.split("/")[1]
        //进行数据库更新
        await UserModel.findByIdAndUpdate(userInfo.userId,{avatar: imageName},(err,doc) => {
            if(err) throw err
        })
    })
    ctx.body = {code:200,msg:"成功上传:)"}
});

//获取个性tags路由
user.get("/get_tags",async (ctx,next) => {
    //token解析
    let userInfo = tokenParse(ctx.request.headers.token)

    //数据库操作
    await UserModel.findOne({username:userInfo.username})
        .then(val => {
            let {tags} = val
            ctx.body = {code:200,data:{tags}}
        })
        .catch(err => {
            ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
        })
})

// 个性tag增删路由
user.post("/tag",async (ctx,next) => {
    //token解析
    let userInfo = tokenParse(ctx.request.headers.token)
    let query = ctx.request.body //post数据获取
    if(query.addTagValue){
        //增加tag操作
        //数据库操作
        await UserModel.findById(userInfo.userId)
            .then(async val => {
                let {tags} = val
                tags.push(query.addTagValue)
                await UserModel.findByIdAndUpdate(userInfo.userId,{tags},(err,doc)=>{
                    if(err){
                        ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
                    }else{
                        ctx.body = {code:200,msg:"添加成功"}
                    }
                })
            })
            .catch((err) => {
                ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
            })
    }else{
        //删除tag操作
        //数据库操作
        await UserModel.findById(userInfo.userId)
            .then(async val => {
                let {tags} = val
                tags.splice(query.delTagIndex,1)
                await UserModel.findByIdAndUpdate(userInfo.userId,{tags},(err,doc)=>{
                    if(err){
                        ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
                    }else{
                        ctx.body = {code:200,msg:"删除成功"}
                    }
                })
            })
            .catch((err) => {
                ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
            })
    }
})

// classmate同学推荐路由
user.get("/classmate",async (ctx,next) => {
    //数据库操作
    await UserModel.aggregate([{$sample:{size:8}}])
        .then(val => {
            ctx.body = {code:200,data:val}
        })
        .catch(err => {
            ctx.body = {code:100,msg:"获取同学推荐失败！"}
        })
})

//test路由
user.get("/test",async (ctx,next) => {
    let test = 1
    let promise = new Promise( (resolve,reject) => {
         fs.readFile("/home/tttjh/Code/new-wall/server/uploads/avatar.jpg",(err,data) => {
            if(err){
                console.log(err)
                reject(err)
            }else{
                resolve(data)
            }
        })
    })

    await promise
        .then( val => {
            ctx.response.status = 200
            console.log(val)
             ctx.body =  ({msg:"cool !!!"})
        })
        .catch( err => {
            console.log(":(")
            ctx.response.status = 200
            ctx.body =  ({msg:"something wrong !"})
        })
})
//-----------子路由导出----------------------
module.exports = user
