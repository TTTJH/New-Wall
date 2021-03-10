import React,{Component} from 'react'
import Cookies from 'js-cookie'
import {withRouter} from 'react-router-dom'
import {Form,
        Input,
        Button,
        message } from 'antd';
import {
    loginAjax,
} from '../../../api/index'
import './login.css'

class Login extends Component{
    constructor(props){
        super(props)
    }
    layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    onFinish = values => {
        loginAjax(values)
            .then((val) => {
                if(val.data.code == 200){
                    let {token} = val.data.data
                    localStorage.setItem("token",token)
                    message.success("欢迎回来")
                    this.props.history.push("/")
                }else if(val.data.code == 100){
                    message.warn(val.data.msg)
                }
            })
            .catch((err) => {
                message.warn("错误啦！")
            })
    };
    gotoRegister = () => {
        this.props.history.push("/register")
    }
    onFinishFailed = errorInfo => {
         console.log('Failed:', errorInfo);
    };
    render() {
        return (
            <div className="login-box">
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item >
                    <Button className="login-box-btn" type="primary" htmlType="submit">
                        登入
                    </Button>
                    <p className="gotoRegisterP"><a onClick={this.gotoRegister} href="javascript:;">去注册!</a></p>
                </Form.Item>
            </Form>

            </div>
        )
    }
}

export default withRouter(Login)