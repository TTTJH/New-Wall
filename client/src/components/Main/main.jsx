import React,{Component} from 'react'
import {
    message,
    Button,
    Modal,
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
     cardListIndex:1,//当前卡片列表的页数
     topNum1:0,
     topNum2:0,
     topNum3:0,
     userInfo:{},
     cardList:[[]],
     cardHeight:[],
     cardList2:[],
     modalVisible:false,
     modalVisible2:false,
     chooseCardIndex1:0,//用来标识当前是哪个cardList项
     chooseCardIndex2:0,//用来标识当前是哪个cardList项的哪个项
    }
    componentDidMount(){
        //首次调用getCardListAjax
        getCardListAjax(1)
            .then(val => {
                this.setState({cardList:[val.data.data]},() => {
                    let imgs = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card img`)
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
                            let cards = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card`)
                            let btns = document.querySelectorAll(".more-card-btn")
                            let {cardList} = this.state
                            let {topNum1,topNum2,topNum3} = this.state
                            Array.from(cards).map((item,index) => {
                                    let cardListItem = cardList[this.state.cardListIndex-1] //获取到cardList的一项
                                    console.log(cardListItem)
                                    cardListItem[index].left = (index%3)*320 
                                    switch(index%3){
                                        case 0:{
                                            cardListItem[index].top = topNum1 + 20
                                            topNum1 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 1:{
                                            cardListItem[index].top = topNum2 + 20
                                            topNum2 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 2:{
                                            cardListItem[index].top = topNum3 + 20
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
                            this.setState({cardList,topNum1,topNum2,topNum3})
                        })
                        .catch((err) => {
                            console.log(err)
                            message.warning("某图片加载失败，将影响瀑布流布局")
                        })
                })
            })
            .catch(err => {
                message.error("获取卡片列表失败请重试")
            })
    }

    //通过userbox组件调用该函数传递userbox组件获得的userinfo
    getUserInfoFromUserBox = (userInfo) => {
        this.setState({userInfo})//userInfo用于传递给card组件，card组件通过userid来判断是否点赞过
    }

    getCardHeight = (index,height) => {
        console.log(index)
        console.log(height)
    }

    //carddetail model使用函数
    showModal = (cardIndex1,cardIndex2) => {
        this.setState({modalVisible:true,chooseCardIndex1:cardIndex1,chooseCardIndex2:cardIndex2})
    };
    
    //carddetail model使用函数
    handleOk = () => {
        this.setState({modalVisible:false})
      };
    
    //carddetail model使用函数
    handleCancel = () => {
        this.setState({modalVisible:false})
      };

    //useretail model使用函数
    showModal2 = (e) => {
        //阻止事件冒泡
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({modalVisible2:true})
      };
    
    //userdetail model使用函数
    handleOk2 = () => {
        this.setState({modalVisible2:false})
      };
    
    //userdetail model使用函数
    handleCancel2 = () => {
        this.setState({modalVisible2:false})
      };

    //加载更多函数
    loadMore = () => {
        let objectCardListIndex = this.state.cardListIndex + 1  //目标cardlist页数
        //调用获取cardList的函数
        getCardListAjax(objectCardListIndex)
            .then(val => {
                let cardListItem = val.data.data
                let cardList = this.state.cardList
                cardList.push(cardListItem) //给cardList添加一个数组项，也就是新的一页的数据
                this.setState({cardList,cardListIndex:objectCardListIndex},() => {
                    let imgs = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card img`)
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
                            let cards = document.querySelectorAll(`.main-card-inner-box .cardListItem${this.state.cardListIndex} .post-card`)
                            console.log(cards)
                            let btns = document.querySelectorAll(".more-card-btn")
                            let {cardList} = this.state
                            let {topNum1,topNum2,topNum3} = this.state
                            Array.from(cards).map((item,index) => {

                                    let cardListItem = cardList[this.state.cardListIndex-1] //获取到cardList的一项
                                    console.log(cardListItem)
                                    cardListItem[index].left = (index%3)*320 
                                    switch(index%3){
                                        case 0:{
                                            cardListItem[index].top = topNum1 + 20
                                            topNum1 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 1:{
                                            cardListItem[index].top = topNum2 + 20
                                            topNum2 +=  cards[index].clientHeight +20
                                            break
                                        }
                                        case 2:{
                                            cardListItem[index].top = topNum3 + 20
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
                               this.setState({cardList,topNum1,topNum2,topNum3})
                        })
                        .catch((err) => {
                            console.log(err)
                            message.warning("某图片加载失败，将影响瀑布流布局")
                        })
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div className="main clearfix">
                <div className="main-container">

                    <div className="main-left-box">
                      <Userbox history={this.props.history} getUserInfoFromUserBox={this.getUserInfoFromUserBox}/>
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
                                this.state.cardList.map((item1,index1) => {
                                    return(
                                        <div className={`cardListItem${index1+1}`}>
                                            {
                                                item1.map((item2,index2) => {
                                                    return(
                                                        <Card  getCardHeight={this.getCardHeight} userInfo={this.state.userInfo} key={index2} cardData={item2} index1={index1}index2={index2} showModal={this.showModal} showModal2={this.showModal2}/>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                        {/* 加载更多的按钮 */}
                        <Button type="primary" className="more-card-btn" onClick={this.loadMore}>
                        <DownCircleOutlined />加载更多
                        </Button>
                        <Button type="primary" className="more-card-btn" onClick={this.loadMore}>
                        <DownCircleOutlined />加载更多
                        </Button>
                        <Button type="primary" className="more-card-btn" onClick={this.loadMore}>
                        <DownCircleOutlined />加载更多
                        </Button>
                        </div>
                        

                        {/* </div> */}
                    </div>
                </div>
                </div>

                {/* carddetail modal */}
                <Modal wrapClassName="cardDetailModal" footer={null} closable={false} visible={this.state.modalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    {/* 卡片详细模块 */}
                    <div className="main-carddetail-box">
                        {/* <p className="carddetail-box-title">CardDetail:</p> */}
                        <CardDetail cardData={this.state.cardList[this.state.chooseCardIndex1][this.state.chooseCardIndex2]}/>
                    </div>
                </Modal>

                {/* userdetail modal */}
                <Modal wrapClassName="userDetailModal" footer={null} closable={false} visible={this.state.modalVisible2} onOk={this.handleOk2} onCancel={this.handleCancel2}>
                    {/* 用户详细模块 */}
                   <div className="userdetail-box">
                                {/* <p className="userdetail-box-title">UserDetail:</p> */}
                                <UserDetail/>
                   </div>
                </Modal>
            </div>
        )
    }
}

export default Main