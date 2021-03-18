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
      cardSubmiAjax({content:this.state.content},token)
        .then(val => {
          message.success("发布成功！")
          this.setState({content:"",fileList:[]})
        })
        .catch(err => {
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
    handleChange = ({ fileList }) => this.setState({ fileList });
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
              <div style={{ marginTop: 8 }}>图片🚀</div>
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
          action="http://localhost:3030/card/upload"
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
                  <Button className="textarea-tags-btn" type="dashed" size="small">
                    <HeartOutlined />捞人卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  <RobotOutlined />寻物卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  寻人卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  日记卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  心事卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  吐槽卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  提问卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  交友卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  开黑卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  科普卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  安利卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  组队卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  相亲卡
                  </Button>
                  <Button  className="textarea-tags-btn"  type="dashed"size="small">
                  学习卡
                  </Button>
                  
            </div>
            <TextArea value={this.state.content} ref="textarea" onChange={this.textareaChange}  className="textarea" rows={4} placeholder="在此输入内容发布你的卡片吧😝"/>
            <Button onClick={this.submit} className="textarea-box-btn" type="primary">发布🚀</Button>
            </div>
        )
    }
}

export default Textarea