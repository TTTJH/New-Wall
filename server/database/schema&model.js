const mongoose = require("mongoose")
const Schema = mongoose.Schema

//---------------开始定义Schema------------------------
const UserSchema = new Schema({ // 用户Schema
    userId:Schema.Types.ObjectId, //userId
    username:String, //用户名
    password:String, //密码
    nickname:String, //昵称
    gender:String, //性别
    avatar:String, //头像url
    tags:Array
})

const CardSchema = new Schema({
    cardId:Schema.Types.ObjectId,//cardId
    userId:String, //发布者ID
    content:String, //卡片内容
    img:Array, // 卡片附带图片
    date:String,
    ISODate:Date, // 发布日期
    type:String, // 卡片类型
    likes:Array,//点赞列表
})
//---------------结束定义Schema------------------------

//---------------开始定义Module------------------------
const UserModel = new mongoose.model("user",UserSchema)
const CardModel = new mongoose.model("card",CardSchema)
//---------------结束定义Module------------------------

//---------------导出Model----------------------------
exports.UserModel = UserModel
exports.CardModel = CardModel
