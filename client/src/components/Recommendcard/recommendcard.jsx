import React,{Component} from 'react'
import {
    message,
} from 'antd'
import {
    getClassmateAjax,
} from '../../api/index'
import url from "../../api/url"

import './recommendcard.css'
import "../../utils/animation.css"


class Recommendcard extends Component{
    state = {
        classmateList:[],
    }
    componentDidMount(){
        //调用获取classmate列表接口
        getClassmateAjax()
            .then(val => {
                this.setState({
                    classmateList:val.data.data
                })
                // console.log(val)
            })
            .catch(err => {
                message.error("获取同学推荐列表失败请重试")
            })
    }
    render() {
        return (
            <div>
                {
                    this.state.classmateList.length != 0
                    ?
                    this.state.classmateList.map((item,index) => {
                        return (
                        <div className="recommend-card animation" key={item._id} onClick={(e) => this.props.showModal2(item,e)}>
                            <img src={`${url}/${item.avatar}`} alt=""/>
                            <div className="recommend-txt-box">
                                <p>{item.nickname}</p>
                                <div className="recommend-tag-box">
                                    {
                                        item.tags.length != 0
                                        ?
                                        item.tags.map((item,index) => {
                                            return(
                                                <span key={index} className="tag">{item}</span>
                                            )
                                        })
                                        :
                                        null
                                    }
                                    {/* <span className="tag">zzuli</span> */}
                                </div>
                            </div>
                        </div>
                        )
                    })
                    :
                    null
                }
            </div>
        )
    }
}

export default Recommendcard