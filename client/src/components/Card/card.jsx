import React,{Component} from 'react'
import {withRouter,} from 'react-router-dom'
import { 
        Card,
        Avatar,
        Button,
        Modal,
        message,
        Skeleton,
} from 'antd';
import { EditOutlined,
         MessageOutlined, 
         PlusOutlined,
         HeartOutlined,
         RobotOutlined,
         ReadOutlined,
         LockOutlined,
         MehOutlined,
         QuestionCircleOutlined,
         SmileOutlined,
         CarOutlined,
         LikeOutlined,
         LaptopOutlined,
         FrownOutlined,
         DislikeOutlined,
         StarOutlined,
         FileOutlined,
         notification,
         } from '@ant-design/icons';
import {
  getUserInfoByIdAjax,
  cardLikeAjax,
  cardCheckLikeAjax,
  cardDelLikeAjax,
  getcardLikeCountAjax,
  noticeSubmitAjax,
  test,//notice提交ajax
} from '../../api'
import url from '../../api/url'
import "./card.css"
import "../../utils/animation.css"

const { Meta } = Card;

class Mycard extends Component{
    state = {
      top:"",
      left:"",
      ModalVisible:false,
      largeImgUrl:"http://www.tttjh.com.cn/imgs/avatar.jpg",
      userInfo:{
        nickname:"",
        avatar:""
      },
      likeChoose:false,//决定是否被点赞
      likesCount:'*',//点赞数量
      commentsCount:"*",//评论数量
      starsCount:"*",//收藏数量
      cardType:[
        <p><FileOutlined /> 普通卡</p>,
        <p><HeartOutlined /> 捞人卡</p>,
        <p><RobotOutlined /> 寻物卡</p>,
        <p><LockOutlined /> 心事卡</p>,
        <p><FrownOutlined /> 吐槽卡</p>,
        <p><QuestionCircleOutlined /> 提问卡</p>,
        <p><SmileOutlined /> 交友卡</p>,
        <p><CarOutlined /> 开黑卡</p>,
        <p><LikeOutlined /> 安利卡</p>,
        <p><LaptopOutlined /> 学习卡</p>,
        <p><MehOutlined /> 无聊卡</p>,
      ],
    }

    componentDidMount(){
      //将自身this传递给main组件
      // this.props.onCard(this)
      //根据props的userData获取userinfo放在render()渲染函数内部完成
      getUserInfoByIdAjax(this.props.cardData.userId)
          .then(val => {
            this.setState({userInfo:val.data.data})
          })
          .catch(err => {
            message.error("获取卡片发布者信息失败！请重试！")
          })
        if(this.props.userInfo){//用户已登入
          let token = localStorage.getItem("token")
          //触发点赞检查请求ajax来对this.state.likeChoose和likeCount进行初始化
          cardCheckLikeAjax({cardId:this.props.cardData._id},token)
            .then(val => {
              this.setState({likeChoose:val.data.data},() => {
                // console.log(this.state)
              })
            })
            .catch(err => {
              message.warn("获取点赞信息出现问题")
            })
        }

        //获取card的点赞数量、评论数量、star数量
        getcardLikeCountAjax({cardId:this.props.cardData._id})
          .then(val => {
            this.setState({likesCount:val.data.likesCount,commentsCount:val.data.commentsCount,starsCount:val.data.starsCount})
          })
          .catch(err => {
            message.warning("卡片点赞数量获取出现问题请稍候再试")
          })
    }

