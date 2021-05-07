import React,{Component} from 'react'
import {
    Tooltip,
    Button,
    Input,
    message,
} from "antd"
import {
    LikeOutlined,
    SendOutlined,
    MessageOutlined,
} from '@ant-design/icons'

import {
    cardCommentAjax,//卡片评论ajax
    getCardCommentsAjax,//获取卡片评论ajax
    getUserInfoByIdAjax,//获取用户信息ajax
    cardCommentLikeAjax,//卡片评论点赞ajax
} from '../../api/index'

import './carddetail.css'
import Card from '../Card/card'

class CardDetail extends Component{

    state = {
        content:"",//回复内容
        commentsList:[],
        commentsList2:[],
        done:false,
        toUserId:"",
        commentStatus:true,//回复模式,true为评论模式，false为评论直接的回复模式
    }

    componentDidMount(){
        this.setState({cardData:this.props.cardData})
    }

    //文本域的onChange函数
    textareaChange =  (e) => {

        this.setState({content:e.target.value})
    }  

    //文本域的键盘输入函数
    textareaKeyDown = (e) => {
        //通过键盘输入和value判断用户是否进行了取消回复
        if((e.keyCode == 8 || e.keyCode == 46) && !this.state.content){
            //需要进行回复取消
            this.setState({commentStatus:true})
        }
    }
    
    //评论提交函数-----来自main组件
    commentSubmit = () => {
        //登入检查
        if(!this.props.loginCheck()){
            message.warning("同学，尚未登入哦！")
            return false
        }
        this.props.commentSubmit(this.state.content,this.props.cardData._id)
        this.setState({content:""})//清空content
    }

    //评论点赞函数------来自main组件
    commentLike = (commentIndex) => {
        //登入检查
        if(!this.props.loginCheck()){
            message.warning("同学，尚未登入哦！")
            return false
        }
        this.props.cardCommentLike(this.props.cardData._id,commentIndex)
    }

    //评论取消点赞函数------来自main组件
    commentDelLike = (commentIndex) => {
        this.props.cardCommentDisLike(this.props.cardData._id,commentIndex)
    }

    //评论回复函数------来自main组件
    commentReply = () => {
        //登入检查
      if(!this.props.loginCheck()){
        message.warning("同学，尚未登入哦！")
        return false
      }
        this.props.cardCommentReply(this.props.cardData._id,this.state.content,this.state.toUserId)
        this.setState({content:"",commentStatus:true})//清空content
    }

    //回复对象选择函数
    toUserIdChange = (index) => {
        //登入检查
      if(!this.props.loginCheck()){
        message.warning("同学，尚未登入哦！")
        return false
      }
      
        let toUserId = this.props.cardData.comments[index].userId
        let toUserNickname = this.props.cardData.comments[index].userInfo.nickname
        this.setState({toUserId,toUserNickname,commentStatus:false})
    }
    
