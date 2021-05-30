//关注者列表路由
const Router = require("koa-router")
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const {FollowModel} = require("../database/schema&model")//导入Model对象

const follow = new Router()

//-----------使用中间件----------------------
follow.use(koaBodyParser()) //使用post数据解析中间件

//添加关注接口
follow.post("/add",async (ctx,next) => {
  let {followedUserId,userId} = ctx.request.body
  //操作数据库
  await FollowModel.findOne({userId})
    .then(async doc => {
        if(doc){
          //follow表中已经有该user的collection
          let {followList} = doc
          followList.push(followedUserId)
          await FollowModel.updateOne({userId},{$set:{followList}})
            .then(doc => {
              ctx.body = {code:200,data:"success"}
            })
            .catch(err => {
              console.log(err)
              ctx.body = {code:100,msg:"err"}
            })
        }else{
          //需要创建新collection
          let follow = new FollowModel({
            userId,
            followList:[followedUserId]
          })

          await follow.save()
            .then(doc => {
              ctx.body = {code:200,data:"success"}
            })
            .catch(err => {
              console.log(err)
              ctx.body = {code:100,msg:"err"}
            })
        }
    })
    .catch(err => {
      console.log(err)
    })
})

//获取关注列表
follow.get("/list",async (ctx,next) => {
    let {userId} = ctx.request.query

    //操作数据库
    await FollowModel.findOne({userId})
      .then(doc => {
        ctx.body = {code:200,data:doc}
      })
      .catch(err => {
        ctx.body = {code:100,msg:"err"}
      })
})

//-----------子路由导出----------------------
module.exports = follow
