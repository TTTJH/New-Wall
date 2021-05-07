//message子路由模块
const Router = require("koa-router")
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const fs = require("fs")//nodejs的文件模块
const multiparty = require("multiparty")//解析文件上传模块
const util = require("util")//工具模块
const tokenParse = require("../utils/tokenParse")//token解析函数
const {MessageModel,} = require("../database/schema&model")//导入Model对象

const message = new Router()

//-----------使用中间件----------------------
message.use(koaBodyParser()) //使用post数据解析中间件

message.post("/submit",async (ctx,next) => {
  let {fromUserId,toUserId,content} = ctx.request.body
  let mydate = new Date()
  let date = `${mydate.toLocaleDateString()} ${mydate.getHours()}:${mydate.getMinutes()}`
  let messageId = fromUserId+toUserId
  //操作数据库
  await MessageModel.findOne({usersId:{$in:[messageId]}})
    .then(async doc => {
      if(!doc){
        //该两人的对话还不存在，创建新对话
        let message = new MessageModel({
          usersId:[fromUserId+toUserId,toUserId+fromUserId],
          msgList:[{fromUserId,toUserId,content,date}]
        })

        //创建新document
        await message.save()
          .then(doc => {
            ctx.body = {code:200,data:"success"}
          })
          .catch(err => {
            ctx.body = {code:100,msg:"error"}
          })
      }else{
        let messageDocument = JSON.parse(JSON.stringify(doc))
        let msgItem = {fromUserId,toUserId,content,date}
        let {msgList} =  messageDocument
        msgList.push(msgItem)
        //更新
        await MessageModel.updateOne({usersId:{$in:[messageId]}},{$set:{msgList}})
          .then(doc => {
            ctx.body = {code:200,data:"success"}
          })
          .catch(err => {
              ctx.body = {code:100,msg:"error"}
          })
      }
    })
    .catch(err => {
      console.log(err)
      ctx.body = {code:100,msg:"error"}
    })
})

//获取某用户与某用户的对话
message.get("/msglist",async (ctx,next) => {
    let {messageId} = ctx.request.query//获取get数据

    //根据messageId查找两人对话document,messageId由前端两人的userId组成
    await MessageModel.findOne({usersId:{$in:[messageId]}})
      .then(doc => {
        ctx.body = {code:200,data:doc}
      })
      .catch(err => {
        console.log(err)
        ctx.body = {code:100,msg:"error"}
      })
})



//-----------子路由导出----------------------
module.exports = message
