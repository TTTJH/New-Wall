import React,{Component} from 'react'
import Cookies from 'js-cookie'
import { 
        Input,
        Upload,
        Modal,
        Button,
        message,

       } from 'antd';

import { 
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
  FileOutlined,
  createFromIconfontCN,
 } from '@ant-design/icons';

import {
  cardSubmiAjax,
  cardDelUploadAjax,
} from '../../api/index'
import './textarea.css'

const { TextArea } = Input;
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

class Textarea extends Component{
    state = {
        cardId:"",//如果存在则表面上传过图片，数据库已经有card collection
        imgArr:[], //保存每次上传的图片名字
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        fileName:"",
        type:"",
        uploadUrl:"",
        img:"",
        url:"",
        content:"",
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
        cardTypeIndex:0,
      };

    componentDidMount(){
    }

    textareaChange = (e) => {
        this.setState({
            content:e.target.value
        })
    }
    submit = () => {
      //登入检查
      if(!this.props.loginCheck()){
        message.warning("同学，尚未登入哦！")
        return false
      }

      console.log(this.props.loginCheck())
      let token = localStorage.getItem("token")
      //提交card的contnet
      cardSubmiAjax({
          content:this.state.content,
          cardId:this.state.cardId,
          typeIndex:this.state.cardTypeIndex,
        },token)
        .then(val => {
          this.setState({cardId:""})
          message.success("发布成功！")
          this.setState({content:"",fileList:[],cardTypeIndex:0,imgArr:[]})
        })
        .catch(err => {
          this.setState({cardId:""})
          message.error("发布失败请稍候重试")
        })
    }
    handleCancel = () => {
      this.setState({ previewVisible: false })
    }
    handleRemove = async (file) => {
      // console.log(file)
    }

    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    };
    myBeforeUpload = () => {
      //直接return false无效
      return new Promise((resolve,reject) => {
         //登入检查
        if(!this.props.loginCheck()){
          message.warning("同学，尚未登入哦！")
          reject(false)
        }
        resolve(true)
      })
    }
    handleChange = ({ fileList }) => {
      let delImgName = ""
      if(fileList.length){//fileList有长度
      if(fileList[fileList.length-1].status == 'done'){//状态判断
        let imgArr = this.state.imgArr
        let fileImgArr = fileList[fileList.length-1].response.data.img
        this.setState({cardId:fileList[fileList.length-1].response.data._id})
            if(imgArr.length >= fileImgArr.length){//进行了删除操作
              console.log("有图片被删除")
              let imgArr2 = JSON.parse(JSON.stringify(imgArr))
              let fileImgArr2 = JSON.parse(JSON.stringify(fileImgArr))
              console.log(imgArr2)
              console.log(fileImgArr2) 
              //需要找到删除了的img的名称
              imgArr.map((item,index) => {
                if(!fileImgArr.includes(item)){
                  delImgName = item
                }
              })

              if(delImgName){
                imgArr.splice(imgArr.indexOf(delImgName),1)//更新imgArr
              }else{
                console.log("!!!")
                //更新imgArr   当delImgName在map了imgArr之后仍未空则表面删除的是第一张（目前仍有图片）
                delImgName = imgArr.splice(0,1)
              }

              this.setState({imgArr})
              //触发ajax
              cardDelUploadAjax({imageName:delImgName,cardId:this.state.cardId})
              .then(val => {
                // console.log("删除成功")
              })
              .catch(err => {
                // console.log("删除失败")
              })
            }else if(imgArr.length < fileImgArr.length){//进行了添加操作
              let fileImgLastItem = fileImgArr[fileImgArr.length-1] //fileList最后一项最后一张Img
              // console.log("最新添加的imgName")
              imgArr.push(fileImgLastItem)
              this.setState({imgArr})
            }
      }
    }else{
      //fileList没有项了
      //那么这种情况delImgName就是this.state.imgArr的最后一项(它也就剩一项了)
      // console.log("有图片被删除了")
      let imgArr = this.state.imgArr
      //更新imgArr
      delImgName = imgArr.pop()
      console.log(delImgName)
      this.setState({imgArr})

      //触发ajax
      cardDelUploadAjax({imageName:delImgName,cardId:this.state.cardId})
        .then(val => {
          console.log("删除成功")
        })
        .catch(err => {
          console.log("删除失败")
        })
    }
      this.setState({fileList})
    }
    cardTypeChange = (index) => {
      this.setState({cardTypeIndex:index})
    }
    render() {
        let props = {
            headers:{
                token:localStorage.getItem("token")//在上传图片的headers中添加token字段进行用户验证
            },
        }
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>添加图片🚀</div>
            </div>
            );
        return (
            <div className="textarea-box">
                {/* <form action={this.state.url} method="put">
                    <input type="file" onChange={this.myUploadChange}/>
                    <input onClick={this.myFormSubmit} value="submit"/>
                </form> */}
      <>
        <Upload
          {...props}
          action={`http://localhost:3030/card/upload${this.state.cardId ? `?cardId=${this.state.cardId}` : ""}`}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          beforeUpload={this.myBeforeUpload}
        >
          {fileList.length >= 6 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
            <div className="textarea-tags-box">
              {/* <span className="tag">捞人卡</span>
              <span className="tag">照片卡</span>
              <span className="tag">寻物卡</span>
              <span className="tag">日记卡</span>
              <span className="tag">吐槽卡</span> */}
              {
                //遍历state中的card type 供用户进行卡片类型选择
                this.state.cardType.map((item,index) => {
                  return(
                    <Button key={index} className="textarea-tags-btn" type={this.state.cardTypeIndex == index ? "primary" : "dashed"} size="small" onClick={() => this.cardTypeChange(index)}>
                      {item}
                    </Button>
                  )
                })
              }
                  {/* <Button className="textarea-tags-btn" type="dashed" size="small" onClick={this.cardTypeChange}>
                    <HeartOutlined />捞人卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <RobotOutlined />寻物卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <ReadOutlined />日记卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <LockOutlined />心事卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <FrownOutlined />吐槽卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <QuestionCircleOutlined /> 提问卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <SmileOutlined />交友卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <CarOutlined />开黑卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <LikeOutlined />安利卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <LaptopOutlined />学习卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small" onClick={this.cardTypeChange}>
                  <MehOutlined />无聊卡
                  </Button> */}
            </div>
            <TextArea value={this.state.content} ref="textarea" onChange={this.textareaChange}  className="textarea" rows={4} placeholder="在此输入内容发布你的卡片吧😝"/>
            <Button onClick={this.submit} className="textarea-box-btn" type="primary">发布🚀</Button>
            </div>
        )
    }
}

export default Textarea