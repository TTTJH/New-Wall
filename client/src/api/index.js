import ajax from './ajax'
import url from './url'

const baseUrl = url
const loginRoute = baseUrl+"/user/login"
const registerRoute = baseUrl+"/user/register"
const usernameCheckRoute = baseUrl+"/user/username_check"
const nicknameCheckRoute = baseUrl+"/user/nickname_check"
const getUserInfoRoute = baseUrl + "/user/getInfo"
const getUserInfoByIdRoute = baseUrl + "/user/getInfoById?userId="
const avatarUploadRoute = baseUrl + "/user/avatar"
const tagHandleRoute = baseUrl + "/user/tag"
const getClassmateRoute = baseUrl + "/user/classmate"
const cardSubmitRoute = baseUrl + "/card/submit"
const cardListRouter = baseUrl + "/card/list?page="
const cardDelUploadRouter = baseUrl + "/card/delupload"
const cardLikeRouter = baseUrl + "/card/like"
const cardCheckLikeRouter = baseUrl + "/card/checklike"
const cardDelLikeRouter = baseUrl + "/card/dellike"
const cardGetCardLikeCountRouter = baseUrl + "/card/count"
const cardCommentRouter = baseUrl + "/card/comment"
const cardGetComments = baseUrl + "/card/getcomments"
const cardCommentLikeRouter = baseUrl + "/card/commentLike"
const cardCommentDelLikeRouter = baseUrl + "/card/commentDelLike"
const cardCommentReplyRouter = baseUrl + "/card/commentReply"
const cardUserCardList = baseUrl + "/card/usercardlist"
const getCardDataByIdRoute = baseUrl + "/card/cardData"
const analysisDeviceRouter = baseUrl + "/analysis/device"
const messageSubmitRouter = baseUrl + "/message/submit"
const getMessageListRouter = baseUrl + "/message/msglist"
const noticeSubmitRouter = baseUrl + "/notice/submit"
const getNoticeListRouter = baseUrl + "/notice/noticelist"
const updateNoticeListReadRouter = baseUrl + "/notice/updateRead"
const clearNoticeRouter = baseUrl + "/notice/clear"
const followAddRouter = baseUrl + "/follow/add"
const followListRouter = baseUrl + "/follow/list"
const followDelRouter = baseUrl + "/follow/del"
const shieldAddRouter = baseUrl + "/shield/add"
const shieldListRouter = baseUrl + "/shield/list"

//登入路由
export const loginAjax = (data) => {
    return ajax(loginRoute,"POST",data)
}

//注册路由
export const registerAjax = (data) => {
    return ajax(registerRoute,"POST",data)
}

//用户名重复检查路由
export const usernameCheckAjax = (data) => {
    return ajax(usernameCheckRoute,"POST",data)
}

//昵称重复检查路由
export const nicknameCheckAjax = (data) => {
    return ajax(nicknameCheckRoute,"POST",data)
}

//获取用户信息路由
export const getUserInfoAjax = (token) => {
    return ajax(getUserInfoRoute,"GET",{},token)
}

//通过Id获取用户信息路由
export const getUserInfoByIdAjax = (userId) => {
    return ajax(getUserInfoByIdRoute+userId,"GET")
}

//头像上传路由
export const avatarUploadAjax = (token) => {
    return ajax(avatarUploadRoute,"POST",{},token)
}

//个性标签操作路由
export const tagHandleAjax = (data,token) => {
    return ajax(tagHandleRoute,"POST",data,token)
}

//获取推荐同学列表路由
export const getClassmateAjax = () => {
    return ajax(getClassmateRoute,"GET")
}

//卡片提交路由
export const cardSubmiAjax = (data,token) => {
    return ajax(cardSubmitRoute,"POST",data,token)
}

//获取动态卡片列表路由
export const getCardListAjax = (data) => {
    return ajax(cardListRouter+data,"GET")
}

//textarea中删除上传图片路由
export const cardDelUploadAjax = (data) => {
    return ajax(cardDelUploadRouter,"POST",data,)
}

//获取卡片点赞数量、评论数量、star数量路由
export const getcardLikeCountAjax = (data) => {
    return ajax(cardGetCardLikeCountRouter,"GET",data)
}

//卡片点赞路由
export const cardLikeAjax = (data,token) => {
    return ajax(cardLikeRouter,"POST",data,token)
}

//卡片点赞检查路由
export const cardCheckLikeAjax =(data,token) => {
    return ajax(cardCheckLikeRouter,"POST",data,token)
}

//卡片取消点赞路由
export const cardDelLikeAjax = (data,token) => {
    return ajax(cardDelLikeRouter,"POST",data,token)
}

//卡片评论路由
export const cardCommentAjax = (data,token) => {
    return ajax(cardCommentRouter,"POST",data,token)
}

//通过cardId获取cardData
export const getCardDataById = (data) => {
    return ajax(getCardDataByIdRoute,"GET",data)
}

//获取卡片评论路由
export const getCardCommentsAjax = (data) => {
    return ajax(cardGetComments,"GET",data)
}

//卡片评论点赞路由
export const cardCommentLikeAjax = (data,token) => {
    return ajax(cardCommentLikeRouter,"POST",data,token)
}

//卡片评论取消点赞路由
export const cardCommentDelLikeAjax = (data,token) => {
    return ajax(cardCommentDelLikeRouter,"POST",data,token)
}

//卡片评论回复路由
export const cardCommentReplyAjax = (data,token) => {
    return ajax(cardCommentReplyRouter,"POST",data,token)
}

//根据用户ID获取其发布过的卡片
export const getUserCardListAjax = (data) => {
    return ajax(cardUserCardList,"GET",data)
}

//提交用户设备路由
export const postAnalysisDevice = (data) => {
    return ajax(analysisDeviceRouter,"POST",data)
}

//用户私聊消息提交
export const messageSubmitAjax = (data) => {
    return ajax(messageSubmitRouter,"POST",data)
}

//获取用户私聊消息
export const getMsgListAjax = (data) => {
    return ajax(getMessageListRouter,"GET",data)
}

//消息通知提交
export const noticeSubmitAjax = (data) => {
    return ajax(noticeSubmitRouter,"POST",data)
}

//获取用户所属的noticeList
export const getNoticeListAjax = (data) =>{
    return ajax(getNoticeListRouter,"GET",data)
}

//更新数据库某条notice的noticeList的read标志位
export const updateNoticeListReadAjax = (data) => {
    return ajax(updateNoticeListReadRouter,"POST",data)
}

//一键清除所有notice
export const clearNoticeListAjax = (data) => {
    return ajax(clearNoticeRouter,"POST",data)
}

//test 
export const test = () => {
    return ajax("/test","GET")
}

//添加关注路由
export const followAddAjax = (data) => {
    return ajax(followAddRouter,"POST",data)
}

//获取某用户关注列表
export const getFollowListAjax = (data) => {
    return ajax(followListRouter,"GET",data)
}

//删除用户关注的某用户
export const followDelAjax = (data) => {
    return ajax(followDelRouter,"POST",data)
}

//屏蔽用户
export const shieldAddAjax = (data) => {
    return ajax(shieldAddRouter,"POST",data)
}

//获取屏蔽列表
export const getShieldListAjax = (data) => {
    return ajax(shieldListRouter,"GET",data)
}