    render(){

        const { TextArea } = Input;

        if(this.props.cardData ){
            return(
                <div className="carddetail">
                    <h3>{this.props.test}</h3>
                    <Card 
                        banShowModal={true}//用于标识目前是在carddetail中，showModal无效
                        userInfo={this.props.userInfo}
                        special="special"
                        cardData={this.props.cardData}
                        showModal={this.props.showModal} //main组件-->carddetail组件-->card组件(实现carddetail中点击卡片详细不报错)
                        showModal2={this.props.showModal2} //main组件-->carddetail组件-->card组件(实现carddetail中点击avatar出现userdetail)
                    />
                    <div className="carddetail-right-box">
                        <div className="carddetail-comment-Box">
                        <p className="carddetail-right-box-title">回复板:</p>

                        {/* <div className="carddetail-comment-box">
                            <div className="carddetail-comment-box-left-box">
                            <Tooltip title="tutu" color="gold">
                                <img className="carddetail-comment-avatar" src="http://localhost:3030/avatar2.jpg" alt=""/>
                            </Tooltip>
                            </div>
                            <div className="carddetail-comment-box-right-box">
                                <p className="carddetail-comment-content">
                                    哈喽哈喽！
                                </p>
                                <Button className="carddetail-comment-btn1" size="small" shape="circle" icon={<LikeOutlined />} />
                                <Button className="carddetail-comment-btn2" size="small" shape="circle" icon={<MessageOutlined />} />
                            </div>
                        </div> */}
                        {
                            this.props.cardData.comments.map((item,index) => {
                                    if(!item.toUserId){
                                        //该条评论为普通评论
                                        return(
                                            <div key={index} className="carddetail-comment-box">
                                                <div className="carddetail-comment-box-left-box">
                                                <Tooltip title={item.userInfo.nickname} color="gold">
                                                                <img className="carddetail-comment-avatar" src={`http://localhost:3030/${item.userInfo.avatar}`} alt=""/>
                                                 </Tooltip>  
                                                </div>
                                                <div className="carddetail-comment-box-right-box">
                                                    <p className="carddetail-comment-content">
                                                        {item.content}
                                                    </p>
                                                    {
                                                        //点赞检查
                                                        item.likes.includes(this.props.userInfo.userId)
                                                        ?
                                                        <Button onClick={() => this.commentDelLike(index)} className="carddetail-comment-btn2" type="primary"  size="small" shape="round" icon={< LikeOutlined/>} > {item.likes.length}</Button>
                                                        :
                                                        <Button onClick={() => this.commentLike(index)} className="carddetail-comment-btn2"  size="small" shape="round" icon={< LikeOutlined/>} > {item.likes.length}</Button>
                                                    }
                                                    <Button onClick={() => this.toUserIdChange(index)} className="carddetail-comment-btn1" size="small" shape="circle" icon={< MessageOutlined/>} />
                                                </div>
                                            </div>
                                        )
                                    }else{//该条评论为评论之间的回复
                                        return(
                                                <div key={index} className="carddetail-comment-box">
                                                    <div className="carddetail-comment-box-left-box">
                                                    <Tooltip title={item.userInfo.nickname} color="gold">
                                                         <img className="carddetail-comment-avatar" src={`http://localhost:3030/${item.userInfo.avatar}`} alt=""/>
                                                    </Tooltip>  
                                                    <Tooltip title={` ${item.userInfo.nickname} 回复 ${item.toUserInfo.nickname}`} color="gold">
                                                        <SendOutlined   className="carddetail-comment-talk-icon"/>
                                                    </Tooltip>
                                                    <Tooltip title={item.userInfo.nickname} color="gold">
                                                        <img className="carddetail-comment-avatar" src={`http://localhost:3030/${item.toUserInfo.avatar}`} alt=""/>
                                                    </Tooltip>
                                                    </div>
                                                    <div className="carddetail-comment-box-right-box">
                                                        <p className="carddetail-comment-content">
                                                            {item.content}
                                                        </p>
                                                        {
                                                            //点赞检查
                                                            item.likes.includes(this.props.userInfo.userId)
                                                            ?
                                                            <Button onClick={() => this.commentDelLike(index)} className="carddetail-comment-btn2" type="primary"  size="small" shape="round" icon={< LikeOutlined/>} > {item.likes.length}</Button>
                                                            :
                                                            <Button onClick={() => this.commentLike(index)} className="carddetail-comment-btn2"  size="small" shape="round" icon={< LikeOutlined/>} > {item.likes.length}</Button>
                                                        }
                                                        <Button onClick={() => this.toUserIdChange(index)} className="carddetail-comment-btn1" size="small" shape="circle" icon={< MessageOutlined/>} />
                                                    </div>
                                                </div>

                                        )

                                    }
                            })
                            
                        }
                        {/* <div className="carddetail-comment-box">
                            <div className="carddetail-comment-box-left-box2">
                            <Tooltip title="tutu" color="gold">
                                <img className="carddetail-comment-avatar" src="http://localhost:3030/avatar2.jpg" alt=""/>
                            </Tooltip>
                            <Tooltip title="tutu 回复 tttjh" color="gold">
                                <SendOutlined   className="carddetail-comment-talk-icon"/>
                            </Tooltip>
                            <Tooltip title="tttjh" color="gold">
                                <img className="carddetail-comment-avatar" src="http://localhost:3030/avatar3.jpg" alt=""/>
                            </Tooltip>
                            </div>
                            <div className="carddetail-comment-box-right-box">
                                <p className="carddetail-comment-content">
                                    我不同意你的观点!
                                </p>
                                <Button className="carddetail-comment-btn1" size="small" shape="circle" icon={<LikeOutlined />} />
                                <Button className="carddetail-comment-btn2" size="small" shape="circle" icon={<MessageOutlined />} />
                            </div>
                        </div> */}

                        </div>

                        <div className="carddetail-comment-input">
                            <TextArea onKeyDown={this.textareaKeyDown} placeholder={this.state.commentStatus ? "输入内容进行回复": `回复 ${this.state.toUserNickname} (退格键取消)`} rows={2} className="carddetail-comment-textarea" value={this.state.content} onChange={this.textareaChange}/>
                            {
                                //根据commentStatus不同的评论模式button绑定不同的提交事件
                                this.state.commentStatus
                                ?
                                <Button onClick={this.commentSubmit} className="carddetail-comment-btn"  shape="shape" type="primary" shape="round">回复</Button>
                                :
                                <Button onClick={this.commentReply} className="carddetail-comment-btn"  shape="shape" type="primary" shape="round">回复</Button>
                            }
                        </div>
                    </div>
                </div>
            )
        }else{
            return(
                <div className="carddetail">
                    
                </div>
            )
        }
    }
}

export default CardDetail