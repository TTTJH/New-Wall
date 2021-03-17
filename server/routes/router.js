//router.js用于装载所有子路由
//最后index.js装载router.js
const Router = require("koa-router")
const user = require("./user") //导入user子路由
const card = require("./card") //导入card子路由

const router = new Router()
router.use("/user",user.routes(),user.allowedMethods())//router.js装载user子路由
router.use("/card",card.routes(),card.allowedMethods()) //router.js装载card子路由
module.exports = router

