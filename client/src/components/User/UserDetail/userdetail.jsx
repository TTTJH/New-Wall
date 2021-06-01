import React,{Component} from 'react'
import {
    Input,
    Button,
    message,
    Popconfirm,
} from 'antd'
import {
    CommentOutlined,
    ProfileOutlined,
    SmileOutlined,
    FrownOutlined,
    SendOutlined,
    CaretLeftOutlined,
    CaretDownOutlined,
} from '@ant-design/icons'

import {
    getUserCardListAjax,
    messageSubmitAjax,//私聊消息提交ajax
    getMsgListAjax,//获取用户间的私聊消息
    getUserInfoByIdAjax,//通过id获取userInfo
    noticeSubmitAjax,//notice提交ajax
    followAddAjax,//添加关注ajax
    followDelAjax,//删除某关注
    shieldAddAjax,//添加屏蔽
} from '../../../api/index'
import url from "../../../api/url"

import Card from '../../Card/card'

import './userdetail.css'

class UserDetail extends Component{

    state = {
        content:"",//textarea文本域内容
        userInfo:{},
        mode:"standard",//standard:标准模式，展示功能模块；chatroom:聊天模式，展示聊天框，cardlist:卡片模式，展示历史卡片
        userCardlist:[],//存放用户历史卡片
    }

    componentDidMount(){
        this.props.onRef(this)//将自己整个this交给main组件
        this.props.getUserdetailThis(this)
        this.setState({userInfo:this.props.userInfo})//将main组件传递过来的数据转换为自身的state
    }

    shouldComponentUpdate(nextProps,nextState){
        if(this.props.userInfo._id!=nextProps.userInfo._id){
            this.setState({userInfo:nextProps.userInfo,mode:"standard"})//将main组件传递过来的数据转换为自身的state
        }

        return true
    }

