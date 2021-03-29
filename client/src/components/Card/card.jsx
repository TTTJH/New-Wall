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
         } from '@ant-design/icons';
import {
  getUserInfoByIdAjax,
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
        getUserInfoByIdAjax(this.props.cardData.userId)
          .then(val => {
            this.setState({userInfo:val.data.data})
          })
          .catch(err => {
            message.error("获取卡片发布者信息失败！请重试！")
          })
        
          // if(this.props.cardData.userId && !this.props.cardData.img){
          //   let cards = document.querySelectorAll(".post-card")
          //   this.setState({top:cards[this.props.index].clientHeight,left:(this.props.index % 3) * 350})
          // }
    }
    showModal = (e) => {
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
                  <div className={this.props.special ? "post-card special-post-card" : "post-card"} style={{"left":left,"top":top}}>
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

                  <div className='post-avatar-box'>
                          <div className='post-avatar'>
                          <img src={`http://localhost:3030/${this.state.userInfo.avatar}`} alt=""/>
                          </div>
                          <span >{this.state.userInfo.nickname}</span>
                          <p className="card-date">{date}</p>
                  </div>
                  <div className='post-handles'>
                      <div className="post-handle" ><LikeOutlined />&nbsp;<span>48</span></div>
                      <div className="post-handle" ><MessageOutlined/>&nbsp;<span>48</span></div>
                      <div className="post-handle" ><DislikeOutlined />&nbsp;<span>88</span></div>
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