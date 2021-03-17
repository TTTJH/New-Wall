//card子路由模块
const Router = require("koa-router")
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const fs = require("fs")//nodejs的文件模块
const multiparty = require("multiparty")//解析文件上传模块
const util = require("util")//工具模块
const tokenParse = require("../utils/tokenParse")//token解析函数
const {CardModel,} = require("../database/schema&model")//导入Model对象

const card = new Router()

let imgsArr = [] //该数组用于存储用户在post卡片前上传的图片名称

//-----------使用中间件----------------------
card.use(koaBodyParser()) //使用post数据解析中间件

//卡片附属图片提交
card.post("/upload",async (ctx,next) => {
    //multiparty模块的使用
    let form = new multiparty.Form({uploadDir: './uploads'})
    form.parse(ctx.req, async (err,fields,files) => {
        if(err) {
            ctx.body = {code:100,msg:"上传失败!"}
        }
        let imageName = files.file[0].path.split("/")[1]
        await imgsArr.push(imageName)
    })

    //此处仍有问题，无论怎样都会上传成功
    ctx.body = {code:200,data:"上传成功"}
})

//卡片提交
card.post("/submit",async (ctx,next) => {
    console.log("submit submit submit")
    //token解析操作
    let userInfo = tokenParse(ctx.request.headers.token)
    let {content} = ctx.request.body //解析post数据

    //操作数据库
    let mydate = new Date()
    let card = new CardModel({
        userId:userInfo.userId,
        content,
        date:`${mydate.toLocaleDateString()} ${mydate.getHours()}:${mydate.getMinutes()}`,
        img:imgsArr
    })

    await card.save()
        .then(() => {
            ctx.body = {code:200,data:"卡片提交成功"}
        })
        .catch(() => {
            ctx.body = {code:100,msg:"卡片提交失败，请重试"}
        })
})

//-----------子路由导出----------------------
module.exports = card