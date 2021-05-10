import React,{Component} from 'react'
import {
    message,
    Button,
    Modal,
} from 'antd'
import {Map,Marker,} from 'react-amap'
import { io } from "socket.io-client"
import {
    DownCircleOutlined,
    } from '@ant-design/icons';
import Userbox from '../Userbox/userbox'
import Card from '../Card/card'
import RecommendCard from '../Recommendcard/recommendcard'
import Textarea from '../Textarea/textarea'
import UserDetail from '../User/UserDetail/userdetail'
import CardDetail from '../Carddetail/carddetail'
import Chatroom from '../Chatroom/chatroom'
import Header from '../Header/header'

import {
    getCardListAjax,
    getUserInfoByIdAjax,
    cardCommentAjax,
    getCardCommentsAjax,
    cardCheckLikeAjax,
    getcardLikeCountAjax,
    cardCommentLikeAjax,
    cardCommentDelLikeAjax,
    cardCommentReplyAjax,
    postAnalysisDevice,
    test,
} from '../../api/index'

import "./main.css"
import { Switch } from 'react-router'

class Main extends Component{
    state = {
     cardListIndex:1,//当前卡片列表的页数
     topNum1:0,
     topNum2:0,
     topNum3:0,
     userInfo:{},
     cardList:[[]],
     cardHeight:[],
     cardList2:[],
     modalVisible:false,
     modalVisible2:false,
     chooseCardIndex1:0,//用来标识当前是哪个cardList项
     chooseCardIndex2:0,//用来标识当前是哪个cardList项的哪个项
     cardData:{},//传递给cardDetail组件的数据
     objUserInfo:{},//传递给userDetail组件的数据
     childs:{},
     msgList:[],//消息列表，结构[{userInfo,content},{userInfo,content}] 传递给chatroom组件
     socket:{},//初始化后的socket对象，需要传递给chatroom组件
     onlineList:[],//当前在线用户的userInfo，需要传递给userdetail组件
     privateMsgList:[],//私人聊天列表，需要传递给userdetail组件
    }
    componentDidMount(){

        //首次调用getCardListAjax
        getCardListAjax(1)
            .then(val => {
                

                this.setState({cardList:[val.data.data]},() => {
                    let imgs = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card img`)
                    //注意的一个问题就是在card内的图片尚未加载完毕的时候，
                    //card的clientHeight是不包括img的高度的，
                    //所以我在一批card的img加载完毕后再获取其高度，累加计算目前的top值。
                    let promiseArr = []
                    // 这里将每张图片加载完毕生成Promise对象，最后使用Promise.all方法统一进行结果代码执行。
                    Array.from(imgs).map((item,index) => {
                        let promise = new Promise((resolve,reject) => {
                            item.addEventListener("load",() => {
                                resolve("done")
                            })
                            item.addEventListener("error",() => {
                                reject("error")
                            })
                        })
                        promiseArr.push(promise)
                    })

                    Promise.all(promiseArr)
                        .then(() => {
                            let cards = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card`)
                            let btns = document.querySelectorAll(".more-card-btn")
                            let {cardList} = this.state
                            let {topNum1,topNum2,topNum3} = this.state
                            Array.from(cards).map((item,index) => {
                                    let cardListItem = cardList[this.state.cardListIndex-1] //获取到cardList的一项
                                    cardListItem[index].left = (index%3)*320 
                                    switch(index%3){
                                        case 0:{
                                            cardListItem[index].top = topNum1 + 20
                                            topNum1 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 1:{
                                            cardListItem[index].top = topNum2 + 20
                                            topNum2 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 2:{
                                            cardListItem[index].top = topNum3 + 20
                                            topNum3 +=  cards[index].clientHeight +20
                                            break
                                        }
                                    }
                            })
                                btns[0].style.top = topNum1 + 20 + "px"
                                btns[1].style.top = topNum2 + 20 + "px"
                                btns[2].style.top = topNum3 + 20 + "px"
                               Array.from(btns).map((item,index) => {
                                   item.style.left = (index%3)*321 + "px"
                               })
                            this.setState({cardList,topNum1,topNum2,topNum3})
                        })
                        .catch((err) => {
                            // console.log(err)
                            // message.warning("某图片加载失败，将影响瀑布流布局")
                            let cards = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card`)
                            let btns = document.querySelectorAll(".more-card-btn")
                            let {cardList} = this.state
                            let {topNum1,topNum2,topNum3} = this.state
                            Array.from(cards).map((item,index) => {
                                    let cardListItem = cardList[this.state.cardListIndex-1] //获取到cardList的一项
                                    cardListItem[index].left = (index%3)*320 
                                    switch(index%3){
                                        case 0:{
                                            cardListItem[index].top = topNum1 + 20
                                            topNum1 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 1:{
                                            cardListItem[index].top = topNum2 + 20
                                            topNum2 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 2:{
                                            cardListItem[index].top = topNum3 + 20
                                            topNum3 +=  cards[index].clientHeight +20
                                            break
                                        }
                                    }
                            })
                                btns[0].style.top = topNum1 + 20 + "px"
                                btns[1].style.top = topNum2 + 20 + "px"
                                btns[2].style.top = topNum3 + 20 + "px"
                               Array.from(btns).map((item,index) => {
                                   item.style.left = (index%3)*321 + "px"
                               })
                            this.setState({cardList,topNum1,topNum2,topNum3})
                        })
                })
            })
            .catch(err => {
                message.error("获取卡片列表失败请重试")
            })

        //这里需要采集用户信息传递给后端
        console.log(navigator)
        let os = ""
        if(navigator.userAgent.includes("Windows NT")){
            os = "windows"
        }else if(navigator.userAgent.includes("Android")){
            os = "android"
        }else if(navigator.userAgent.includes("iPhone")){
            os = "iphone"
        }else if(navigator.userAgent.includes("iPad")){
            os = "ipad"
        }else if(navigator.userAgent.includes("Mac")){
            os = "mac"
        }else if(navigator.userAgent.includes("Linux")){
            os = "linux"
        }
        
        //触发存储device的ajax
        postAnalysisDevice({os})
            .then(val => {
                // console.log(val)
            })
            .catch(err => {
                // console.log(err)
            })
    }

    // amapEvents = {
    //     created: (mapInstance) => {
    //       console.log('高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
    //     //   let citysearch = new window.AMap.CitySearch()
    //     let mapObj = new window.AMap.Map('iCenter');
    //     mapObj.plugin('AMap.Geolocation', () => {
    //         let geolocation = new window.AMap.Geolocation({
    //             enableHighAccuracy: true,//是否使用高精度定位，默认:true
    //             timeout: 10000,          //超过10秒后停止定位，默认：无穷大
    //             maximumAge: 0,           //定位结果缓存0毫秒，默认：0
    //             convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
    //             showButton: true,        //显示定位按钮，默认：true
    //             buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
    //             buttonOffset: new window.AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    //             showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
    //             showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
    //             panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
    //             zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    //         });
    //         mapObj.addControl(geolocation);
    //         geolocation.getCurrentPosition();
    //         window.AMap.event.addListener(geolocation, 'complete', this.onComplete);//返回定位信息
    //         window.AMap.event.addListener(geolocation, 'error', this.onError);      //返回定位出错信息
    //     });
    //     }
    //   };
    onComplete = (data) => {
        console.log(data)
    }
    onError = (err) => {
        console.log(err)
    }
    markerEvents = {
        created: (markerInstance) => {
          console.log('高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
          console.log(markerInstance);
        }
      }
      
    markerPosition = { longitude: 120, latitude: 30 };
    //通过userbox组件调用该函数传递userbox组件获得的userinfo
    getUserInfoFromUserBox = (userInfo) => {
        this.setState({userInfo})//userInfo用于传递给card组件，card组件通过userid来判断是否点赞过
        //在此处调用socketinit初始化函数，应为此刻用户已经登入,userInfo不存在时表面用户进行了用户退出
        if(Object.keys(userInfo).length){
            this.socketInit()
        }
    }

    getCardHeight = (index,height) => {
        console.log(index)
        console.log(height)
    }

    //carddetail model使用函数
    showModal = async (cardIndex1,cardIndex2,userCardData) => {//参数cardIndex1和cardIndex2用于标识目前操作的card的在二维数组cardList中的索引
        //如果userCardData该参数存在，证明获取carddetail是在userdetail的历史卡片中发生的，cardData不从main的cardlist中获取，而是直接传递
        let cardList = JSON.parse(JSON.stringify(this.state.cardList))
        let cardData = ""
        if(!userCardData){
        // 不存在的情况则从cardList中获取
        //在这里获取card的评论的用户信息并填塞进cardList
            cardData = cardList[cardIndex1][cardIndex2]
        }else{
            //userCardData存在就直接使用
            cardData = userCardData
        }

        for(let i = 0;i < cardData.comments.length;i++){
            await getUserInfoByIdAjax( cardData.comments[i].userId)
            .then(val => {
                cardData.comments[i].userInfo =val.data.data
            })
            .catch(err => {
                message.warning("获取评论列表失败请重试!")
            })

            if(cardData.comments[i].toUserId){
                //证明该comment是一条回复，不仅要获取userInfo还要获取toUserInfo
            await getUserInfoByIdAjax( cardData.comments[i].toUserId)
            .then(val => {
                cardData.comments[i].toUserInfo =val.data.data
            })
            .catch(err => {
                message.warning("获取评论列表失败请重试!")
            })
            }
        }
        this.setState({modalVisible:true,chooseCardIndex1:cardIndex1,chooseCardIndex2:cardIndex2,cardList,cardData})
    };
    
    //carddetail model使用函数
    handleOk = () => {
        this.setState({modalVisible:false})
      };
    
    //carddetail model使用函数
    handleCancel = async () => {
        this.updateCardItemStatus()
        if(this.state.childs.userdetail){
        this.state.childs.userdetail.cardlistMode()//调用userdetail子组件的函数更新其历史卡片cardlist
        }
        this.setState({modalVisible:false,})//更新抹布状态和cardList
    };

    //useretail model使用函数
    showModal2 = (objUserInfo,e,tag) => {
        console.log(tag)
        //阻止事件冒泡
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({modalVisible2:true,objUserInfo},() => {
            if(tag){
                //如果特殊标识存在，证明需要userdetial组件默认开启chatroom模式
                //调用userdetial组件中的方法
                this.userdetail.chatroomMode()
                // this.state.childs.userdetail.chatroomMode()
            }
        })
        
      };
    
    //userdetail model使用函数
    handleOk2 = () => {
        this.setState({modalVisible2:false})
      };
    
    //userdetail model使用函数
    handleCancel2 = () => {
        this.setState({modalVisible2:false})
      };

    //更新cardList互动状态函数
    updateCardItemStatus = async () => {
            let cardList = JSON.parse(JSON.stringify(this.state.cardList))
            let item = JSON.parse(JSON.stringify(this.state.cardData))
            // let item = cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2] //刚刚被选中的卡片
            //每当关闭了carddetail之后，要再次触发一次点赞检查函数和操作数量获取函数，更新该卡片的互动状态
            //也就是更新cardList的某一项
            if(this.state.userInfo){//用户已登入
                let token = localStorage.getItem("token")
                //触发点赞检查请求ajax来对this.state.likeChoose和likeCount进行初始化
                await cardCheckLikeAjax({cardId:item._id},token)
                  .then(val => {
                    item.likeChoose = val.data.data //更新item的是否点赞状态
                  })
                  .catch(err => {
                    message.warn("获取点赞信息出现问题")
                  })
              }
    
            //获取card的点赞数量、评论数量、star数量
            await getcardLikeCountAjax({cardId:item._id})
            .then(val => {
                item.likesCount = val.data.likesCount //更新点赞数量
                item.commentsCount = val.data.commentsCount //更新评论数量
                item.starsCount = val.data.starsCount //更新收藏数量
            })
            .catch(err => {
              message.warning("卡片点赞数量获取出现问题请稍候再试")
            })
            this.setState({cardList,cardData:item})
    }

    //加载更多函数
    loadMore = () => {
        let objectCardListIndex = this.state.cardListIndex + 1  //目标cardlist页数
        //调用获取cardList的函数
        getCardListAjax(objectCardListIndex)
            .then(val => {
                let cardListItem = val.data.data
                let cardList = this.state.cardList
                cardList.push(cardListItem) //给cardList添加一个数组项，也就是新的一页的数据
                this.setState({cardList,cardListIndex:objectCardListIndex},() => {
                    let imgs = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card img`)
                    //注意的一个问题就是在card内的图片尚未加载完毕的时候，
                    //card的clientHeight是不包括img的高度的，
                    //所以我在一批card的img加载完毕后再获取其高度，累加计算目前的top值。
                    let promiseArr = []
                    // 这里将每张图片加载完毕生成Promise对象，最后使用Promise.all方法统一进行结果代码执行。
                    Array.from(imgs).map((item,index) => {
                        let promise = new Promise((resolve,reject) => {
                            item.addEventListener("load",() => {
                                resolve("done")
                            })
                            item.addEventListener("error",() => {
                                reject("error")
                            })
                        })
                        promiseArr.push(promise)
                    })

                    Promise.all(promiseArr)
                        .then(() => {
                            let cards = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card`)
                            console.log(cards)
                            let btns = document.querySelectorAll(".more-card-btn")
                            let {cardList} = this.state
                            let {topNum1,topNum2,topNum3} = this.state
                            Array.from(cards).map((item,index) => {

                                    let cardListItem = cardList[this.state.cardListIndex-1] //获取到cardList的一项
                                    console.log(cardListItem)
                                    cardListItem[index].left = (index%3)*320 
                                    switch(index%3){
                                        case 0:{
                                            cardListItem[index].top = topNum1 + 20
                                            topNum1 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 1:{
                                            cardListItem[index].top = topNum2 + 20
                                            topNum2 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 2:{
                                            cardListItem[index].top = topNum3 + 20
                                            topNum3 +=  cards[index].clientHeight +20
                                            break
                                        }
                                    }
                            })
                                btns[0].style.top = topNum1 + 20 + "px"
                                btns[1].style.top = topNum2 + 20 + "px"
                                btns[2].style.top = topNum3 + 20 + "px"
                               Array.from(btns).map((item,index) => {
                                   item.style.left = (index%3)*321 + "px"
                               })
                               this.setState({cardList,topNum1,topNum2,topNum3})
                        })
                        .catch((err) => {
                            // console.log(err)
                            // message.warning("某图片加载失败，将影响瀑布流布局")
                            let cards = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card`)
                            let btns = document.querySelectorAll(".more-card-btn")
                            let {cardList} = this.state
                            let {topNum1,topNum2,topNum3} = this.state
                            Array.from(cards).map((item,index) => {
                                    let cardListItem = cardList[this.state.cardListIndex-1] //获取到cardList的一项
                                    cardListItem[index].left = (index%3)*320 
                                    switch(index%3){
                                        case 0:{
                                            cardListItem[index].top = topNum1 + 20
                                            topNum1 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 1:{
                                            cardListItem[index].top = topNum2 + 20
                                            topNum2 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 2:{
                                            cardListItem[index].top = topNum3 + 20
                                            topNum3 +=  cards[index].clientHeight +20
                                            break
                                        }
                                    }
                            })
                                btns[0].style.top = topNum1 + 20 + "px"
                                btns[1].style.top = topNum2 + 20 + "px"
                                btns[2].style.top = topNum3 + 20 + "px"
                               Array.from(btns).map((item,index) => {
                                   item.style.left = (index%3)*321 + "px"
                               })
                            this.setState({cardList,topNum1,topNum2,topNum3})
                        })
                })
            })
            .catch(err => {
                console.log(err)
            })
    }



    //评论提交函数----------需要传递给cardDetail组件
    cardCommentSubmit = (content,cardId) => {
        let token = localStorage.getItem("token")
        cardCommentAjax({content,cardId},token)
            .then(async val => {
                message.success("评论成功！")
                 // 再次获取评论列表
                    //在这里获取card的评论的用户信息并填塞进cardList
                    let cardList = JSON.parse(JSON.stringify(this.state.cardList))
                    let cardData = JSON.parse(JSON.stringify(this.state.cardData))
                    // let cardData = cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2]//参数cardIndex1和cardIndex2用于标识目前操作的card的在二维数组cardList中的索引
                    await getCardCommentsAjax({cardId:cardData._id})
                    .then(async val => {
                        let newComment = val.data.data.comments[val.data.data.comments.length-1]
                        await getUserInfoByIdAjax(val.data.data.comments[val.data.data.comments.length-1].userId)
                            .then(val => {
                                newComment.userInfo = val.data.data
                            })
                            .catch(err => {
                                message.warning("获取评论列表失败请重试!")
                            })
                        cardData.comments.push(newComment)
                        // let item = JSON.parse(JSON.stringify(this.state.cardData))
                        // let item = cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2] //刚刚被选中的卡片
                        //每当关闭了carddetail之后，要再次触发一次点赞检查函数和操作数量获取函数，更新该卡片的互动状态
                        //也就是更新cardList的某一项
                        if(this.state.userInfo){//用户已登入
                            let token = localStorage.getItem("token")
                            //触发点赞检查请求ajax来对this.state.likeChoose和likeCount进行初始化
                            await cardCheckLikeAjax({cardId:cardData._id},token)
                              .then(val => {
                                cardData.likeChoose = val.data.data //更新item的是否点赞状态
                              })
                              .catch(err => {
                                message.warn("获取点赞信息出现问题")
                              })
                          }
                
                        //获取card的点赞数量、评论数量、star数量
                        await getcardLikeCountAjax({cardId:cardData._id})
                        .then(val => {
                            cardData.likesCount = val.data.likesCount //更新点赞数量
                            cardData.commentsCount = val.data.commentsCount //更新评论数量
                            cardData.starsCount = val.data.starsCount //更新收藏数量
                        })
                        .catch(err => {
                          message.warning("卡片点赞数量获取出现问题请稍候再试")
                        })
                        cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2] = cardData
                        this.setState({cardList,cardData})
                    })
                    .catch(err => {
                        console.log(err)
                        message.warning("获取评论列表失败请重试!")
                    })
            })
            .catch(err => {
                message.warning("评论失败，请稍候重试!")
            })
    }

