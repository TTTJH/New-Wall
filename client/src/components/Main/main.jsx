import React,{Component} from 'react'
import {
    message,
} from 'antd'

import Userbox from '../Userbox/userbox'
import Card from '../Card/card'
import RecommendCard from '../Recommendcard/recommendcard'
import Textarea from '../Textarea/textarea'
import UserDetail from '../User/UserDetail/userdetail'
import {
    getCardListAjax,
} from '../../api/index'

import "./main.css"

class Main extends Component{
    state = {
     userInfo:{},
     cardList:[],
    }
    componentDidMount(){
        //首次调用getCardListAjax
        getCardListAjax(1)
            .then(val => {
                this.setState({cardList:val.data.data})
            })
            .catch(err => {
                message.error("获取卡片列表失败请重试")
            })
    }

    render() {
        return (
            <div className="main clearfix">
                <div className="main-container">

                    <div className="main-left-box">
                      <Userbox history={this.props.history}/>
                      <div className="recommend-box">
                        <p className="recommend-box-title">Classmate:</p>
                        <RecommendCard />
                      </div>
                    </div>
                   
                    <div className="main-card-box">
                            {/* <div className="userdetail-box">
                                <p className="userdetail-box-title">UserDetail:</p>
                                <UserDetail/>
                            </div> */}
                        <p className="main-card-box-textarea-title">Textarea:</p>
                        <Textarea
                            mainGetCard={this.mainGetCard}
                        />
                        {/* <div className="card-box"> */}
                        <p className="main-card-box-title">Card:</p>
                        {/* {
                            new Array(1,2,3,4,5,6,7,8,9,10).map((item,index) => {
                                return (
                                    <Card key={index}/>
                                )
                            })
                        } */}
                        {
                            this.state.cardList.map((item,index) => {
                                return(
                                    <Card key={index} cardData={item} />
                                )
                            })
                        }
                        {/* </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Main