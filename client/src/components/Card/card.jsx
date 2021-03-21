import React,{Component} from 'react'
import { 
        Card,
        Avatar,
        Button,
        Modal,
        message,
} from 'antd';
import { EditOutlined, MessageOutlined, LikeOutlined } from '@ant-design/icons';
import {
  getUserInfoByIdAjax,
} from '../../api'
import "./card.css"

const { Meta } = Card;


class Mycard extends Component{
    state = {
      ModalVisible:false,
      largeImgUrl:"http://www.tttjh.com.cn/imgs/avatar.jpg",
      userInfo:{
        nickname:"",
        avatar:""
      },
    }
    componentDidMount(){
      console.log(this.props)
        getUserInfoByIdAjax(this.props.cardData.userId)
          .then(val => {
            this.setState({userInfo:val.data.data})
            console.log("------------------------")
            console.log(val)
          })
          .catch(err => {
            message.error("获取卡片发布者信息失败！请重试！")
          })
    }
    showModal = (e) => {
      console.log(e)
      console.log(e.target)
      this.setState({ModalVisible:true,largeImgUrl:e.target.src})
    };
  
    handleOk = () => {
      this.setState({ModalVisible:false})
    };
  
    handleCancel = () => {
      this.setState({ModalVisible:false})
    };
    render() {
      let {content,date,img,userId} = this.props.cardData
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

        <div id='cards' className='cards-wrapper'>
          {/* 图片放大显示的弹窗 */}
          <Modal title="" visible={this.state.ModalVisible} onCancel={this.handleCancel} footer={null} closable={false} >
            <img className="largeImg" src={this.state.largeImgUrl} alt=""/>
          </Modal>
          <div className='cards-container'>
                  <div className='post-card'>
                  <div className='card-tag'>
                      捞人卡  <MessageOutlined/>
                  </div>
                  <div className="card-content-img-Box">
                  <div className='post-content'>
                   {content}
                  </div>
                  {/* 卡片的图片渲染 */}
                  {
                    console.log(this.props)
                  }
                  {
                    img.length != 0
                    ?
                    <div className='post-img-Box'>
                    {
                      img.map((item,index) => {
                        return(
                          <div   className='post-img-box'>
                          <img src={`http://localhost:3030/${item}`} alt="" onClick={this.showModal}/>
                          </div>
                        )
                      })
                    }
                  </div>
                  :
                  null
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
                      <div className="post-handle" ><MessageOutlined/>&nbsp;<span>48</span></div>
                      <div className="post-handle" ><MessageOutlined/>&nbsp;<span>48</span></div>
                      <div className="post-handle" ><MessageOutlined/>&nbsp;<span>88</span></div>
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
          </div>
        </div>
  
        )
    }
}

export default Mycard