//用户消息通知子路由模块
const Router = require("koa-router")
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const fs = require("fs")//nodejs的文件模块
const util = require("util")//工具模块
const tokenParse = require("../utils/tokenParse")//token解析函数
const {NoticeModel} = require("../database/schema&model")//导入Model对象


const notice = new Router()
//-----------使用中间件----------------------
notice.use(koaBodyParser()) //使用post数据解析中间件

//noticeList的创建或更新路由
notice.post("/submit",async (ctx,next) => {
  let {data,userId} = ctx.request.body //解析post数据
  //操作数据库
  //先根据userId查询该用户是否已经在notice collection中有了其自己的document
  await NoticeModel.findOne({userId})
    .then(async doc => {
      if(doc){
        //已经有该用户的document
        let {noticeList} = doc
        noticeList.push(data)
        //更新
        await NoticeModel.updateOne({userId},{$set:{noticeList}})
          .then(doc => {
            ctx.body = {code:200,data:"success"}
          })
          .catch(err => {
            console.log(err)
            ctx.body = {code:100,msg:"error"}
          })
      }else{
        //尚未有该用户的document
        //创建新document
        let notice = new NoticeModel({
          userId,
          noticeList:data
        })

        await notice.save()
          .then(doc => {
            ctx.body = {code:200,data:"success"}
          })
          .catch(err => {
            console.log(err)
            ctx.body = {code:100,msg:"error"}
          })
      }
    })
    .catch(err => {
      console.log(err)
      ctx.body = {code:100,msg:"error"}
    })

})

//根据userId获取noticeList路由
notice.get("/noticelist",async (ctx,next) => {
  let {userId} = ctx.request.query //获取get数据
  //操作数据库
  await NoticeModel.findOne({userId})
    .then(doc => {
      if(doc){
        let newNoticeList = []
        //过滤掉read为true的结果
        doc.noticeList.map((item,index) => {
          if(item){
            item.read ? null : newNoticeList.push(item)
          }
        })
        //应该返回的新data
        let data = {
          _id:doc._id,
          userId:doc.userId,
          noticeList:newNoticeList
        }
        ctx.body = {code:200,data}
      }else{
        ctx.body = {code:200,data:null}
      }

    })
    .catch(err => {
      console.log(err)
      ctx.body = {code:100,msg:"err"}
    })
})

//更新noticeList中的read标识位路由
notice.post("/updateRead",async (ctx,next) => {
  let {index,userId,fromUserId} = ctx.request.body //解析post数据
  //操作数据库
  await NoticeModel.findOne({userId})
    .then(async doc => {
      let {noticeList} = doc

      noticeList.map((item,index) => {
        if(fromUserId == item.fromUserInfo._id){
          //将同一个发送者发送的多条消息read标志位更新为true
          item.read = true
        }
      })

      //更新noticeList
      await NoticeModel.updateOne({userId},{$set:{noticeList}})
        .then(doc => {
          ctx.body = {code:200,data:"success"}
        })
        .catch(err => {
          console.log(err)
          ctx.body = {code:100,msg:"err"}
        })
    })
    .catch(err => {
      console.log(err)
      ctx.body = {code:100,msg:"err"}
    })
})


//-----------子路由导出----------------------
module.exports = notice
