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




//-----------子路由导出----------------------
module.exports = notice
