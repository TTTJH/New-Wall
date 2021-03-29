import React,{Component} from 'react'
import {
    Tooltip,
    Button,
    Input,
} from "antd"
import {
    LikeOutlined,
    SendOutlined,
    MessageOutlined,
} from '@ant-design/icons'

import './carddetail.css'
import Card from '../Card/card'

class CardDetail extends Component{
    
    render(){
        const { TextArea } = Input;

        if(this.props.cardData){
            return(
                <div className="carddetail">
                    <Card special="special" cardData={this.props.cardData}/>
                    <div className="carddetail-right-box">
                        <div className="carddetail-comment-Box">

                        <p className="carddetail-right-box-title">回复板:</p>

                        <div className="carddetail-comment-box">
                            <div className="carddetail-comment-box-left-box">
                            <Tooltip title="tutu" color="gold">
                                <img className="carddetail-comment-avatar" src="http://localhost:3030/avatar3.jpg" alt=""/>
                            </Tooltip>
                            </div>
                            <div className="carddetail-comment-box-right-box">
                                <p className="carddetail-comment-content">
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                </p>
                                <Button className="carddetail-comment-btn1" size="small" shape="circle" icon={<LikeOutlined />} />
                                <Button className="carddetail-comment-btn2" size="small" shape="circle" icon={<MessageOutlined />} />
                            </div>
                        </div>

                        <div className="carddetail-comment-box">
                            <div className="carddetail-comment-box-left-box">
                            <Tooltip title="tutu" color="gold">
                                <img className="carddetail-comment-avatar" src="http://localhost:3030/avatar3.jpg" alt=""/>
                            </Tooltip>
                            </div>
                            <div className="carddetail-comment-box-right-box">
                                <p className="carddetail-comment-content">
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                </p>
                                <Button className="carddetail-comment-btn1" size="small" shape="circle" icon={<LikeOutlined />} />
                                <Button className="carddetail-comment-btn2" size="small" shape="circle" icon={<MessageOutlined />} />
                              
                            </div>
                        </div>
                        <div className="carddetail-comment-box">
                            <div className="carddetail-comment-box-left-box">
                            <Tooltip title="tutu" color="gold">
                                <img className="carddetail-comment-avatar" src="http://localhost:3030/avatar3.jpg" alt=""/>
                            </Tooltip>
                            </div>
                            <div className="carddetail-comment-box-right-box">
                                <p className="carddetail-comment-content">
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                    这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！这是第一条评论！！！
                                </p>
                                <Button className="carddetail-comment-btn1" size="small" shape="circle" icon={<LikeOutlined />} />
                                <Button className="carddetail-comment-btn2" size="small" shape="circle" icon={<MessageOutlined />} />
                            </div>
                        </div>


                        <div className="carddetail-comment-box">
                            <div className="carddetail-comment-box-left-box">
                            <Tooltip title="tutu" color="gold">
                                <img className="carddetail-comment-avatar" src="http://localhost:3030/avatar.jpg" alt=""/>
                            </Tooltip>
                            </div>
                            <div className="carddetail-comment-box-right-box">
                                <p className="carddetail-comment-content">
                                    接受安利！
                                </p>
                                <Button className="carddetail-comment-btn1" size="small" shape="circle" icon={<LikeOutlined />} />
                                <Button className="carddetail-comment-btn2" size="small" shape="circle" icon={<MessageOutlined />} />
                            </div>
                        </div>

                        <div className="carddetail-comment-box">
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
                        </div>
                    
                        <div className="carddetail-comment-box">
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
                        </div>
                        </div>
                        <div className="carddetail-comment-input">
                            <TextArea rows={2} className="carddetail-comment-textarea"/>
                            <Button className="carddetail-comment-btn"  shape="shape" type="primary" shape="round">回复</Button>
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