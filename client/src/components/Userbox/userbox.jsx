import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
    message,
    Popover,
    Upload,
    Tooltip,
    Popconfirm,
    Input,
    Space,
    Button,

} from 'antd'
import ImgCrop from 'antd-img-crop';
import {
    PlusOutlined,
    QuestionOutlined,
    DeleteOutlined,
    CloseOutlined,
    CheckOutlined,
} from "@ant-design/icons"

import {
    getUserInfoAjax,
    getTagsAjax,
    tagHandleAjax,
} from '../../api/index'

import "./userbox.css"

class Userbox extends Component{
    constructor(props){
        super(props)
    }
    state = {
        userInfo:{
        },
        tagInputBoxClass:"",
        tagBoxClass:"",
        tagInputValue:"",
        userPopvers:[],
    }
    componentDidMount(){
        let token = localStorage.getItem("token")
        getUserInfoAjax(token)//获取用户信息接口
            .then(val => {
                if(val.data.code == 100){//token过期
                    message.warning("还未进行用户登入噢🙊")
                    // this.props.history.push("/login")
                }else{
                    this.setState({userInfo:val.data.data})//更新state
                }
            })
            .catch(err => {
                message.error("服务器宕机啦!请稍候再试")
            })
    }
    gotoLogin = () => {
        this.props.history.push("/login")
    }
    logoutConfirm = () => {
        //删除localStorage中存储的token
        localStorage.removeItem("token")
        //更新state中userInfo的状态
        this.setState({userInfo:{}})//清除userInfo
        message.success("退出成功")
    }
    uploadChange = (obj) => {
        //当上传完毕时
        if(obj.file.status == 'done'){
            message.success("头像更新成功")
            //需要再次调用getUserInfoAjax函数更新userInfo
            let token = localStorage.getItem("token")
            getUserInfoAjax(token)//获取用户信息接口
                .then(val => {
                    if(val.data.code == 100){//token过期
                        message.warning("还未进行用户登入噢🙊")
                        // this.props.history.push("/login")
                    }else{
                        console.log(val)
                        this.setState({userInfo:val.data.data})//更新state
                    }
                })
                .catch(err => {
                    message.error("服务器宕机啦!请稍候再试")
                })
        }
    }
    //开关tagInputBox显示状态
    tagInputBoxShow = () => {
        this.setState({tagInputBoxClass:"tag-input-box-show",tagBoxClass:"tag-box-down"})
    }
    tagInputBoxHidden = () => {
        this.setState({tagInputBoxClass:"tag-input-box-hidden",tagBoxClass:"tag-box-up",tagInputValue:""})
    }
    tagInputChange = (e) =>　{
        this.setState({tagInputValue:e.target.value})
    }
    tagInputBoxSubmit = () => {
        //触发添加tag的ajax
        tagHandleAjax({addTagValue:this.state.tagInputValue},localStorage.getItem("token"))
            .then(val => {
                message.success("添加成功！")
                //获取最新的userInfo
                let token = localStorage.getItem("token")
                getUserInfoAjax(token)//获取用户信息接口
                    .then(val => {
                        if(val.data.code == 100){//token过期
                            message.warning("还未进行用户登入噢🙊")
                            // this.props.history.push("/login")
                        }else{
                            console.log(val)
                            this.setState({userInfo:val.data.data})//更新state
                        }
                    })
                    .catch(err => {
                        message.error("服务器宕机啦!请稍候再试")
                    })
            })
            .catch(err => {
                message.error("添加失败，请稍候再试")
            })
        this.setState({tagInputBoxClass:"tag-input-box-hidden",tagBoxClass:"tag-box-up",tagInputValue:""})
    }

