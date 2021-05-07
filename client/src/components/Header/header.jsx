import React,{useState,Component} from 'react'
import {
    Popover,
} from 'antd'
import {
    BellOutlined,
    LikeOutlined,
    MessageOutlined,
    SmileTwoTone,
    HeartTwoTone,
    MessageTwoTone,
    MailTwoTone,
} from '@ant-design/icons'

import './header.css'

class Header extends Component{
    componentDidMount(){
        this.props.onRef(this)
    }
    state = {
        noticeList:[],
        content:[]
    }

    //更新state中的noticeList 需要传递给main组件    
    updateNoticeList = (data) => {
        let noticeList = JSON.parse(JSON.stringify(this.state.noticeList))
        noticeList.push(data)
        this.setState({noticeList})
    }

    render(){
        let content = (
            <div>
                {
                    this.state.noticeList.map((item,index) => {
                        return (
                            <p> 
                                <span>{item.type == 'like' ? <HeartTwoTone /> : <MailTwoTone />}</span> {item.info}
                            </p>
                        )
                    })
                }
            </div>           
        )
        return (
            <div className="header">
                <div className="yellow-header"></div>
                <div className="main-header">
                        <div className="web-title">
                        {/* <img className="logo" src="logo.png" alt=""/> */}
                        <span className="title">My Wall</span>
                        </div>
                        <ul className="main-header-item">
                                <li >
                                    <Popover overlayClassName="header-popover" placement="bottom" title={<p>消息通知</p>} content={content} trigger="hover">
                                        <MailTwoTone  className={this.state.noticeList.length ? "notice-icon-rotate notice-icon" : "notice-icon"} />
                                    </Popover>
                                </li>
                            <li>item2</li>
                            <li>item3</li> 
                        </ul>
                </div>
            </div>
        )
    }
}

export default Header