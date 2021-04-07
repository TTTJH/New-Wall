import ajax from './ajax'

const baseUrl = "http://localhost:3030"
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
const caerGetComments = baseUrl + "/card/getcomments"

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

//获取卡片评论路由
export const getCardCommentsAjax = (data) => {
    return ajax(caerGetComments,"GET",data)
}