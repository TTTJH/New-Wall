import ajax from './ajax'

const baseUrl = "http://localhost:3030"
const loginRoute = baseUrl+"/user/login"
const registerRoute = baseUrl+"/user/register"
const usernameCheckRoute = baseUrl+"/user/username_check"
const nicknameCheckRoute = baseUrl+"/user/nickname_check"
const getUserInfoRoute = baseUrl + "/user/getInfo"
const avatarUploadRoute = baseUrl + "/user/avatar"
const tagHandleRoute = baseUrl + "/user/tag"

export const loginAjax = (data) => {
    return ajax(loginRoute,"POST",data)
}

export const registerAjax = (data) => {
    return ajax(registerRoute,"POST",data)
}

export const usernameCheckAjax = (data) => {
    return ajax(usernameCheckRoute,"POST",data)
}

export const nicknameCheckAjax = (data) => {
    return ajax(nicknameCheckRoute,"POST",data)
}

export const getUserInfoAjax = (token) => {
    return ajax(getUserInfoRoute,"GET",{},token)
}

export const avatarUploadAjax = (token) => {
    return ajax(avatarUploadRoute,"POST",{},token)
}

export const tagHandleAjax = (data,token) => {
    return ajax(tagHandleRoute,"POST",data,token)
}