//token解析操作
const Jwt = require("../utils/jwt")
function  tokenParse(token) {
    let jwt = new Jwt()//实例化一个jwt对象来进行token验证
    let userInfo = jwt.verifyToken(token).data
    return userInfo
}

module.exports = tokenParse