import React,{Component} from 'react'
import {
    Input,
    Button,

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

import Card from '../../Card/card'

import './userdetail.css'

class UserDetail extends Component{
    
    render(){
        const { TextArea } = Input;
        return(
            <div className="userdetail">
                <div className="userdetail-box-1">
                <img src="http://www.tttjh.com.cn/imgs/avatar.jpg" alt=""/>
                    <p className="userdetail-nickname-box">tutu</p>
                    <div className="userdetail-tag-box">
                        <span className="tag">te</span>
                        <span className="tag">test</span>
                        <span className="tag">te11st</span>
                        <span className="tag">test1</span>
                        <span className="tag">test</span>
                        <span className="tag">te1111st</span>
                    </div>
                </div>

                <div className="userdetail-box-2 userdetail-box">
                    <div className="userdetail-box-2-box">
                        <CommentOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                        <p>发送私信</p>
                    </div>
                    <div className="userdetail-box-2-box">
                        <ProfileOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                        <p>历史卡片</p>
                    </div>
                    <div className="userdetail-box-2-box">
                        <SmileOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                        <p>添加关注</p>
                    </div>
                    <div className="userdetail-box-2-box">
                        <FrownOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                        <p>屏蔽用户</p>
                    </div>
                </div>

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