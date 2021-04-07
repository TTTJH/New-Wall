import React,{Component} from 'react'
import { 
        Card,
        Avatar,
        Button,
        Modal,
        message,
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
         } from '@ant-design/icons';
import {
  getUserInfoByIdAjax,
  cardLikeAjax,
  cardCheckLikeAjax,
  cardDelLikeAjax,
  getcardLikeCountAjax,
} from '../../api'
import "./card.css"

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
        <p><HeartOutlined /> 捞人卡</p>,
        <p><RobotOutlined /> 寻物卡</p>,
        <p><ReadOutlined /> 日记卡</p>,
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
              this.setState({likeChoose:val.data.data})
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

    //点赞函数
    like = (e) => {
        //阻止事件冒泡
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        //点赞反转
        this.setState({likeChoose:!this.state.likeChoose},() => {
          let cardId = this.props.cardData._id //准备传递数据
          let token = localStorage.getItem("token") //获取token
          if(this.state.likeChoose){//进行了点赞
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
        })
    }

    //触发main组件传递的ShowModol函数
    openCardDetail = () => {
      this.props.showModal(this.props.index1,this.props.index2)
    }
    render() {
      let {content,date,img,userId,type,top,left} = this.props.cardData

        return (
          //   <Card
            
          //   className="card"
          //   style={{ borderRadius:"10px",margin:"10px" }}
          //   cover={
          //     <img
          //       alt="example"
          //       // src={this.props.cardImgsArray ? this.props.cardImgsArray[0] : "http://www.tttjh.com.cn/imgs/aaa.png"}
          //       src="http://www.tttjh.com.cn/imgs/aaa.png"
          //     />
          //   }
          //   actions={[
          //   <span><LikeOutlined  key="likes"/>&nbsp;&nbsp;</span>,
          //   <span><MessageOutlined key="comments" />&nbsp;&nbsp;</span>,
          //   ]}
          // >
          //   <Meta
          //     avatar={<Avatar src="http://www.tttjh.com.cn/imgs/girl.gif" />}
          //     title="标题"
          //     description="描述"
          //   />
          // </Card>

        <React.Fragment>
        {/* <div className='cards-wrapper'> */}
          {/* 图片放大显示的弹窗 */}
          <Modal title="" visible={this.state.ModalVisible} onCancel={this.handleCancel} footer={null} closable={false} >
            <img className="largeImg" src={this.state.largeImgUrl} alt=""/>
          </Modal>
          {/* <div className='cards-container'> */}
                  <div onClick={this.openCardDetail} className={this.props.special ? "post-card special-post-card" : "post-card"} style={{"left":left,"top":top}}>
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
                          <div   className='post-img-box'>
                          <img  src={`http://localhost:3030/${item}`} alt="" onClick={this.showModal}/>
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

                  <div className='post-avatar-box' onClick={this.props.showModal2}>
                          <div className='post-avatar'>
                          <img src={`http://localhost:3030/${this.state.userInfo.avatar}`} alt=""/>
                          </div>
                          <span >{this.state.userInfo.nickname}</span>
                          <p className="card-date">{date}</p>
                  </div>
                  <div className='post-handles'>
                      <div className="post-handle" onClick={this.like} style={this.state.likeChoose ? {color:"#fddb3a"} : {}}><LikeOutlined />&nbsp;<span>{this.state.likesCount}</span></div>
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

export default Mycard