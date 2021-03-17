const Jwt = require("./jwt")

async function tokenVerify (ctx, next){
    let urlArr = ["/user/getInfo","/user/avatar","/user/tag"] //需要token的url数组
    if(urlArr.indexOf(ctx.request.url) !== -1){
        //该url在需要token的url数组中
        let {token} = ctx.request.headers
        let jwt = new Jwt({}),result = null
        token ? result = jwt.verifyToken(token) : ctx.throw(401,"未携带token")
        if(result.code === 200){
            //这里有点疑惑，已经解析过一次token，验证通过即正常跳转，但是到了指定url后还需要再解析token获取data。
           await next()
        }else if(result.code === 100){
            ctx.throw(401,"token过期!")
        }
    }else{
        //请求url不需要token直接next()
       await next()
    }
}

module.exports = tokenVerify