    tagDel = (index) => {
        //延时获取userPopover的dom，否则dom还未生成获取为null
        //注意这里的dom获取顺序问题
        setTimeout(() => {
            let userPopvers = document.querySelectorAll(".userbox-popover")
            console.log(userPopvers)
            if(userPopvers.length){
                this.setState({userPopvers})
                this.state.userPopvers[this.state.userPopvers.length-1].addEventListener("click",() => delHandle(index))
                let delHandle = (index) => {
                    //发起tag相关的ajax请求
                    let token = localStorage.getItem("token")
                    tagHandleAjax({delTagIndex:index},token)
                        .then(val => {
                            console.log(val)
                            message.success("删除tag成功")
                            //获取最新的userInfo
                            let token = localStorage.getItem("token")
                            getUserInfoAjax(token)//获取用户信息接口
                                .then(val => {
                                    if(val.data.code == 100){//token过期
                                        message.warning("还未进行用户登入噢🙊")
                                        // this.props.history.push("/login")
                                    }else{
                                        console.log(val)
                                        this.setState({userInfo:val.data.data})//更新state
                                    }
                                })
                                .catch(err => {
                                    message.error("服务器宕机啦!请稍候再试")
                                })
                        })
                        .catch(err => {
                            message.error("删除失败，请稍候再试")
                        })
                }
            }
        },500)
    }
     render() {
        const props = {
            name: 'file',
            action: 'http://localhost:3030/user/avatar',
            headers:{
                token:localStorage.getItem("token")//在上传图片的headers中添加token字段进行用户验证
            },
          };
        return (
            <div className="user-box">
            {
                Object.keys(this.state.userInfo).length
                ?
                <Popconfirm
                title="确定要退出该账户?"
                onConfirm={this.logoutConfirm}
                okText="Yes"
                cancelText="No"
                >
                <img className="exit-btn" src="exit.png" alt=""/>
                </Popconfirm>
                :
                null
            }
            
            <div className="user-avatar" >
                {
                    Object.keys(this.state.userInfo).length
                    ?
                    <ImgCrop rotate>
                        <Upload {...props}>
                            {this.state.userInfo.avatar}
                        </Upload>
                    </ImgCrop>
                    ?
                    <ImgCrop rotate>
                        <Upload {...props} onChange={this.uploadChange}>
                            <img className="user-avatar-img" src={"http://localhost:3030/"+this.state.userInfo.avatar} alt=""/>
                        </Upload>
                    </ImgCrop>
                    :
                    <ImgCrop rotate>
                        <Upload {...props} >
                            <p className="user-avatar-img-logo">
                                {this.state.userInfo.nickname ? this.state.userInfo.nickname.slice(0,1) : null}
                            </p>
                        </Upload>
                    </ImgCrop>
                    :
                    //未登入
                        <p className="default-avatar" onClick={this.gotoLogin}>
                            <QuestionOutlined />
                        </p>
                }
            </div>
            <p className="nickName">
                {this.state.userInfo.nickname}
            </p>
            <div  className={`tag-input-box ${this.state.tagInputBoxClass}`}>
                <Input id="tag-input" placeholder="输入标签" onChange={this.tagInputChange} value={this.state.tagInputValue}/>
                <div className="tag-input-btn-box">
                <Button type="primary" className="tag-input-btn-cancel" icon={<CloseOutlined />} onClick={this.tagInputBoxHidden}>
                </Button>
                <Button type="primary" className="tag-input-btn-submit" icon={<CheckOutlined />} onClick={this.tagInputBoxSubmit}>
                </Button>
                </div>
            </div>
            <div className={`user-tag-box ${this.state.tagBoxClass}`}>
            <Popover  
            overlayClassName="userbox-popover" 
            content={<DeleteOutlined />}
            color="red" 
            title="" >
                <span className="tag">🐷</span>
            </Popover>
            
            {
                Object.keys(this.state.userInfo).length
                ?
                this.state.userInfo.tags.map((item,index) => {
                    return (
                        <Popover  
                        key={index}
                        // mouseEnterDelay="0.5"
                        overlayClassName="userbox-popover" 
                        content={<DeleteOutlined />}
                        color="red" 
                        title="" >
                            <span onMouseEnter={() => this.tagDel(index)} className="tag">{item}</span>
                        </Popover>
                    )
                })
                :
                null
            }
                {/* <span className="tag">二次元</span>
                <span className="tag">zzuli</span>
                <span className="tag">萌新</span>
                <span className="tag">二次元</span>
                <span className="tag">zzuli</span>
                <span className="tag">萌新</span>
                <span className="tag">二次元</span>
                <span className="tag">zzuli</span> */}
                {/* <span className="tag tag-add-btn"><PlusOutlined /></span> */}
                <Button onClick={this.tagInputBoxShow} className="tag tag-add-btn" icon={<PlusOutlined />}>

                </Button>
            </div>
        </div>
        )
    }
}

//props验证
Userbox.propTypes = {
    userInfo:PropTypes.object
}


export default withRouter(Userbox)