    //修改UI界面至chatroom模式
    chatroomMode = () => {
        this.props.updatePrivateMsgList([])//清除以下main组件的privateMsgList
        this.setState({mode:"chatroom"})
        //每次打开这个模式的时候是需要去数据库获取两人之间的对话
        let messageId = this.props.myUserInfo.userId+this.props.userInfo._id //messageId由fromUserID和toUserId组成，顺序随意，后台模糊判断
        getMsgListAjax({messageId})
            .then(async val => {
                if(val){
                    //两人有历史聊天记录
                    let {msgList} = val.data.data
                    let fromUserInfo = ""
                    let toUserInfo = ""
                    //分别获取fromUserInfo和toUserInfo
                    await getUserInfoByIdAjax(this.props.myUserInfo.userId)
                        .then(val => {
                            fromUserInfo = val.data.data
                        })
                        .catch(err => {
                            message.warning("获取用户信息错误")
                        })

                    await getUserInfoByIdAjax(this.props.userInfo._id)
                        .then(val => {
                            toUserInfo = val.data.data
                        })
                        .catch(err => {
                            message.warning("获取用户信息错误")
                        })
                    msgList.map((item,index) => {
                        item.fromUserInfo = fromUserInfo
                        item.toUserInfo = toUserInfo
                    })
                    this.props.updatePrivateMsgList(msgList)//此处发送方需要物理添加一下main组件中的privateMsgList
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    //修改UI界面至standard模式
    standardMode = () => {
        this.setState({mode:"standard"})
    }

    //修改UI界面至cardlist模式
    cardlistMode = () => {
        this.setState({userCardlist:[]})
        //在此之前触发getUserCardListAjax来获取该用户所发布过的卡片
        getUserCardListAjax({userId:this.state.userInfo._id})
            .then(val => {
                this.setState({userCardlist:val.data.data})
            })
            .catch(err => {
                console.log(err)
                message.warning("获取用户发布卡片列表错误")
            })
        this.setState({mode:"cardlist"})
    }

    //消息发送
    submit = async () => {

        //登入检查
        if(!(Object.keys(this.props.myUserInfo).length)){
            message.warning({content:"同学，尚未登入哦！"})
            // this.props.history.push("/login")
            return false
          }

        let toUserId = this.props.userInfo._id //目标id
        let socketId = ""
        let fromUserInfo = ""
        let toUserInfo = ""
        this.props.onlineList.map((item,index) => {
            if(item.userInfo.userId == toUserId) socketId = item.id
        })
        //分别获取fromUserInfo和toUserInfo
        await getUserInfoByIdAjax(this.props.myUserInfo.userId)
            .then(val => {
                fromUserInfo = val.data.data
            })
            .catch(err => {
                message.warning("获取用户信息错误")
            })

        await getUserInfoByIdAjax(this.props.userInfo._id)
            .then(val => {
                toUserInfo = val.data.data
            })
            .catch(err => {
                message.warning("获取用户信息错误")
            })

        if(socketId){//当该用户在线时发送websocket事件
            let data = {
                content:this.state.content,
                to:socketId,
                userInfo:this.props.userInfo,
                fromUserInfo,
                toUserInfo,
            }
            this.props.socket.emit("privateMsg",data)

            let privateMsgList = JSON.parse(JSON.stringify(this.props.privateMsgList))
            privateMsgList.push(data)
            
            this.props.updatePrivateMsgList(privateMsgList)//此处发送方需要物理添加一下main组件中的privateMsgList
            
        }else{
            //当该用户不在线时
            // alert("!")
            let data = {
                content:this.state.content,
                to:socketId,
                userInfo:this.props.userInfo,
                fromUserInfo,
                toUserInfo,
            }
            let privateMsgList = JSON.parse(JSON.stringify(this.props.privateMsgList))
            privateMsgList.push(data)
            
                    
            // 这里应该触发消息通知
            let data2 = {
                type:"message",
                info:"一封新消息",
                read:false,
                fromUserInfo,
                toUserInfo
            }
            let obj = {
                data:data2,
                userId:this.props.userInfo._id
            }
            //触发header组件更新其noticeList函数(该函数来源过程 header --> main --> userdetial)
            // this.props.updateNoticeList(obj)

            // 这里应该去将obj存入noticeModel
            noticeSubmitAjax(obj)
            .then(val => {
                console.log(val)
            })
            .catch(err => {
                console.log(err)
                message.warning("保存错误")
            })

            this.props.updatePrivateMsgList(privateMsgList)//此处发送方需要物理添加一下main组件中的privateMsgList
        }

        //不管在不在线消息保存至数据库
        let data = {
            fromUserId:this.props.myUserInfo.userId,
            toUserId:this.props.userInfo._id,
            content:this.state.content,
        }
        //私聊消息提交ajax
        messageSubmitAjax(data)
            .then(val => {
                // console.log(val)
            })
            .catch(err => {
                message.warning("发送错误")
                console.log(err)
            })

        //清空content
        this.setState({content:""})

    }

    //文本域change函数
    textareaChange = (e) => {
        this.setState({content:e.target.value})
    }

    //添加关注函数
    addFollow = () => {
        //登入检查
        if(!(Object.keys(this.props.myUserInfo).length)){
            message.warning({content:"同学，尚未登入哦！"})
            // this.props.history.push("/login")
            return false
            }

        let data = {
            followedUserId:this.props.userInfo._id,
            userId:this.props.myUserInfo.userId
        }

        //触发ajax
        followAddAjax(data)
            .then(val => {
                if(val.data.code == 200){
                    message.success("关注成功！")
                    //触发来自main组件的followList更新函数
                    this.props.followListUpdate(this.props.userInfo._id)
                }
            })
            .catch(err => {
                message.warning("关注用户错误")
                console.log(err)
            })
    }

    //取消关注函数
    delFollow = () => {
        let data = {
            followedUserId:this.props.userInfo._id,
            userId:this.props.myUserInfo.userId
        }

        //触发ajax
        followDelAjax(data)
        .then(val => {
            if(val.data.code == 200){
                message.success("取消关注成功！")
                //触发来自main组件的followList更新函数
                this.props.followListUpdate(this.props.userInfo._id)
            }
        })
        .catch(err => {
            message.warning("关注用户错误")
            console.log(err)
        })
    }

    //添加屏蔽函数
    addShield = () => {
        //登入检查
        if(!(Object.keys(this.props.myUserInfo).length)){
            message.warning({content:"同学，尚未登入哦！"})
            // this.props.history.push("/login")
            return false
            }
        
        let data = {
            shieldedUserId:this.props.userInfo._id,
            userId:this.props.myUserInfo.userId
        }

        //触发ajax
        shieldAddAjax(data)
        .then(val => {
            if(val.data.code == 200){
                message.success("屏蔽成功！")
                //触发来自main组件的followList更新函数
                // this.props.followListUpdate(this.props.userInfo._id)
            }
        })
        .catch(err => {
            message.warning("屏蔽用户错误")
            console.log(err)
        })
    }
    render(){
        const { TextArea } = Input;
        return(
            <div className={`userdetail userdetail-${this.state.mode}-mode`} >
                {
                    this.state.mode == 'standard'
                    ?
                    <div className= {`userdetail-box-1 userdetail-box-1-${this.state.mode}-mode`}>
                    <img src={`${url}/${this.state.userInfo.avatar}`} alt=""/>
                        <p className="userdetail-nickname-box">{this.state.userInfo.nickname}</p>
                        <div className="userdetail-tag-box">
                            {
                                this.state.userInfo.tags
                                ?
                                this.state.userInfo.tags.map((item,index) => {
                                    return(
                                        <span className="tag" key={index}>{item}</span>
                                    )
                                })
                                :
                                null
                            }
                        </div>
                    </div>
                    :
                    null
                }
                {
                    this.state.mode == 'standard'
                    ?
                    // 标准模式
                    <div className="userdetail-box-2 userdetail-box">
                        <div className="userdetail-box-2-box" onClick={this.chatroomMode}>
                            <CommentOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                            <p>发送私信</p>
                        </div>
                        <div className="userdetail-box-2-box" onClick={this.cardlistMode}>
                            <ProfileOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                            <p>历史卡片</p>
                        </div>
                            {
                                this.props.followList.includes(this.props.userInfo._id)
                                ?
                                //该用户在登入用户的关注列表中
                                <div className="userdetail-box-2-box" onClick={this.delFollow} style={{"backgroundColor":"#fddb3a"}}>
                                    <SmileOutlined style={{"color":"white"}} className="userdetail-box-2-box-icon"/>
                                    <p style={{"color":"white"}}>已关注</p>
                                </div>
                                :
                                <div className="userdetail-box-2-box" onClick={this.addFollow}>
                                    <SmileOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                                    <p>添加关注</p>
                                </div>
                            }
                    <Popconfirm placement="bottom" title="确定要屏蔽该用户？" onConfirm={this.addShield}  okText="Yes" cancelText="No">
                        <div className="userdetail-box-2-box">
                            <FrownOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                            <p>屏蔽用户</p>
                        </div>
                    </Popconfirm>
                    </div>
                    :
                    this.state.mode == 'chatroom'
                    ?
                    // 聊天模式
                    <div className="userdetail-chat-box">

                    <div className="userdetail-message-box">
                    <div className="userdetail-chat-box-box1">
                        与 <span>{this.props.userInfo.nickname}</span> 的聊天
                    </div>
                        

                       {
                           //列表渲染privateMsgList
                           this.props.privateMsgList.map((item,index) => {
                               if(item.fromUserId == this.state.userInfo._id){
                                   //他人的消息
                                   return(
                                        <div key={index} className="userdetail-chat-box-from">
                                            <img src={`${url}/${item.toUserInfo.avatar}`} alt=""/>
                                            <p>{item.content}</p> 
                                            <div>
                                            {/* <span>10:48AM</span> */}
                                            </div>
                                        </div>
                                   )
                               }else{
                                   //自己的消息
                                   return(
                                    <div key={index} className="userdetail-chat-box-to">
                                    <div>
                                        {/* <span>10:48AM</span> */}
                                        </div>
                                        <p>{item.content}</p> 
                                        <img src={`${url}/${item.fromUserInfo.avatar}`} alt=""/>
                                    </div>
                                   )
                               }
                           })
                       }
                       </div>

                    <div className="userdetail-chat-box-handle">
                        <TextArea onChange={this.textareaChange} value={this.state.content} placeholder="请输入内容" className="userdetail-chat-box-textarea" rows={2} />
                        <Button onClick={this.submit} className="userdetail-chat-box-submit" type="primary" shape="round">
                            发送        
                        </Button>
                    </div>

                    <Button onClick={this.standardMode} size="small" className="userdetail-chat-box-back" shape="circle" type="primary" icon={<CaretLeftOutlined />}/>
                </div> 
                    :
                    // 历史卡片模式
                    <div >
                        <div className="userdetail-card">
                        {/* <Card/> */}
                        {
                            this.state.userCardlist.map((item,index) => {
                                return(
                                    <Card 
                                    userdetailCardData={item}//标识该card组件是在userdetail中使用的
                                    showModal={this.props.showModal} //main组件-->userdetail组件-->card组件(实现userdetail中点击卡片详细不报错)
                                    showModal2={this.props.showModal2} //main组件-->userdetail组件-->card组件(实现userdetail的历史卡片中点击avatar出现userdetail)
                                    cardData={item}
                                    special2={true}
                                    userInfo={this.state.userInfo}
                                    />
                                )
                            })
                        }
                        </div>

                        {/* <div className="userdetail-card-load-more">
                            <Button size="small" shape="round" type="primary" icon={<CaretDownOutlined />}>
                            加载更多
                            </Button>
                        </div> */}

                        <Button onClick={this.standardMode} size="small" className="userdetail-chat-box-back2" shape="round" type="primary" icon={<CaretLeftOutlined />}>
                            返回
                        </Button> 
                    </div>
                }
                
                 {/* <div className="userdetail-chat-box">

                    <div className="userdetail-message-box">
                    <div className="userdetail-chat-box-box1">
                        与 tutu 的聊天
                    </div>
                        <div className="userdetail-chat-box-from">
                            <img src="http://www.tttjh.com.cn/imgs/avatar.jpg" alt=""/>
                            <p>Hello World</p> 
                            <div>
                            <span>10:48AM</span>
                            </div>
                        </div>

                        <div className="userdetail-chat-box-to">
                        <div>
                            <span>10:48AM</span>
                            </div>
                            <p>Hello World !</p>
                            <img src="http://www.tttjh.com.cn/imgs/girl.gif" alt=""/>
                        </div>
                        <div className="userdetail-chat-box-from">
                            <img src="http://www.tttjh.com.cn/imgs/avatar.jpg" alt=""/>
                            <p>Hello World</p> 
                            <div>
                            <span>10:48AM</span>
                            </div>
                        </div>
                        <div className="userdetail-chat-box-to">
                        <div>
                            <span>10:48AM</span>
                            </div>
                            <p>Hello World !</p>
                            <img src="http://www.tttjh.com.cn/imgs/girl.gif" alt=""/>
                        </div>
                        <div className="userdetail-chat-box-from">
                            <img src="http://www.tttjh.com.cn/imgs/avatar.jpg" alt=""/>
                            <p>Hello World</p> 
                            <div>
                            <span>10:48AM</span>
                            </div>
                        </div>
                        <div className="userdetail-chat-box-to">
                        <div>
                            <span>10:48AM</span>
                            </div>
                            <p>Hello World !</p>
                            <img src="http://www.tttjh.com.cn/imgs/girl.gif" alt=""/>
                        </div>
                        <div className="userdetail-chat-box-from">
                            <img src="http://www.tttjh.com.cn/imgs/avatar.jpg" alt=""/>
                            <p>Hello World</p> 
                            <div>
                            <span>10:48AM</span>
                            </div>
                        </div>

                        <div className="userdetail-chat-box-to">
                        <div>
                            <span>10:48AM</span>
                            </div>
                            <p>Hello World !</p>
                            <img src="http://www.tttjh.com.cn/imgs/girl.gif" alt=""/>
                        </div>
                        </div>

                    <div className="userdetail-chat-box-handle">
                        <TextArea placeholder="请输入内容" className="userdetail-chat-box-textarea" rows={2} />
                        <Button className="userdetail-chat-box-submit" type="primary" shape="round">
                            发送        
                        </Button>
                    </div>

                    <Button size="small" className="userdetail-chat-box-back" shape="circle" type="primary" icon={<CaretLeftOutlined />}/>
                </div>  */}


{/* 
                <div className="userdetail-card">
                    <Card/>
                </div>

                <div className="userdetail-card">
                    <Card/>
                </div>

                <div className="userdetail-card">
                    <Card/>
                </div>

                <div className="userdetail-card">
                    <Card/>
                </div>

                <div className="userdetail-card">
                    <Card/>
                </div>

                <div className="userdetail-card">
                    <Card/>
                </div>

                <div className="userdetail-card-load-more">
                    <Button size="small" shape="round" type="primary" icon={<CaretDownOutlined />}>
                    加载更多
                    </Button>
                </div>

                <Button size="small" className="userdetail-chat-box-back2" shape="round" type="primary" icon={<CaretLeftOutlined />}>
                    返回
                </Button> */}

            </div>
        )
    }
}

export default UserDetail