import React,{Component} from 'react'
import {
    Input,
    Button,
    message,

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
} from '../../../api/index'

import Card from '../../Card/card'

import './userdetail.css'

class UserDetail extends Component{

    state = {
        userInfo:{},
        mode:"standard",//standard:标准模式，展示功能模块；chatroom:聊天模式，展示聊天框，cardlist:卡片模式，展示历史卡片
        userCardlist:[],//存放用户历史卡片
    }

    componentDidMount(){
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
        this.setState({mode:"chatroom"})
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



    render(){
        const { TextArea } = Input;
        return(
            <div className={`userdetail userdetail-${this.state.mode}-mode`} >
                {
                    this.state.mode == 'standard'
                    ?
                    <div className= {`userdetail-box-1 userdetail-box-1-${this.state.mode}-mode`}>
                    <img src={`http://localhost:3030/${this.state.userInfo.avatar}`} alt=""/>
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
                        <div className="userdetail-box-2-box">
                            <SmileOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                            <p>添加关注</p>
                        </div>
                        <div className="userdetail-box-2-box">
                            <FrownOutlined style={{"color":"#fddb3a"}} className="userdetail-box-2-box-icon"/>
                            <p>屏蔽用户</p>
                        </div>
                    </div>
                    :
                    this.state.mode == 'chatroom'
                    ?
                    // 聊天模式
                    <div className="userdetail-chat-box">

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

                        <div className="userdetail-card-load-more">
                            <Button size="small" shape="round" type="primary" icon={<CaretDownOutlined />}>
                            加载更多
                            </Button>
                        </div>

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