    shouldComponentUpdate(nextProps,nextState){
      //判断一下likeChoose有没有改变从而决定要不要重新发送请求。  
      if(nextState.likeChoose != this.state.likeChoose){
        if(this.props.userInfo){//用户已登入
          let token = localStorage.getItem("token")
          //触发点赞检查请求ajax来对this.state.likeChoose和likeCount进行初始化
          cardCheckLikeAjax({cardId:this.props.cardData._id},token)
            .then(val => {
              this.setState({likeChoose:val.data.data})
            })
            .catch(err => {
              message.warn("获取点赞信息出现问题")
            })
        }

        //获取card的点赞数量、评论数量、star数量
        getcardLikeCountAjax({cardId:this.props.cardData._id})
          .then(val => {
            // console.log(val)
            this.setState({likesCount:val.data.likesCount,commentsCount:val.data.commentsCount,starsCount:val.data.starsCount})
          })
          .catch(err => {
            message.warning("卡片点赞数量获取出现问题请稍候再试")
          })
      }else if(this.props.cardData.likeChoose != nextProps.cardData.likeChoose){
        this.setState({likeChoose:nextProps.cardData.likeChoose,likesCount:nextProps.cardData.likesCount,commentsCount:nextProps.cardData.commentsCount,starsCount:nextProps.cardData.starsCount})
      }

      //这里需要判断一下this.props.cardData.userId有没有发生改变进而更新card的state中的userInfo
      if(nextProps.cardData.userId != this.props.cardData.userId){
        //触发getUserInfo的ajax
        getUserInfoByIdAjax(nextProps.cardData.userId)
        .then(val => {
          this.setState({userInfo:val.data.data})
        })
        .catch(err => {
          message.error("获取卡片发布者信息失败！请重试！")
        })
      }
      return true
    }
    

    //放大卡片图片
    showModal = (e) => {
      //阻止事件冒泡
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      this.setState({ModalVisible:true,largeImgUrl:e.target.src})
    };
  
    handleOk = () => {
      this.setState({ModalVisible:false})
    };
  
    handleCancel = () => {
      this.setState({ModalVisible:false})
    };

    // //最后一张图片加载完毕执行父组件传递的getCardHeight函数
    // imgOnload = () => {
    //   let cards = document.querySelectorAll(".post-card")
    //   this.props.getCardHeight(this.props.index,cards[this.props.index].clientHeight)
    // }
  
    //card无图片直接执行父组件传递的getCardHeight函数
    cardOnload = () => {
      // let cards = document.querySelectorAll(".post-card")
      // if(cards[this.props.index]) {
      //   this.props.getCardHeight(this.props.index,cards[this.props.index].clientHeight)
      // }
    }

