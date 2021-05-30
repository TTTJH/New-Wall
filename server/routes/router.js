//router.js用于装载所有子路由
//最后index.js装载router.js
const Router = require("koa-router")
const user = require("./user") //导入user子路由
const card = require("./card") //导入card子路由
const analysis = require("./analysis") //导入analysis子路由
const message = require("./message") //导入message子路由
const notice = require("./notice") //导入notice子路由
const follow = require("./follow")//导入follow子路由

const router = new Router()
router.use("/user",user.routes(),user.allowedMethods())//router.js装载user子路由
router.use("/card",card.routes(),card.allowedMethods()) //router.js装载card子路由
router.use("/analysis",analysis.routes(),analysis.allowedMethods()) //router.js装载analysis子路由
router.use("/message",message.routes(),message.allowedMethods()) //router.js装载message子路由
router.use("/notice",notice.routes(),notice.allowedMethods()) //router.js装载notice子路由
router.use("/follow",follow.routes(),follow.allowedMethods()) //router.js装载notice子路由
module.exports = router
