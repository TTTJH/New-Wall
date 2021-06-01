//屏蔽列表路由
const Router = require("koa-router")
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const {ShieldModel} = require("../database/schema&model")//导入Model对象

const shield = new Router()

//-----------使用中间件----------------------
shield.use(koaBodyParser()) //使用post数据解析中间件

//添加屏蔽接口
shield.post("/add",async (ctx,next) => {
    let {shieldedUserId,userId} = ctx.request.body

    //操作数据库
    await ShieldModel.findOne({userId})
      .then(async doc => {
          if(doc){
            //follow表中已经有该user的collection
            let {shieldList} = doc
            shieldList.push(shieldedUserId)
            await ShieldModel.updateOne({userId},{$set:{shieldList}})
              .then(doc => {
                ctx.body = {code:200,data:"success"}
              })
              .catch(err => {
                console.log(err)
                ctx.body = {code:100,msg:"err"}
              })
          }else{
            //需要创建新collection
            let shield = new ShieldModel({
              userId,
              shieldList:[shieldedUserId]
            })

            await shield.save()
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

//获取屏蔽列表
shield.get("/list",async (ctx,next) => {
  let {userId} = ctx.request.query

  //操作数据库
  await ShieldModel.findOne({userId})
    .then(doc => {
      ctx.body = {code:200,data:doc}
    })
    .catch(err => {
      ctx.body = {code:100,msg:"err"}
    })
})


//-----------子路由导出----------------------
module.exports = shield
