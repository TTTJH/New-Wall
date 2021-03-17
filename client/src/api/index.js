import ajax from './ajax'

const baseUrl = "http://localhost:3030"
const loginRoute = baseUrl+"/user/login"
const registerRoute = baseUrl+"/user/register"
const usernameCheckRoute = baseUrl+"/user/username_check"
const nicknameCheckRoute = baseUrl+"/user/nickname_check"
const getUserInfoRoute = baseUrl + "/user/getInfo"
const avatarUploadRoute = baseUrl + "/user/avatar"
const tagHandleRoute = baseUrl + "/user/tag"
const getClassmateRoute = baseUrl + "/user/classmate"
const cardSubmitRoute = baseUrl + "/card/submit"

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

export const getClassmateAjax = () => {
    return ajax(getClassmateRoute,"GET")
}

export const cardSubmiAjax = (data,token) => {
    return ajax(cardSubmitRoute,"POST",data,token)
}