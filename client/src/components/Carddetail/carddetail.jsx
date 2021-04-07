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
    cardCommentAjax,
    getCardCommentsAjax,
    getUserInfoByIdAjax,
} from '../../api/index'

import './carddetail.css'
import Card from '../Card/card'

class CardDetail extends Component{

    state = {
        content:"",//回复内容
        commentsList:[],
        commentsList2:[],
        done:false,
    }

    shouldComponentUpdate(){
        return true
    }

    componentDidMount(){
        this.setState({cardData:this.props.cardData})
        // this.getCommentsList() //获取评论列表
    }

    componentWillReceiveProps(){
        console.log(this.props)
        // this.getCommentsList() 
    }

    //获取评论列表函数
    // getCommentsList = () => {
    //     //获取评论列表
    //     getCardCommentsAjax({cardId:this.props.cardData._id})
    //         .then( val => {
    //              this.setState({commentsList:val.data.data.comments},  async () => {
    //                     let commentsList = JSON.parse(JSON.stringify(this.state.commentsList))
    //                     for(let i = 0;i < commentsList.length;i++){
    //                         await getUserInfoByIdAjax(commentsList[i].userId)
    //                         .then( val => {
    //                             commentsList[i].userInfo = val.data.data
    //                         })
    //                         .catch(err => {
    //                             message.warning("获取评论列表失败请重试!")
    //                         })
    //                     }
    //                     this.setState({commentsList2:commentsList},() => {
    //                         this.setState({done:true})
    //                     })
    //              })
    //         })
    //         .catch(err => {
    //             message.warning("获取评论列表失败请重试!")
    //         })
    // }

    //文本域的onChange函数
    textareaChange =  (e) => {
        this.setState({content:e.target.value})
    }  

    //评论提交函数-----来自main组件
    commentSubmit = () => {
        // let token = localStorage.getItem("token")
        // cardCommentAjax({content:this.state.content,cardId:this.props.cardData._id},token)
        //     .then(val => {
        //             message.success("评论成功！")
        //             this.setState({content:""})//清空content

        //             // 再次获取评论列表
        //                     //获取评论列表
        //             getCardCommentsAjax({cardId:this.props.cardData._id})
        //             .then(async val => {
        //                 let newComments = val.data.data.comments[val.data.data.comments.length-1]
        //                 let newUserInfo = ""
        //                 await getUserInfoByIdAjax(val.data.data.comments[val.data.data.comments.length-1].userId)
        //                     .then(val => {
        //                         newComments.userInfo = val.data.data
        //                     })
        //                     .catch(err => {
        //                         message.warning("获取评论列表失败请重试!")
        //                     })
        //                 let cardData = JSON.parse(JSON.stringify(this.state.cardData))
        //                 cardData.comments.push(newComments)
        //                 console.log(cardData)
        //                 console.log(newComments)
        //                 this.setState({cardData})
        //             })
        //             .catch(err => {
        //                 message.warning("获取评论列表失败请重试!")
        //             })
        //     })
        //     .catch(err => {
        //         message.warning("评论失败，请稍候重试!")
        //     })
        this.props.commentSubmit(this.state.content,this.props.cardData._id)
        this.setState({content:""})//清空content
    }

    render(){

        const { TextArea } = Input;

        if(this.props.cardData ){
            return(
                <div className="carddetail">
                    <h3>{this.props.test}</h3>
                    <Card userInfo={this.props.userInfo} special="special" cardData={this.props.cardData}/>
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
                                    return(
                                        <div className="carddetail-comment-box">
                                            <div className="carddetail-comment-box-left-box">
                                            <Tooltip title={item.userInfo.nickname} color="gold">
                                                            <img className="carddetail-comment-avatar" src={`http://localhost:3030/${item.userInfo.avatar}`} alt=""/>
                                             </Tooltip>  
                                            </div>
                                            <div className="carddetail-comment-box-right-box">
                                                <p className="carddetail-comment-content">
                                                    {item.content}
                                                </p>
                                                <Button className="carddetail-comment-btn1" size="small" shape="circle" icon={<LikeOutlined />} />
                                                <Button className="carddetail-comment-btn2" size="small" shape="circle" icon={<MessageOutlined />} />
                                            </div>
                                        </div>
                                    )
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
                            <TextArea rows={2} className="carddetail-comment-textarea" value={this.state.content} onChange={this.textareaChange}/>
                            <Button onClick={this.commentSubmit} className="carddetail-comment-btn"  shape="shape" type="primary" shape="round">回复</Button>
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