const mongoose = require("mongoose")
const Schema = mongoose.Schema

//---------------开始定义Schema------------------------
const UserSchema = new Schema({
    userId:Schema.Types.ObjectId, //userId
    username:String, //用户名
    password:String, //密码
    nickname:String, //昵称
    gender:String, //性别
    avatar:String, //头像url
    tags:Array
})
//---------------结束定义Schema------------------------

//---------------开始定义Module------------------------
const UserModel = new mongoose.model("user",UserSchema)
//---------------结束定义Module------------------------

//---------------导出Model----------------------------
exports.UserModel = UserModel
