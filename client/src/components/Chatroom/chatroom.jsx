import React,{Component} from 'react'
import { io } from "socket.io-client"
import {
    Button,
    Input,
    message,
} from 'antd'
import {
    CaretLeftOutlined,
} from '@ant-design/icons'
import url from "../../api/url"


import './chatroom.css'

class Chatroom extends Component{
    state = {
        msgList:[],//消息列表，结构[{userInfo,content},{userInfo,content}]
        content:"",//文本框消息
        socket:"",//socket对象
    }

    //生命周期函数
    componentDidMount(){
        //登入检查
        // if(!this.props.loginCheck()){
        //     // message.warning("同学，尚未登入哦！")
        //     return false
        // }
    }

    //文本框双向绑定函数
    textareaChange = (e) => {
        this.setState({
            content:e.target.value
        })
    }

    //消息提交函数
    submit = () => {
        //登入检查
      if(!(Object.keys(this.props.userInfo).length)){
        message.warning("同学，尚未登入哦！")
        return false
      }
        let obj = {
            userInfo:this.props.userInfo,
            content:this.state.content
        }
        this.props.socket.emit("message",obj)//发送content
        this.setState({content:""})//清空content
    }
    render(){
        const { TextArea } = Input;
        return(
            <div className="chatroom">
                  <div className="chatroom-chat-box">
                    <div className="chatroom-message-box">
                        <div className="chatroom-chat-box-box1">
                            公共聊天室
                        </div>

                        {/* <div className="chatroom-chat-box-from">
                            <img src="http://www.tttjh.com.cn/imgs/avatar.jpg" alt=""/>
                            <p>Hello World</p> 
                            <div>
                            <span>10:48AM</span>
                            </div>
                        </div>

                        <div className="chatroom-chat-box-to">
                        <div>
                            <span>10:48AM</span>
                        </div>
                            <p>Hello World !</p>
                            <img src="http://www.tttjh.com.cn/imgs/girl.gif" alt=""/>
                        </div> */}
                        <p className="chatroom-tip-p">刷新后消息就会消失哦🙊</p>
                        {
                            //消息列表渲染
                            this.props.msgList.map((item,index) => {
                                if(item.userInfo.userId == this.props.userInfo.userId){
                                    //自己的发言
                                    return(
                                        <div className="chatroom-chat-box-to">
                                            <div>
                                                {/* <span>10:48AM</span> */}
                                            </div>
                                            <p>{item.content}</p>
                                            <img src={`${url}/${item.userInfo.avatar}`} alt=""/>
                                        </div>
                                    )
                                }else{
                                    //他人的发言
                                    return(
                                        <div className="chatroom-chat-box-from">
                                            <img onClick={(e) => this.props.showModal2(item.userInfo,e)} src={`${url}/${item.userInfo.avatar}`} alt=""/>
                                            <p>{item.content}</p> 
                                            <div>
                                            {/* <span>10:48AM</span> */}
                                            </div>
                                        </div>
                                    )
                                }
                            })

                        }

                    </div>

                    <div className="chatroom-chat-box-handle">
                        <TextArea onChange={this.textareaChange} value={this.state.content} placeholder="请输入内容" className="chatroom-chat-box-textarea" rows={2} />
                        <Button onClick={this.submit} className="chatroom-chat-box-submit" type="primary" shape="round">
                            发送        
                        </Button>
                    </div>

                    {/* <Button onClick={this.standardMode} size="small" className="chatroom-chat-box-back" shape="circle" type="primary" icon={<CaretLeftOutlined />}/> */}
                  </div>
            </div>
        )
    }
}

export default Chatroom