    //展示用户详细
    userInfoShow = (e) => {
        //阻止事件冒泡
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    //点赞数量更新函数,需要在main函数中调用
    // likesCountUpdate = () => {
    //   //执行一下该ajax更新likecount
    //   getcardLikeCountAjax({cardId:this.props.cardData._id})
    //   .then(val => {
    //     console.log(val)
    //     this.setState({likesCount:val.data.likesCount})
    //   })
    //   .catch(err => {
    //     message.warning("卡片点赞数量获取出现问题请稍候再试")
    //   })
    // }

    //点赞函数
    like = async (e) => {
        //阻止事件冒泡
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        //登入检查
        if(!(Object.keys(this.props.userInfo).length)){
          message.warning({content:"同学，尚未登入哦！"})
          this.props.history.push("/login")
          return false
        }

        //点赞反转
        this.setState({likeChoose:!this.state.likeChoose},async () => {
          let cardId = this.props.cardData._id //准备传递数据
          let token = localStorage.getItem("token") //获取token
          if(this.state.likeChoose){//进行了点赞
            //在carddetial中的点赞是需要main组件进行cardList更新的
            if(this.props.special){//carddetial判断
              this.props.cardListUpdate(1,this.props.index1,this.props.index2)
            }
            cardLikeAjax({cardId},token)
              .then(val => {
                //触发点赞检查请求ajax来对this.state.likeChoose和likeCount进行该改变
                cardCheckLikeAjax({cardId:this.props.cardData._id},token)
                .then(val => {
                  this.setState({likeChoose:val.data.data})

                  //执行一下该ajax更新likecount
                  getcardLikeCountAjax({cardId:this.props.cardData._id})
                  .then(val => {
                    this.setState({likesCount:val.data.likesCount})
                  })
                  .catch(err => {
                    message.warning("卡片点赞数量获取出现问题请稍候再试")
                  })

                })
                .catch(err => {
                  message.warn("获取点赞信息出现问题")
                })
              })
              .catch(err => {
                console.log(err)
              })
          }else{//取消了点赞
            //在carddetial中的点赞是需要main组件进行cardList更新的
            if(this.props.special){//carddetial判断
              this.props.cardListUpdate(0,this.props.index1,this.props.index2)
            }

            cardDelLikeAjax({cardId},token)
            .then(val => {
              //触发点赞检查请求ajax来对this.state.likeChoose和likeCount进行该改变
              cardCheckLikeAjax({cardId:this.props.cardData._id},token)
              .then(val => {
                this.setState({likeChoose:val.data.data})
                 //执行一下该ajax更新likecount
                 getcardLikeCountAjax({cardId:this.props.cardData._id})
                 .then(val => {
                   this.setState({likesCount:val.data.likesCount})
                 })
                 .catch(err => {
                   message.warning("卡片点赞数量获取出现问题请稍候再试")
                 })
              })
              .catch(err => {
                message.warn("获取点赞信息出现问题")
              })
            })
            .catch(err => {
              console.log(err)
            }) 
          }


          //以下是socket的like事件
          if(this.state.likeChoose){
                //进行了点赞
                //准备emit一个点赞事件
            let toUserId = this.props.cardData.userId
            let fromUserId = this.props.userInfo.userId
            let cardId = this.props.cardData._id
            let socketId = ""
            let toUserInfo = ""
            let fromUserInfo = ""

            //分别获取toUserInfo和fromUserInfo
            await getUserInfoByIdAjax(toUserId)
              .then(val => {
                toUserInfo = val.data.data
              })
              .catch(err => {
                message.warning("获取用户信息错误")
              })

            await getUserInfoByIdAjax(fromUserId)
            .then(val => {
              fromUserInfo = val.data.data
            })
            .catch(err => {
              message.warning("获取用户信息错误")
            })
            //判断是否在线
            this.props.onlineList.map((item,index) => {
              //如果onlineList中存在着目标用户的userId,证明目标用户目前在线
              if(item.userInfo.userId == toUserId){
                socketId = item.id
              }
            })

            if(socketId){
              //目标用户在线的情况
              //发送一个socket 的 like事件通知
              let data = {
                to:socketId,
                fromUserInfo,
                toUserInfo,
                cardId,
              }

              this.props.socket.emit("like",data)
            }else{
              //目标用户不在线的情况
              //目前无操作
            }

            //不管在不在线都需要将该条notice存储到数据库
            //obj的结构如下： 
            // let obj = {
            //   data:{
            //     type,
            //     info,
            //     read,
            //     fromUserInfo,
            //     toUserInfo
            //   },
            //   userId
            // }

            let data = {
              type:"like",
              info:"你收到了一个赞",
              read:false,
              fromUserInfo,
              toUserInfo,
              cardId
            }

            let obj = { 
              data,
              userId:toUserId
            }

            noticeSubmitAjax(obj)
            .then(val => {
                console.log(val)
            })
            .catch(err => {
                console.log(err)
                message.warning("保存错误")
            })

            //触发header组件更新其noticeList函数(该函数来源过程 header --> main --> userdetial)
            // this.props.updateNoticeList(obj)            
          }
        })
    }

    //触发main组件传递的ShowModol函数
    openCardDetail = () => {
        if(this.props.banShowModal){
          return null
        }
        this.props.userdetailCardData
        ?
        this.props.showModal(null,null,this.props.userdetailCardData)//表明该情况是userdetail中使用获取carddetail
        :
        this.props.showModal(this.props.index1,this.props.index2)//表明该情况是main中获取carddetail
    }
    render() {
          
          let {content,date,img,userId,type,top,left,preItemHeight,preHeightestHeight} = this.props.cardData

          let style = () => {
            let result
            if(this.props.standard){
              result = {"transform":`translateY(-${preHeightestHeight-top}px)`}
            }
            if(this.props.follow){
              result.boxShadow = "0 0 30px #fcf876"
              result.border = "1px solid #fcf876"
              // result.backgroundImage = "linear-gradient(to top, #e14fad 0%, #f9d423 100%)"
            }

            return result
          }

          return (
          <React.Fragment>
          {/* <div className='cards-wrapper'> */}
            {/* 图片放大显示的弹窗 */}
            <Modal title="" visible={this.state.ModalVisible} onCancel={this.handleCancel} footer={null} closable={false} >
              <img className="largeImg" src={this.state.largeImgUrl} alt=""/>
            </Modal>
            {/* <div className='cards-container'> */}
            {/* <div onClick={this.openCardDetail} className={this.props.special ? "post-card special-post-card" : this.props.special2 ? "post-card special2-post-card" : this.props.allImgLoadDone ? "post-card" : "post-card-loading"} style={{"left":left,"top":top}}> */}
            <div onClick={this.openCardDetail}
                 className={this.props.special
                  ? "post-card special-post-card animation" 
                  : this.props.special2
                  ? "post-card special2-post-card animation"
                  : this.props.allImgLoadDone
                  ? "post-card-loading animation"
                  : "post-card-loading animation"}
                  test={preHeightestHeight-top}
                  style={style()} 
            >
                    <div className='card-tag'>
                      {this.state.cardType[type]}
                    </div>
                    <div className="card-content-img-Box">
                    <div className='post-content'>
                     {content}
                    </div>
                    {/* 卡片的图片渲染 */}
                    {
                      img.length != 0 && userId 
                      ?
                      <div className='post-img-Box'>
                      {
                        img.map((item,index) => {
                          return(
                            <div key={index}  className='post-img-box'>
                            <img  src={`${url}/${item}`} alt="" onClick={this.showModal}/>
                            </div>
                          )
                        })
                      }
                    </div>
                    :
                    //当card没有图片的时候触发
                    this.cardOnload()
                    }
                    </div>
  
                    <div className='post-avatar-box' >
                            <div  className='post-avatar'>
                              {/* //需要将被点击的user的userInfo传递 */}
                            <img onClick={(e) => this.props.showModal2(this.state.userInfo,e)} src={`${url}/${this.state.userInfo.avatar}`} alt=""/>
                            </div>
                            <span onClick={(e) => this.props.showModal2(this.state.userInfo,e)} >{this.state.userInfo.nickname}</span>
                            <p className="card-date">{date}</p>
                    </div>
                    <div className='post-handles'>
                        <div className="post-handle" onClick={this.like} style={this.state.likeChoose ? {color:"#fddb3a"} : {}}><LikeOutlined className={this.state.likeChoose ? "like-icon-active" : ""} />&nbsp;<span>{this.state.likesCount}</span></div>
                        <div className="post-handle" ><MessageOutlined/>&nbsp;<span>{this.state.commentsCount}</span></div>
                        <div className="post-handle" ><StarOutlined />&nbsp;<span>{this.state.starsCount}</span></div>
                    </div>
                </div>
                {/* //     <div onClick={() => {this.toUser(item._id)}} key={index} className='cards-box'>
                //       <div className='cards-content'>
                //         <div className='cards-content-avatar'>
                //           <img src={item.avatarUrl} alt=""/>
                //         </div>
                //          <p className='cards-nickName'>{item.nickName}&nbsp;{item.sex === 'male' ?  <MyIcon type="icon-male" /> :  <MyIcon type="icon-female" />}</p> 
                //       </div>
                //       <div className='personal-info'>
                //       <div className="personal-info-box" >
                //         <p className='personal-info-num'>{item.cards ? item.cards.length : 0}</p>
                //         <p className='personal-info-txt'>关注</p>
                //       </div>
                //       <div className='personal-line'></div>
                //       <div className="personal-info-box ">
                //         <p className='personal-info-num'>5</p>
                //         <p className='personal-info-txt'>粉丝</p>
                //       </div>
                //       <div className='personal-line'></div>
                //       <div className="personal-info-box">
                //         <p className='personal-info-num'>5</p>
                //         <p className='personal-info-txt'>卡片</p>
                //       </div>
                //     </div>
                // </div>       */}
            {/* </div> */}
          {/* </div> */}
          </React.Fragment>
          )
    }
}

export default  withRouter(Mycard)