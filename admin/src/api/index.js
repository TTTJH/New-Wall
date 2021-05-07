import { time } from 'echarts'
import ajax from './ajax'

let baseUrl = "http://localhost:3030"
let keywordRoute = "/analysis/keyword"
let cardRoute = "/analysis/card"
let typeRoute = "/analysis/type"
let timeRoute = "/analysis/time"
let genderRoute = "/analysis/gender"
let deviceRoute = "/analysis/device"

//获取发言比重ajax
export const getKeywordAjax = () => {
    return ajax(baseUrl+keywordRoute,"GET")
}

//获取最高赞卡片
export const getCardAjax = () => {
    return ajax(baseUrl+cardRoute,"GET")
}

//获取最热门卡片类型
export const getTypeAjax = () => {
    return ajax(baseUrl+typeRoute,"GET")
}

//获取发布时间数组
export const getTimeAjax = () => {
    return ajax(baseUrl+timeRoute,"GET")
}

//获取性别比重
export const getGenderAjax = () => {
    return ajax(baseUrl+genderRoute,"GET")
}

//获取用户信息比重
export const getDeviceAjax = () => {
    return ajax(baseUrl+deviceRoute,"GET")
}