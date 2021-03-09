import React,{Component} from 'react'
import {
    message,
} from 'antd'

import Userbox from '../Userbox/userbox'
import Card from '../Card/card'
import RecommendCard from '../Recommendcard/recommendcard'
import Textarea from '../Textarea/textarea'

import "./main.css"

class Main extends Component{
    state = {
     userInfo:{},
     cardList:[]
    }
    componentDidMount(){

    }

    render() {
        return (
            <div className="main clearfix">
                <div className="main-container">
                    <div className="main-left-box">
                      <Userbox history={this.props.history}/>
                      <div className="recommend-box">
                        <p className="recommend-box-title">Classmate:</p>
                        {
                            new Array(1,2,3,4,5,6,7,8).map((item,index) => {
                                return <RecommendCard key={index}/>
                            })
                        }
                      </div>
                    </div>
                   
                    <div className="main-card-box">
                        <p className="main-card-box-textarea-title">Textarea:</p>
                        <Textarea
                            mainGetCard={this.mainGetCard}
                        />
                        {/* <div className="card-box"> */}
                        <p className="main-card-box-title">Card:</p>
                        {
                            new Array(1,2,3,4,5,6,7,8,9,10).map((item,index) => {
                                return (
                                    <Card key={index}/>
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