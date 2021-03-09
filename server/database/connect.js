const mongoose = require("mongoose")
const db = "mongodb://localhost:27017/new-wall"

module.exports.connect = () => {
    mongoose.connect(db,{ useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true})
    let maxReconnectCount = 0
    return new Promise(((resolve, reject) => {
        //绑定事件
        mongoose.connection.on("disconnected",() => {
            if(maxReconnectCount < 3){
                //可进行重连
                mongoose.connect(db,{ useNewUrlParser: true })
                return 1
            }else{
                //超出最大连接限制
                reject("连接失败！超出最大重连次数限制！")
            }
        })

        mongoose.connection.on("error",() => {
            if(maxReconnectCount < 3){
                //可进行重连
                mongoose.connect(db,{ useNewUrlParser: true })
                return 1
            }else{
                //超出最大连接限制
                reject("连接失败！超出最大重连次数限制！")
            }
        })

        mongoose.connection.on("open",() => {
            resolve("连接数据库成功！🤓")
        })
    }))
}