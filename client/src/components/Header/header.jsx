import React,{useState,Component} from 'react'
import {
    Popover,
    message,
} from 'antd'
import {
    BellOutlined,
    LikeOutlined,
    MessageOutlined,
    SmileTwoTone,
    HeartTwoTone,
    MessageTwoTone,
    MailTwoTone,
    CodeSandboxCircleFilled,
} from '@ant-design/icons'

import {
    noticeSubmitAjax,//通知消息提交ajax
    getNoticeListAjax,//根据userId获取其所属noticeList
    updateNoticeListReadAjax,//更新noticeList的read标志位
} from '../../api/index'

import './header.css'

class Header extends Component{
    
    componentDidMount(){
        this.props.onRef(this)
 
    }

    componentDidUpdate(prevProps, prevState){
        //因为main组件传递的userInfo是异步获取的数据，所以仔componentDidUpdate中确定this.porps.userInfo发生改变后然后使用userId获取noticeList
        if(Object.keys(prevProps.userInfo).length != Object.keys(this.props.userInfo).length){
        //在这里需要加载数据库中的noticeList
        getNoticeListAjax({userId:this.props.userInfo.userId})
            .then(val => {
                console.log(val)
                if(val.data.data){
                    //如果有其对应的notilist的话
                    this.setState({noticeList:val.data.data.noticeList})
                }
            })
            .catch(err => {
                message.warning("获取noticeList错误")
            })
        }
    }

    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
    }
    state = {
        noticeList:[],
        content:[],
        userInfo:{},
    }

    //通过notice打开userdetial中的chat模式
    openNotice = (index,e) => {
        //点击之后需要物理将noticeList的read置为true
        let _id = this.state.noticeList[index].fromUserInfo._id
        let noticeList = JSON.parse(JSON.stringify(this.state.noticeList))
        noticeList.map((item,index) => {
            if(item.fromUserInfo._id == _id){
                //来自同一个人
                item.read = true
            }
        })
        this.setState({noticeList})
        //调用来自父组件的showModal2函数,需要传递以下被指定用户的userInfo,这里携带一个特殊参数证明userdetial需要默认打开chatroom模式
        this.props.showModal2(this.state.noticeList[index].fromUserInfo,e,"chatroom")

        //准备数据
        let data = {
            index,
            userId:this.props.userInfo.userId,
            fromUserId:this.state.noticeList[index].fromUserInfo._id
        }

        //更新noticeList中read字段
        updateNoticeListReadAjax(data)  
            .then(val => {
                console.log(val)
            })
            .catch(err => {
                message.warning("更新错误")
            })
    }
    
    //更新state中的noticeList 需要传递给main组件    
    updateNoticeList = (data) => {
        alert("updateNoticeList!!!")
        //这里需要把noticeList存储进数据库
        console.log(data)
        noticeSubmitAjax(data)
            .then(val => {
                console.log(val)
            })
            .catch(err => {
                console.log(err)
                message.warning("保存错误")
            })
        let noticeList = JSON.parse(JSON.stringify(this.state.noticeList))
        noticeList.push(data.data)
        this.setState({noticeList})
    }

    //判断icon是否需要进行旋转
    rotate = () => {
        let result = false
        this.state.noticeList.map((item,index) => {
            if(item.read) result = true
        })
        return !result
    }

    render(){
        let content = (
            <div>
                {
                    // console.log(this.state.noticeList)
                }
                {
                    this.state.noticeList.map((item,index) => {
                        if(!item.read){//状态检查
                            return (
                                <p className="notice-list" onClick={(e) => this.openNotice(index,e)}> 
                                    <span>{item.type == 'like' ? <HeartTwoTone /> : <MailTwoTone />}</span> {item.info}
                                    {/* <img src={`http://localhost:3030/${item.fromUserInfo.avatar}`} alt=""/> */}
                                    {/* <span>{item.type == 'like' ? `${item.fromUserInfo.nickname} 赞同了您` : `${item.fromUserInfo.nickname} 发来了一则消息`}</span> */}
                                </p>
                            )
                        }
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
                                        <MailTwoTone  className={this.rotate() ? "notice-icon-rotate notice-icon" : "notice-icon"} />
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