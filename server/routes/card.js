//card子路由模块
const Router = require("koa-router")
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const fs = require("fs")//nodejs的文件模块
const multiparty = require("multiparty")//解析文件上传模块
const util = require("util")//工具模块
const tokenParse = require("../utils/tokenParse")//token解析函数
const {CardModel,} = require("../database/schema&model")//导入Model对象

const card = new Router()

let imgsArr = [] //该数组用于存储用户在post卡片前上传的图片名称

//-----------使用中间件----------------------
card.use(koaBodyParser()) //使用post数据解析中间件

//卡片附属图片提交
card.post("/upload",async (ctx,next) => {
    let {cardId} = ctx.request.query
    let imageName
    //multiparty模块的使用
    const promise = new Promise((resolve,reject) => {
        let form = new multiparty.Form({uploadDir: './uploads'})
        form.parse(ctx.req, (err,fields,files) => {
            imageName = files.file[0].path.split("/")[1]
            resolve(imageName)
            if(err) {
                ctx.body = {code:100,msg:"上传失败!"}
                reject(err)
            }
        })
    })
    await promise
        .then(async val => {
            if(!cardId){
                //提交的第一张图片
                //操作数据库
                let card = new CardModel({
                    img:[imageName]
                })
                await card.save()
                    .then(val => {
                        ctx.body = {code:200,data:val}
                    })
                    .catch(err => {
                        ctx.body = {code:100,msg:"图片提交失败，请重试"}
                    })
            }else{
                //非首张图片
                //操作数据库
                await CardModel
                    .find({_id:cardId})
                    .then(async doc => {
                            let {img} = doc[0]
                            img.push(imageName)
                            await CardModel.update({_id:cardId},{img})
                                .then(async val => {
                                        console.log("----------------")
                                        await CardModel.find({_id:cardId})
                                            .then(val => {
                                                ctx.body = {code:200,data:val[0]}
                                            })
                                })
                                .catch(err => {
                                    console.log(err)
                                    ctx.body = {code:102,msg:"图片提交失败，请重试"}
                                })
                    })
                    .catch((err) => {
                        console.log(err)
                        ctx.body = {code:102,msg:"图片提交失败，请重试"}
                    })
            }
        })
        .catch(err => {
            ctx.body = {code:100,msg:"图片提交失败，请重试"}
        })
    // if(!cardId){
    //     //提交的第一张图片
    //     //操作数据库
    //     let card = new CardModel({
    //         img:[imageName]
    //     })
    //     await card.save()
    //         .then(val => {
    //             ctx.body = {code:200,data:val}
    //         })
    //         .catch(err => {
    //             ctx.body = {code:100,msg:"卡片提交失败，请重试"}
    //         })
    // }
})

//删除刚刚上传的图片
card.post("/delupload",async (ctx,next) => {
    let {imageName,cardId} = ctx.request.body //解析post数据
    //操作数据库，查找到该card doc,删除img字段中的imageName
    await CardModel.find({_id:cardId})
        .then(async doc => {
            let {img} = doc[0]
            img.splice(img.indexOf(imageName),1)
            await CardModel.updateOne({_id:cardId}, {$set:{img}})
                .then(val => {
                    ctx.body = {code:200,data:"删除成功"}
                })
                .catch(err => {
                    ctx.body = {code:100,msg:"删除有误"}
                })
        })
        .catch(err => {
            console.log(err)
            ctx.body = {code:100,msg:"删除有误"}
        })
})

//卡片提交
card.post("/submit",async (ctx,next) => {
    //token解析操作
    let userInfo = tokenParse(ctx.request.headers.token)
    let {content,typeIndex,cardId} = ctx.request.body //解析post数据
    //操作数据库
    let mydate = new Date()
    if(cardId){
        //已经上传了图片，card doc已经存在
        //操作数据库
        await CardModel
            .update({_id:cardId},{
            userId:userInfo.userId,
            content,
            date:`${mydate.toLocaleDateString()} ${mydate.getHours()}:${mydate.getMinutes()}`,
            type:typeIndex,
            ISODate:new Date()
            })
            .then(val => {
                ctx.body = {code:200,data:"卡片提交成功"}
            })
            .catch(err => {
                ctx.body = {code:100,msg:"卡片提交失败，请重试"}
            })
    }else{
        //未上传图片，save一个card doc
        let card = new CardModel({
            userId:userInfo.userId,
            content,
            date:`${mydate.toLocaleDateString()} ${mydate.getHours()}:${mydate.getMinutes()}`,
            img:imgsArr,
            type:typeIndex,
            ISODate:new Date()
        })

        await card.save()
            .then(() => {
                ctx.body = {code:200,data:"卡片提交成功"}
                imgsArr = [] //清空卡片
            })
            .catch(() => {
                ctx.body = {code:100,msg:"卡片提交失败，请重试"}
            })
    }

})

