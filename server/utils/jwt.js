const jwt = require("jsonwebtoken")

class Jwt {
    constructor(data = {}) {
        this.data = data
        this.sercet = "hello token"
    }

    generToken(){
        let data = this.data
        let secret = this.sercet
        let endTime = Math.floor(Date.now()/1000)
        // let token = jwt.sign(data,secret,{expiresIn:"3h"})
        let token = jwt.sign({data,exp:endTime + 3600},secret)
        return token
    }

    verifyToken(token){
        let secret = this.sercet
        let nowTime = Math.floor(Date.now()/1000)
        let result = jwt.verify(token,secret,{},(error,decoded) => {
            if(error){
                //error有值有两种情况，
                    //exp过期时间已经小于当前时间。
                    //token传递有误。
                // console.log(error)
                return {code:100,msg:"token已过期"}
            }
                return {code:200,...decoded}
        })
        return result
    }
}

module.exports = Jwt
