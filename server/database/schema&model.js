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
    comments:Array,//评论列表
    stars:Array,//收藏列表
})

const AnalysisSchema = new Schema({
    os:String, //用户设备
})

const MessageSchema = new Schema({
  usersId:Array,//对话双方的id组合[fromUserId+toUserId,toUserId+fromUserId]
  msgList:Array,//聊天内容数组，结构：[{fromUserId,toUserId,content,date},{fromUserId,toUserId,content,date}]
})

const NoticeSchema = new Schema({
  userId:String,//该document的所属用户的userId
  noticeList:Array,//通知数组，结构:[{type,read,info,fromUserId}]
  // fromUserId:String,//操作用户的userId
})

const FollowSchema = new Schema({
  userId:String,//该条关注列表的所属用户userId
  followList:Array,//关注列表，结构[userId1,userId2,userId3,userId4]
})

const ShieldSchema = new Schema({
  userId:String,//该条屏蔽列表的所属用户userId
  shieldList:Array,//屏蔽列表,结构[userId1,userId2,userId3]
})
//---------------结束定义Schema------------------------

//---------------开始定义Module------------------------
const UserModel = new mongoose.model("user",UserSchema)
const CardModel = new mongoose.model("card",CardSchema)
const AnalysisModel = new mongoose.model("analysis",AnalysisSchema)
const MessageModel = new mongoose.model("message",MessageSchema)
const NoticeModel = new mongoose.model("notice",NoticeSchema)
const FollowModel = new mongoose.model("follow",FollowSchema)
//---------------结束定义Module------------------------

//---------------导出Model----------------------------
exports.UserModel = UserModel
exports.CardModel = CardModel
exports.AnalysisModel = AnalysisModel
exports.MessageModel = MessageModel
exports.NoticeModel = NoticeModel
exports.FollowModel = FollowModel
