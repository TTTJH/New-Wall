//后台分析子路由模块
const Router = require("koa-router")
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const fs = require("fs")//nodejs的文件模块
const util = require("util")//工具模块
const shell = require("shelljs")//shelljs模块
const tokenParse = require("../utils/tokenParse")//token解析函数
const {CardModel,UserModel,AnalysisModel,} = require("../database/schema&model")//导入Model对象

const analysis = new Router()
//-----------使用中间件----------------------
analysis.use(koaBodyParser()) //使用post数据解析中间件

//获取热词分析结果
analysis.get("/keyword",async (ctx,next) => {
  let result = shell.exec("python3 /home/tttjh/Code/new-wall/server/utils/python.py")//执行python.py脚本获取权重
  ctx.body = {code:200,data:result.stdout}
})

//获取总获赞数量最高的卡片
analysis.get("/card",async (ctx,next) => {
  await CardModel.aggregate([
    {$project:{likes:{$size:"$likes"},content:1,img:1,comments:1,userId:1}},
    {$sort:{likes:-1}},
    {$limit:1}
  ])
  .then(doc => {
    ctx.body = {code:200,data:doc}
  })
  .catch(doc => {
    ctx.body = {code:100,msg:"获取错误"}
  })

})

//获取最多卡片种类
analysis.get("/type",async (ctx,next) => {
  await CardModel.aggregate([{$group:{_id:"$type",count:{$sum:1}}},{$sort:{count:-1}},{$limit:1}])
    .then(doc => {
      ctx.body = {code:200,data:doc[0]}
    })
    .catch(err => {
      console.log(err)
      ctx.body = {code:100,msg:"获取错误"}
    })
})

//获取时间字符串
analysis.get("/time",async (ctx,next) => {
  await CardModel.find({})
    .then(doc => {
      let timeArr = []
      doc.map((item,index) => {
        item.date ? timeArr.push(item.date) : null
      })
      ctx.body = {code:200,data:timeArr}
    })
    .catch(err => {
      console.log(err)
      ctx.body = {code:100,msg:"获取错误"}
    })
})

//获取用户性别比重
analysis.get("/gender",async (ctx,next) => {
  await UserModel.aggregate([{$group:{_id:"$gender",count:{$sum:1}}}])
    .then(doc => {
      ctx.body = {code:200,data:doc}
    })
    .catch(err => {
      console.log(err)
      ctx.body = {code:100,msg:"获取错误"}
    })
})

//储存用户的设备信息
analysis.post("/device",async (ctx,next) => {
  let {os} = ctx.request.body
  let device = new AnalysisModel({
    os
  })
  await device.save()
    .then(doc => {
      ctx.body = {code:200,data:doc}
      // console.log(doc)
    })
    .catch(err => {
      ctx.body = {code:100,msg:"获取错误"}
      // console.log(err)
    })
})

//返回存储用户的设备信息
analysis.get("/device",async (ctx,next) => {
  await AnalysisModel.aggregate([{$group:{_id:"$os",value:{$sum:1}}}])
    .then(doc => {
      ctx.body = {code:200,data:doc}
    })
    .catch(err => {
      ctx.body = {code:100,msg:"获取出错"}
    })
})
//-----------子路由导出----------------------
module.exports = analysis
