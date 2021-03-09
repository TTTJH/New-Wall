import React,{Component} from 'react'
import Cookies from 'js-cookie'
import { 
        Input,
        Upload,
        Modal,
        Button,
        message,

       } from 'antd';

import { PlusOutlined } from '@ant-design/icons';
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
        url:""
      };
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
    componentDidMount(){
        console.log(":)")
    }
    handleAction = (file) => {
        let cutIndex = file.name.lastIndexOf(".")
        let fileName = file.name.slice(0,cutIndex)
        let type = file.name.slice(cutIndex+1,file.name.length)
        this.setState({
            img:fileName+"."+type
        })
    }
    handleChange = ({ fileList }) => {
        this.setState({ fileList })
        console.log(fileList)
    };


    handleUpload = (file) => {
        let fileName = file.name.slice(0,file.name.lastIndexOf("."))
        let type = file.name.slice(file.name.lastIndexOf(".")+1,file.name.length)
        this.setState({
            fileName,
            type,
            img:fileName+"."+type
        })
    }
    textareaChange = (e) => {
        this.setState({
            content:e.target.value
        })
    }

    render() {
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
                ref="upload"
                name="file"
                method="post"
                className="textarea-box-upload-btn"
                // action={this.handleAction}
                listType="picture-card"
                fileList={fileList}
                >
                {fileList.length >= 1 ? null : uploadButton}
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
            <TextArea value={this.state.content} ref="textarea" onChange={this.textareaChange}  className="textarea" rows={4} placeholder="在此输入内容发布你的卡片吧😝"/>
            <Button onClick={this.submit} className="textarea-box-btn" type="primary">发布🚀</Button>
            </div>
        )
    }
}

export default Textarea