// 该自定义中间件用于用户头像图片服务器指引
let fs = require("fs")
function  staticFun(ctx,next){
    let formName = ctx.request.url.slice(-3)
    if(formName == 'jpg' || formName == 'gif' || formName == 'png' || formName == 'peg'){
        // fs.stat("/home/tttjh/Code/new-wall/server/uploads"+ctx.request.url,(err,status) => {
        //     if(err || !status.isFile()){
        //         ctx.res.writeHead(200,{"content-type":"text/plain"})
        //         ctx.res.end("404 not found")
        //     }else{
        //         ctx.res.writeHead(200,{"content-type":"text/html"})
        //         ctx.res.end(":)")
        //         // fs.createReadStream("/home/tttjh/Code/new-wall/server/uploads"+ctx.request.url).pipe(ctx.res)
        //     }
        // })
        fs.readFile("/home/tttjh/Code/new-wall/server/uploads"+ctx.request.url,(err,files) => {
            if(err) throw err
            ctx.res.writeHead(200,{"content-type":"image/png"})
            ctx.res.end(files)
        })
    }else{
        next()
    }
}

module.exports = staticFun
