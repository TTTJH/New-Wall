import React, { useState,useEffect } from 'react';
import {useHistory} from 'react-router-dom'
import {
  Form,
  Input,
  Tooltip,
  Button,
  message,
  Switch,
} from 'antd';
import { 
    QuestionCircleOutlined,
    ManOutlined,
    WomanOutlined,
    LoadingOutlined,
    CheckCircleFilled,
    CloseCircleFilled, 
  } from '@ant-design/icons';
import Cookies from 'js-cookie'
import {
  registerAjax,
  usernameCheckAjax,
  nicknameCheckAjax,
} from '../../../api/index'
import shakeProof from '../../../utils/shakeProof'
import './register.css'
import "../../../utils/animation.css"


const RegistrationForm = () => {
  let history = useHistory();

  const [form] = Form.useForm();

  const [usernameChecking,setUsernameChecking] = useState(false)
  const [usernameChecked,setUsernameChecked] = useState(false)
  const [usernameCanUse,setUsernameCanUse] = useState(true)
  const [nicknameChecking,setNicknameChecking] = useState(false)
  const [nicknameChecked,setNicknameChecked] = useState(false)
  const [nicknameCanUse,setNicknameCanUse] = useState(true)
  const [submiting,setSubmiting] = useState(false)

  const onFinish = values => {
    if(nicknameCanUse && usernameCanUse && !submiting){//额外判断nicknameCanUse和usernameCanUser
      setSubmiting(true)//提交中状态
      registerAjax(values)
      .then(val => {
        message.success("注册成功🤓自动登入")
        let {token} = val.data.data //注册后就获得了token
        console.log(token)
        localStorage.setItem("token",token)//保存token
        history.push("/") //react hook的history路由跳转
      })
      .catch(err => {
        message.error("服务器出问题了，稍等一下🥴")
        setSubmiting(false) //提交完毕状态
      })
    }

  };

  //用户名重名判断函数
  const usernameCheck = () => {
    let username = document.querySelector("#register_username")
    if(username.value){
      //传递e.target.value去验证是否已经被使用
      setUsernameChecking(true)
      setUsernameChecked(false)
      let data = {
        username:username.value
      }
      usernameCheckAjax(data)
        .then(val => {
          setUsernameChecked(true) //检查完毕
          val.data.code == 200 //判断是否可用
          ?
          setUsernameCanUse(true)
          :
          setUsernameCanUse(false)
        })
        .catch(err => {
          message.error("服务器出问题了，稍等一下🥴")
        })
    }else{
      //删除为空时更新可用否图标状态
      setUsernameChecking(false)
      setUsernameChecked(false)
    }
  }

  //nickname重名判断函数
  const nicknameCheck = () => {
    let nickname = document.querySelector("#register_nickname")
    if(nickname.value){
      //传递e.target.value去验证是否已经被使用
      setNicknameChecking(true)
      setNicknameChecked(false)
      let data = {
        nickname:nickname.value
      }
      nicknameCheckAjax(data)
        .then(val => {
          setNicknameChecked(true) //检查完毕
          val.data.code == 200 //判断是否可用
          ?
          setNicknameCanUse(true)
          :
          setNicknameCanUse(false)
        })
        .catch(err => {
          message.error("服务器出问题了，稍等一下🥴")
        })
    }else{
      //删除为空时更新可用否图标状态
      setNicknameChecking(false)
      setNicknameChecked(false)
    }
  }

  //跳转至login路由函数
  const gotoLogin = () => {
    history.push("/login")
  }

  return (
  <div className="register-box animation">
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >

      <Form.Item
      validateStatus={usernameCanUse ? "" : "error"} //usernameCanUse来决定input边框颜色
      help={usernameCanUse ? null : "用户名已经被抢先注册啦🙈"} //usernameCanUse为false时提示文字
        name="username"
        label={
          <span>
            用户名&nbsp;
          </span>
        }
        rules={[{ required: true, message: '不能为空哦', whitespace: true }]}
      >
        <Input 
        className="username"
        onChange={shakeProof(usernameCheck,500)}
        suffix={
          usernameChecking
          ?
          <Tooltip title="重名判断">
            {
              usernameChecked
              ?
              usernameCanUse ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#fe7171' }} />
              :
              <LoadingOutlined style={{ color: '#fddb3a' }} />
            }
        </Tooltip>
        :
        <span></span>
        }
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('The two passwords that you entered do not match!');
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        validateStatus={nicknameCanUse ? "" : "error"} //nicknameCanUse来决定input边框颜色
        help={nicknameCanUse ? null : "好听的昵称已经被抢先注册啦🙈"} //nicknameCanUse为false时提示文字
        name="nickname"
        label={
          <span>
            昵称&nbsp;
            <Tooltip title="社区代号嘻嘻嘻">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: '不能为空哦', whitespace: true }]}
      >
        <Input 
        onChange={shakeProof(nicknameCheck,500)}
        suffix={
          nicknameChecking
          ?
          <Tooltip title="重名判断">
            {
              nicknameChecked
              ?
              nicknameCanUse ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : <CloseCircleFilled style={{ color: '#fe7171' }} />
              :
              <LoadingOutlined style={{ color: '#fddb3a' }} />
            }
        </Tooltip>
        :
        <span></span>
        }
        />
      </Form.Item>

      <Form.Item
        name="gender"
        label="性别"
        initialValue={true}
        rules={[{ required: true}]}
      >
      <Switch
        defaultChecked
        checkedChildren={<ManOutlined />}
        unCheckedChildren={<WomanOutlined />}
      />
      </Form.Item>

      <Form.Item>
        <Button className="register-box-btn" type="primary" htmlType="submit">
          {
            //状态判断
            submiting
            ?
            <LoadingOutlined style={{ color: 'white' }} />
            :
            "注册"
          }
        </Button>
        <p className="gotoLoginP"><a onClick={gotoLogin} href="javascript:;">去登入!</a></p>
      </Form.Item>

    </Form>
  </div>

  );
};

export default RegistrationForm