    //评论回复函数------需要传递给cardDetail组件
    cardCommentReply = (cardId,content,toUserId) => {
        let token = localStorage.getItem("token")
        cardCommentReplyAjax({cardId,content,toUserId},token)
            .then(async val => {
                    // 再次获取评论列表
                    //在这里获取card的评论的用户信息并填塞进cardList
                    let cardList = JSON.parse(JSON.stringify(this.state.cardList))
                    let cardData = JSON.parse(JSON.stringify(this.state.cardData))
                    // let cardData = cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2]//参数cardIndex1和cardIndex2用于标识目前操作的card的在二维数组cardList中的索引
                    await getCardCommentsAjax({cardId:cardData._id})
                    .then(async val => {
                        let newComment = val.data.data.comments[val.data.data.comments.length-1]
                        await getUserInfoByIdAjax(val.data.data.comments[val.data.data.comments.length-1].userId)
                            .then(val => {
                                newComment.userInfo = val.data.data
                            })
                            .catch(err => {
                                message.warning("获取评论列表失败请重试!")
                            })
                        await getUserInfoByIdAjax(val.data.data.comments[val.data.data.comments.length-1].toUserId)
                            .then(val => {
                                newComment.toUserInfo = val.data.data
                            })
                            .catch(err => {
                                message.warning("获取评论列表失败请重试!")
                            })
                        cardData.comments.push(newComment)
                        let item = this.state.cardData
                        // let item = cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2] //刚刚被选中的卡片
                        //每当关闭了carddetail之后，要再次触发一次点赞检查函数和操作数量获取函数，更新该卡片的互动状态
                        //也就是更新cardList的某一项
                        if(this.state.userInfo){//用户已登入
                            let token = localStorage.getItem("token")
                            //触发点赞检查请求ajax来对this.state.likeChoose和likeCount进行初始化
                            await cardCheckLikeAjax({cardId:item._id},token)
                              .then(val => {
                                item.likeChoose = val.data.data //更新item的是否点赞状态
                              })
                              .catch(err => {
                                message.warn("获取点赞信息出现问题")
                              })
                          }
                
                        //获取card的点赞数量、评论数量、star数量
                        await getcardLikeCountAjax({cardId:item._id})
                        .then(val => {
                            item.likesCount = val.data.likesCount //更新点赞数量
                            item.commentsCount = val.data.commentsCount //更新评论数量
                            item.starsCount = val.data.starsCount //更新收藏数量
                        })
                        .catch(err => {
                          message.warning("卡片点赞数量获取出现问题请稍候再试")
                        })
                        console.log(item)
                        cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2] = item
                        console.log(cardList)
                        this.setState({cardList,cardData})
                    })
                    .catch(err => {
                        console.log(err)
                        message.warning("获取评论列表失败请重试!")
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    //评论点赞函数----------需要传递给cardDetail组件
    cardCommentLike = (cardId,commentIndex) => {
        let token = localStorage.getItem("token")
        //准备数据：1.cardId卡片的id，2.被点赞评论的索引
        cardCommentLikeAjax({cardId,commentIndex},token)
            .then(val => {
                message.success("点赞成功")
                let cardList = JSON.parse(JSON.stringify(this.state.cardList))
                let cardData = JSON.parse(JSON.stringify(this.state.cardData))
                cardData.comments[commentIndex].likes.push(this.state.userInfo.userId)
                this.setState({cardList,cardData})
            })
            .catch(err => {
                message.warning("点赞错误，稍后重试")
                console.log(err)
            })
    }

    //评论取消点赞函数------需要传递给cardDetail组件
    cardCommentDisLike = (cardId,commentIndex) => {
        let token = localStorage.getItem("token")
        //准备数据：1.cardId卡片的id，2.被点赞评论的索引
        cardCommentDelLikeAjax({cardId,commentIndex},token)
            .then(val => {
                // message.success("点赞成功")
                let cardList = JSON.parse(JSON.stringify(this.state.cardList))
                let cardData = JSON.parse(JSON.stringify(this.state.cardData))
                let itemIndex = cardData.comments[commentIndex].likes.indexOf(this.state.userInfo.userId)
                cardData.comments[commentIndex].likes.splice(itemIndex,1)
                this.setState({cardList,cardData})
            })
            .catch(err => {
                console.log(err)
            })
    }

   

    //登入检查函数
    loginCheck = () => {

        if(!Object.keys(this.state.userInfo).length){
            return false
        }
        return true
    }

    //更新私人聊天列表数据函数，需要传递给userdetail组件
    updatePrivateMsgList = (privateMsgList) => {
        this.setState({privateMsgList})
    }

    //获取header组件this函数
    onHeader = (ref) => {
        this.header = ref
    } 

    //获取userdetial组件this函数
    onUserdetail = (ref) => {
        this.userdetail = ref
    }

    //获取Card组件的this函数
    onCard = (ref) => {
        this.card = ref
    }

     //获取子组件userdetail方法
     getUserdetailThis = (userdetailThis) => {
        let childs = {
            userdetail:userdetailThis
        }
        this.setState({childs})
    }

    //socket断开函数，需要传递给userbox组件，当用户退出时调用
    socketDisconnected = () => {
        //更新onlineList
        this.state.socket.disconnect()//断开socket
    }

    //socketIO初始化函数
    //由main组件---->userBox组件--->login组件和register组件
    socketInit = () => {
        //如果登入了才连接websocket
        let socket =  io("http://localhost:3030",{
            query:{userInfo:JSON.stringify(this.state.userInfo)}//将userInfo传递过去
        })
        this.setState({socket},() => {
            // 监听与服务端的连接
            this.state.socket.on('connect', () => {
                console.log('连接成功'); 
            });

            //接收当前在线用户
            this.state.socket.on("users",(users) => {
                //获取新用户信息，更新onlineList
                // console.log("获取了当前在线用户")
                // console.log(users)
                this.setState({onlineList:users})
            })

            //接收新用户上线提醒
            this.state.socket.on("user connected",(user) => {
                //获取新用户信息，更新onlineList
                let onlineList = JSON.parse(JSON.stringify(this.state.onlineList))
                let flag = false
                //重复的话取后者
                onlineList.map((item,index) => {
                    if(item.userInfo.nickname == user.userInfo.nickname){
                        flag = true
                        item = user
                    }
                })
                //不同则push
                if(!flag) onlineList.push(user)
                
                this.setState({onlineList})
            })

            //接受用户下线提醒
            this.state.socket.on("user disconnect",(users) => {
                // alert("disconnect执行")
                console.log(users)
                //获取新用户信息，更新onlineList
                // console.log("获取了当前在线用户")
                // console.log(users)
                this.setState({onlineList:users})
            })

            //接受来自客户端的消息
            this.state.socket.on("message",(data) => {
                let msgList = JSON.parse(JSON.stringify(this.state.msgList))
                msgList.push(data)
                this.setState({msgList})//更新msgList
            })

            //接收私人消息
            this.state.socket.on("privateMsg",({content,from,fromUserInfo,toUserInfo}) => {
                let privateMsgList = JSON.parse(JSON.stringify(this.state.privateMsgList))
                privateMsgList.push({content,from,fromUserInfo,toUserInfo})
                this.setState({privateMsgList})
                
                //在线的情况在这里触发，不在线的情况在userdetial
                //这里应该触发消息通知
                let data = {
                    type:"message",
                    info:"一封新消息",
                    read:false,
                    fromUserInfo,
                    toUserInfo
                }
                let obj = {
                    data,
                    userId:this.state.userInfo.userId
                }
                // alert("执行了socket.on")
                //触发header子组件更新其noticeList函数
                this.header.updateNoticeList(obj)
            })

            //接收点赞消息
            this.state.socket.on("like",(data) => {
                let {
                    fromUserInfo,
                    toUserInfo,
                    cardId,
                } = data
                //这里需要更新一下cardList中对应那张卡片的like长度
                //根据data中传递的cardId选中需要改变like数量的cardItem
                // let cardList = JSON.parse(JSON.stringify(this.state.cardList))
                // cardList.map((item,index) => {
                //     //注意cardList是个双重数组
                //     item.map((item2,index2) => {
                //         if(item2._id == data.cardId){
                //             item2.likes.push(data.fromUserInfo._id)
                //         }
                //     })
                // })
                // this.setState({cardList})
                //调用一下card组件的likesCountUpdate函数
                // console.log(this.onCard)
                // this.card.likesCountUpdate()

                //添加消息通知
                let innerObj = {
                    type:"like",
                    info:"收到了一个赞",
                    read:false,
                    fromUserInfo,
                    toUserInfo,
                    cardId
                }
                let outerObj = {
                    data:innerObj,
                    userId:this.state.userInfo.userId
                }
                //触发header子组件更新其noticeList函数
                this.header.updateNoticeList(outerObj)
            })

            //接收评论
            this.state.socket.on("comment",(data) => {
                let {
                    fromUserInfo,
                    toUserInfo,
                    cardId,
                } = data

                //添加消息通知
                let innerObj = {
                    type:"comment",
                    info:"有人给你评论!",
                    read:false,
                    fromUserInfo,
                    toUserInfo,
                    cardId
                }
                let outerObj = {
                    data:innerObj,
                    userId:this.state.userInfo.userId
                }
                //触发header子组件更新其noticeList函数
                this.header.updateNoticeList(outerObj)
            })

        })
    }
    mainUpdateNoticeList = (data) => {
           // //触发header子组件更新其noticeList函数
            this.header.updateNoticeList(data)
    }


    render() {
        return (
            <div className="main clearfix">
                <Header
                    showModal={this.showModal}//用于打开carddetial组件
                    showModal2={this.showModal2}//用于打开userdetial组件
                    userInfo = {this.state.userInfo}//当前用户userInfo
                    onRef={this.onHeader}//用于main父组件调用header子组件
                />
                {/* <div id="iCenter" style={{width:"500px",height:"500px"}}>
                <Map amapkey="59e84b3980cb9f86930d92eb90d9e204" events={this.amapEvents}>
                    <Marker position={this.markerPosition} events={this.markerEvents} />
                </Map>
                </div> */}

                <div className="main-container">
                    <div className="main-left-box">
                      <Userbox 
                        socketDisconnected={this.socketDisconnected}//用于断开socket连接
                        history={this.props.history}
                        getUserInfoFromUserBox={this.getUserInfoFromUserBox}
                        socketInit={this.socketInit}
                        />
                      <div className="recommend-box">
                        <p className="recommend-box-title">Classmate:</p>
                        <RecommendCard 
                            showModal2={this.showModal2}
                        />
                      </div>
                    </div>
                  
                  <div className="main-right-box">

                   <div className="main-textarea-box">
                   <p className="main-card-box-textarea-title">Textarea:</p>
                        <Textarea
                            mainGetCard={this.mainGetCard}
                            loginCheck={this.loginCheck}//登入检查函数
                        />
                   </div>

                    <div className="main-chatroom-box">
                        <p className="main-card-box-textarea-title">Chatroom:</p>
                        <Chatroom
                            socket={this.state.socket}//初始化后的socket对象
                            msgList={this.state.msgList}//消息列表
                            loginCheck={this.loginCheck}//登入检查函数
                            userInfo={this.state.userInfo}//传递当前已经登入的用户info
                            showModal2={this.showModal2}//用于打开用户详细  
                        />
                    </div>

                    <div className="main-card-box">
                            
                        {/* <div className="card-box"> */}
                        <p className="main-card-box-title">Card:</p>
                        {/* {
                            new Array(1,2,3,4,5,6,7,8,9,10).map((item,index) => {
                                return (
                                    <Card key={index}/>
                                )
                            })
                        } */}
                        <div className="main-card-inner-box clearfix" >
                            {
                                this.state.cardList.map((item1,index1) => {
                                    return(
                                        <div key={index1} className={`cardListItem${index1+1}`}>
                                            {
                                                item1.map((item2,index2) => {
                                                    return(
                                                        <Card  
                                                            onCard = {this.onCard} //用于main组件得到card组件的this
                                                            onlineList={this.state.onlineList}//当前在线用户列表
                                                            socket = {this.state.socket}//用于emit一个点赞事件
                                                            getCardHeight={this.getCardHeight} 
                                                            userInfo={this.state.userInfo} 
                                                            key={item2._id} 
                                                            cardData={item2} 
                                                            index1={index1}
                                                            index2={index2} 
                                                            showModal={this.showModal}//用于打开动态详细
                                                            showModal2={this.showModal2}//用于打开用户详细  
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        {/* 加载更多的按钮 */}
                        <Button type="primary" className="more-card-btn" onClick={this.loadMore}>
                        <DownCircleOutlined />加载更多
                        </Button>
                        <Button type="primary" className="more-card-btn" onClick={this.loadMore}>
                        <DownCircleOutlined />加载更多
                        </Button>
                        <Button type="primary" className="more-card-btn" onClick={this.loadMore}>
                        <DownCircleOutlined />加载更多
                        </Button>
                        </div>
                        

                        {/* </div> */}
                    </div>
                </div>
                </div>

                {/* carddetail modal */}
                <Modal zIndex={3000} wrapClassName="cardDetailModal" footer={null} closable={false} visible={this.state.modalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    {/* 卡片详细模块 */}
                    <div className="main-carddetail-box">
                        <CardDetail 
                            onlineList={this.state.onlineList}//当前在线用户列表
                            socket={this.state.socket}//初始化的socket对象
                            loginCheck={this.loginCheck}//登入检查函数
                            showModal={this.showModal}//用于打开动态卡片详细 （在carddetail组件中专递给card组件）
                            showModal2={this.showModal2}//用于打开用户详细 （在carddetail组件中专递给card组件）
                            commentSubmit={this.cardCommentSubmit} 
                            cardCommentLike={this.cardCommentLike}
                            cardCommentDisLike={this.cardCommentDisLike}
                            cardCommentReply={this.cardCommentReply}
                            userInfo={this.state.userInfo} 
                            cardData={this.state.cardData}
                            // cardData={this.state.cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2]}
                        />
                        {/* <CardDetail commentSubmit={this.cardCommentSubmit} userInfo={this.state.userInfo} cardData={this.state.cardData}/> */}
                    </div>
                </Modal>

                {/* userdetail modal */}
                <Modal wrapClassName="userDetailModal" footer={null} closable={false} visible={this.state.modalVisible2} onOk={this.handleOk2} onCancel={this.handleCancel2}>
                    {/* 用户详细模块 */}
                   <div className="userdetail-box">
                                {/* <p className="userdetail-box-title">UserDetail:</p> */}
                                <UserDetail
                                    updateNoticeList={this.mainUpdateNoticeList}
                                    onRef={this.onUserdetail}//用于将自己整个组件this交给main组件
                                    updatePrivateMsgList={this.updatePrivateMsgList}//更新私聊列表函数
                                    privateMsgList={this.state.privateMsgList}//私聊列表
                                    onlineList={this.state.onlineList}//当前在线用户列表
                                    socket={this.state.socket}//初始化的socket对象
                                    loginCheck={this.loginCheck}//登入检查函数
                                    getUserdetailThis={this.getUserdetailThis}
                                    showModal={this.showModal}//用于打开动态卡片详细 （在userdetail组件中专递给card组件）
                                    showModal2={this.showModal2}//用于打开用户详细 （在userdetail组件中专递给card组件）
                                    userInfo={this.state.objUserInfo} //来自card组件的数据
                                    myUserInfo={this.state.userInfo}//当前用户个人信息
                                />
                   </div>
                </Modal>
            </div>
        )
    }
}

export default Main