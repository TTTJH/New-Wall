import React,{Component} from 'react'
import {
    message,
    Button,
} from 'antd'
import {
    DownCircleOutlined,
    } from '@ant-design/icons';
import Userbox from '../Userbox/userbox'
import Card from '../Card/card'
import RecommendCard from '../Recommendcard/recommendcard'
import Textarea from '../Textarea/textarea'
import UserDetail from '../User/UserDetail/userdetail'
import CardDetail from '../Carddetail/carddetail'
import {
    getCardListAjax,
} from '../../api/index'

import "./main.css"
import { Switch } from 'react-router'

class Main extends Component{
    state = {
     userInfo:{},
     cardList:[],
     cardHeight:[],
     cardList2:[],
    }
    componentDidMount(){
        //首次调用getCardListAjax
        getCardListAjax(1)
            .then(val => {
                this.setState({cardList:val.data.data},() => {
                    let imgs = document.querySelectorAll(".post-card img")
                    //注意的一个问题就是在card内的图片尚未加载完毕的时候，
                    //card的clientHeight是不包括img的高度的，
                    //所以我在一批card的img加载完毕后再获取其高度，累加计算目前的top值。
                    let promiseArr = []
                    // 这里将每张图片加载完毕生成Promise对象，最后使用Promise.all方法统一进行结果代码执行。
                    Array.from(imgs).map((item,index) => {
                        let promise = new Promise((resolve,reject) => {
                            item.addEventListener("load",() => {
                                resolve("done")
                            })
                            item.addEventListener("error",() => {
                                reject("error")
                            })
                        })
                        promiseArr.push(promise)
                    })

                    Promise.all(promiseArr)
                        .then(() => {
                            let cards = document.querySelectorAll(".main-card-inner-box .post-card")
                            let btns = document.querySelectorAll(".more-card-btn")
                            let {cardList} = this.state
                            let topNum1 = 0
                            let topNum2 = 0
                            let topNum3 = 0
                            Array.from(cards).map((item,index) => {
                                // let targetIndex = index + 3
                                // cardList[index].left = (index%3)*320          
                                // if(cardList[targetIndex]){
                                //     switch(index%3){
                                //         case 0:{
                                //             cardList[targetIndex].top = cards[index].clientHeight + topNum1 + 20
                                //             topNum1 +=  cards[index].clientHeight +20
                                //             break
                                //         }
                                //         case 1:{
                                //             cardList[targetIndex].top = cards[index].clientHeight + topNum2 +15
                                //             topNum2 +=  cards[index].clientHeight +20
                                //             break
                                //         }
                                //         case 2:{
                                //             cardList[targetIndex].top = cards[index].clientHeight + topNum3 +20
                                //             topNum3 +=  cards[index].clientHeight +20
                                //             break
                                //         }
                                //     }
                                                              
                                // }
                                cardList[index].left = (index%3)*320 
                                        switch(index%3){
                                        case 0:{
                                            cardList[index].top = topNum1 + 20
                                            topNum1 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 1:{
                                            cardList[index].top = topNum2 + 20
                                            topNum2 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 2:{
                                            cardList[index].top = topNum3 + 20
                                            topNum3 +=  cards[index].clientHeight +20
                                            break
                                        }
                                    }
                            })
                                btns[0].style.top = topNum1 + 20 + "px"
                                btns[1].style.top = topNum2 + 20 + "px"
                                btns[2].style.top = topNum3 + 20 + "px"
                               Array.from(btns).map((item,index) => {
                                   item.style.left = (index%3)*321 + "px"
                               })
                            this.setState({cardList})
                        })
                        .catch((err) => {
                            message.warning("某图片加载失败，将影响瀑布流布局")
                        })
                })
            })
            .catch(err => {
                message.error("获取卡片列表失败请重试")
            })
    }
    getCardHeight = (index,height) => {
        console.log(index)
        console.log(height)
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
                  
                  <div className="main-right-box">

                   <div className="main-textarea-box">
                   <p className="main-card-box-textarea-title">Textarea:</p>
                        <Textarea
                            mainGetCard={this.mainGetCard}
                        />
                   </div>

                    {/* 卡片详细模块 */}
                   <div className="main-carddetail-box">
                                <p className="carddetail-box-title">CardDetail:</p>
                                <CardDetail cardData={this.state.cardList[0]}/>
                   </div>

                    {/* 用户详细模块 */}
                   <div className="userdetail-box">
                                <p className="userdetail-box-title">UserDetail:</p>
                                <UserDetail/>
                   </div>

                    <div className="main-card-box">
                            
                        {/* <div className="card-box"> */}
                        <p className="main-card-box-title">Card:</p>
                        {/* {
                            new Array(1,2,3,4,5,6,7,8,9,10).map((item,index) => {
                                return (
                                    <Card key={index}/>
                                )
                            })
                        } */}
                        <div className="main-card-inner-box clearfix" >
                            {
                                this.state.cardList.map((item,index) => {
                                    return(
                                        <Card getCardHeight={this.getCardHeight}  key={index} cardData={item} index={index}/>
                                    )
                                })
                            }

                        {/* 加载更多的按钮 */}
                        <Button type="primary" className="more-card-btn">
                        <DownCircleOutlined />加载更多
                        </Button>
                        <Button type="primary" className="more-card-btn">
                        <DownCircleOutlined />加载更多
                        </Button>
                        <Button type="primary" className="more-card-btn">
                        <DownCircleOutlined />加载更多
                        </Button>
                        </div>
                        

                        {/* </div> */}
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default Main