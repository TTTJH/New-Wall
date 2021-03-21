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
  createFromIconfontCN,
 } from '@ant-design/icons';

import {
  cardSubmiAjax,
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
        cardId:"",
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
        cardTypeIndex:0,
      };

    componentDidMount(){
        console.log(":)")
    }

    textareaChange = (e) => {
        this.setState({
            content:e.target.value
        })
    }
    submit = () => {
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
          this.setState({content:"",fileList:[],cardTypeIndex:0})
        })
        .catch(err => {
          this.setState({cardId:""})
          message.error("发布失败请稍候重试")
        })
    }
    handleCancel = () => this.setState({ previewVisible: false });

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
    handleChange = ({ fileList }) => {
      console.log(fileList)
      if(fileList[0].response){
        //保存该条card的id
        this.setState({cardId:fileList[0].response.data._id})
      }
      this.setState({ fileList })
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
                    <Button className="textarea-tags-btn" type={this.state.cardTypeIndex == index ? "primary" : "dashed"} size="small" onClick={() => this.cardTypeChange(index)}>
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