//获取卡片路由
card.get("/list",async (ctx,next) => {
    let {page} = ctx.request.query
    //这里的话采取首次查询查卡片前9张，然后前端下拉更新再进行查询
    //这里需要过滤掉只有Img字段的集合，那是正在提交的textarea
    //所以根据传递的查询页面来进行数据库调用
    //直接查询数据库
    if(page == 1){
        //首页查询
        //userId的属性为string时(userId存在时，这里是为了过滤掉已经有Img但是仍未提交的doc)
        await CardModel.find({userId:{$type:'string'}}).limit(9).sort({ISODate:-1})
            .then(val => {
                ctx.body = {code:200,data:val}
            })
            .catch(err => {
                ctx.body = {code:200,data:"获取卡片列表失败，请稍候再试"}
            })
    }else{
        //非首页查询
        //userId的属性为string时(userId存在时，这里是为了过滤掉已经有Img但是仍未提交的doc)
        await CardModel.find({userId:{$type:'string'}}).limit(9).skip((page-1) * 9).sort({ISODate:-1})
            .then(val => {
                ctx.body = {code:200,data:val}
            })
            .catch(err => {
                ctx.body = {code:200,data:"获取卡片列表失败，请稍候再试"}
            })
    }
})

//卡片点赞接口
card.post("/like",async(ctx,next) => {
  //token解析操作
  let userInfo = tokenParse(ctx.request.headers.token)
  let {cardId} = ctx.request.body //解析post数据
  //数据库操作
  await CardModel.find({_id:cardId})
        .then(async doc => {
          let likes = doc[0].likes
          likes.push(userInfo.userId) //将最新的点赞用户id添加
          await CardModel.updateOne({_id:cardId},{$set:{likes}})
                .then(val => {
                  ctx.body = {code:200,data:"点赞成功！"}
                })
                .catch(err => {
                  console.log(err)
                  ctx.body = {code:100,msg:"点赞模块出现问题请稍候再试"}
                })
        })
        .catch(err => {
          console.log(err)
          ctx.body = {code:100,msg:"点赞模块出现问题请稍候再试"}
        })

})

//卡片取消点赞接口
card.post("/dellike",async(ctx,next) => {
      //token解析操作
    let userInfo = tokenParse(ctx.request.headers.token)
    let {cardId} = ctx.request.body //解析post数据
      //数据库操作
  await CardModel.find({_id:cardId})
  .then(async doc => {
    let likes = doc[0].likes
    likes.splice(likes.indexOf(userInfo.userId),1)//将该用户删除
    await CardModel.updateOne({_id:cardId},{$set:{likes}})
          .then(val => {
            ctx.body = {code:200,data:"取消点赞成功！"}
          })
          .catch(err => {
            console.log(err)
            ctx.body = {code:100,msg:"取消点赞模块出现问题请稍候再试"}
          })
  })
  .catch(err => {
    console.log(err)
    ctx.body = {code:100,msg:"取消点赞模块出现问题请稍候再试"}
  })
})

//卡片点赞检查接口
card.post("/checklike",async(ctx,next) => {
  //token解析操作
  let userInfo = tokenParse(ctx.request.headers.token)
  let {cardId} = ctx.request.body //解析post数据
  //操作数据库,判断userId是否存在于doc.likes
  await CardModel.find({_id:cardId})
    .then(doc => {
      if(doc[0].likes.includes(userInfo.userId)){
        //该用户点赞过该卡片
        ctx.body = {code:200,data:true}
      }else{
        //该用户没点赞过该卡片
        ctx.body = {code:200,data:false}
      }
    })
    .catch(err => {
      console.log(err)
      ctx.body = {code:100,msg:"卡片数据获取出现问题请稍候再试"}
    })
})

//卡片点赞数量、评论数量、stars数量
card.get("/count",async (ctx,next) => {
    let {cardId} = ctx.request.query
    // 操作数据库，返回like数量
    await CardModel.find({_id:cardId})
        .then(doc => {
            ctx.body = {code:200,likesCount:doc[0].likes.length,commentsCount:doc[0].comments.length,starsCount:doc[0].stars.length}
        })
        .catch(err => {
            ctx.body = {code:100,msg:"卡片互动数量获取出现问题请稍候再试"}
        })
})

//卡片回复路由
card.post("/comment",async(ctx,next) => {
  //token解析操作
  let userInfo = tokenParse(ctx.request.headers.token)
  let {cardId,content} = ctx.request.body //解析post数据

  //操作数据库
  await CardModel.find({_id:cardId})
    .then(async doc => {
        let {comments} = doc[0]
        comments.push({userId:userInfo.userId,content}) //向comments字段添加对象，对象内容为评论者ID和评论内容
        await CardModel.updateOne({_id:cardId},{$set:{comments}})
                .then(val => {
                    ctx.body = {code:200,msg:"评论成功"}
                })
                .catch(err => {
                    ctx.body = {code:100,msg:"评论失败，请重试！"}
                })
    })
    .catch(err => {
        ctx.body = {code:100,msg:"评论失败，请重试！"}
    })
})

//获取卡片评论路由
card.get("/getcomments",async (ctx,next) => {
    let {cardId} = ctx.request.query
    //操作数据库
    await CardModel.find({_id:cardId})
        .then(doc => {
            let {comments} = doc[0]
            ctx.body = {code:200,data:{comments}}
        })
        .catch(err => {
            console.log(err)
            ctx.body = {code:100,msg:"获取评论失败"}
        })
})



//-----------子路由导出----------------------
module.exports = card
