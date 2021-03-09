<a name="xbIoQ"></a>
### React
<a name="kPDAe"></a>
#### new-wall-ui(在3a写好的react静态组件页面，react-cli、ant-design)

- [new-wall-ui](https://github.com/TTTJH/New-Wall-UI.git)
- ![深度截图_code_20201118150932.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1605683377750-fd87e0ef-be06-4a2b-8198-deada3f6ea37.png#align=left&display=inline&height=427&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_code_20201118150932.png&originHeight=1334&originWidth=2160&size=369644&status=done&style=none&width=691)
<a name="pSDtL"></a>
#### 根据/user/login和/user/register接口实现注册与登入功能
<a name="vnLIR"></a>
#### 编写api

- 使用到axios
   - cd new-wall/client
   - npm i axios
- mkdir api
- touch ajax.js
- new-wall/client/api/ajax.js
   - 封装了axios函数
   - 但是还没有编写有传递token的情况，后面会更新该封装函数
   - ![深度截图_选择区域_20201109093013.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604885417513-c8395600-8d74-4949-9bc6-3849c27cfee1.png#align=left&display=inline&height=490&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201109093013.png&originHeight=490&originWidth=829&size=80761&status=done&style=none&width=829)
- touch index.js
- new-wall/client/api/index.js
   - index.js为封装的众多ajax请求函数
   - ![深度截图_选择区域_20201109093618.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604885781835-2af2233f-28b7-4ff7-9990-b7cd74b86f4a.png#align=left&display=inline&height=387&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201109093618.png&originHeight=489&originWidth=624&size=75427&status=done&style=none&width=494)
<a name="vwTNF"></a>
#### 实现register页面功能

- 每次onChange后都会进行重名验证
- 提交按钮进行了防重复提交
- 代码如下
- new-wall/client/src/components/register/register.jsx
```javascript
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
import './register.css'

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
  const usernameCheck = (e) => {
    if(e.target.value){
      //传递e.target.value去验证是否已经被使用
      setUsernameChecking(true)
      setUsernameChecked(false)
      let data = {
        username:e.target.value
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
  const nicknameCheck = (e) => {
    if(e.target.value){
      //传递e.target.value去验证是否已经被使用
      setNicknameChecking(true)
      setNicknameChecked(false)
      let data = {
        nickname:e.target.value
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

  return (
  <div className="register-box">
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
        onChange={usernameCheck}
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
        onChange={nicknameCheck}
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
      </Form.Item>

    </Form>
  </div>

  );
};

export default RegistrationForm
```

- 效果图：
   - ![深度录屏_选择区域_20201117215616.gif](https://cdn.nlark.com/yuque/0/2020/gif/286208/1605621424200-ea857f9d-d519-46e2-8e15-f430607a5b25.gif#align=left&display=inline&height=393&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E5%BD%95%E5%B1%8F_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201117215616.gif&originHeight=943&originWidth=1305&size=795054&status=done&style=none&width=544)
<a name="qYPP5"></a>
#### 为表单添加防抖

- 这里防抖的使用原本思路是传递event对象获取event.target.value来获取表单值
- 但是防抖的写法是传递的静态参数，此处采用了很low的dom操作来获取最新value😧😧😧
- 日后有好的解决方法会进行更新
- 编写防抖函数
   - ![深度截图_选择区域_20201215174913.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1608025757157-5001f2c0-1429-41c3-b0b4-211d07aa35e9.png#align=left&display=inline&height=57&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201215174913.png&originHeight=57&originWidth=230&size=4612&status=done&style=none&width=230)
   - ![深度截图_选择区域_20201215174924.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1608025767621-68b0a13f-6820-40e1-8dc3-40f69161ed40.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201215174924.png&originHeight=360&originWidth=635&size=44160&status=done&style=none&width=635)
- 使用防抖函数
   - src/components/register.jsx
   - ![深度截图_选择区域_20201215174937.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1608025780699-e03608a7-e46c-4408-a701-5789194c98dd.png#align=left&display=inline&height=43&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201215174937.png&originHeight=43&originWidth=681&size=10575&status=done&style=none&width=681)
   - ![深度截图_选择区域_20201215174838.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1608025729743-b76d1a92-abfb-4bfc-a3b0-c7cb891854bb.png#align=left&display=inline&height=387&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201215174838.png&originHeight=755&originWidth=740&size=107974&status=done&style=none&width=379)
   - ![深度截图_选择区域_20201215174744.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1608025671870-91e2418f-2897-4996-8d4b-7c6b16656280.png#align=left&display=inline&height=369&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201215174744.png&originHeight=851&originWidth=802&size=139652&status=done&style=none&width=348)
- 效果：
   - 在停止输入username的500ms后才进行ajax重复验证(有options预检测请求)，而不是之前改变一个字母就会发送一个ajax请求
   - ![深度录屏_选择区域_20201215175112.gif](https://cdn.nlark.com/yuque/0/2020/gif/286208/1608025899616-404f122d-c531-4f06-8de2-e8dc6caa456e.gif#align=left&display=inline&height=1169&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E5%BD%95%E5%B1%8F_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201215175112.gif&originHeight=1169&originWidth=1485&size=683511&status=done&style=none&width=1485)
<a name="7f81i"></a>
#### 为nickname也添加防抖
<a name="X93XW"></a>
#### 实现login功能

- new-wall//client/src/User/Login/login.jsx
```javascript
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
                console.log(val)
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
                console.log(err)
                message.warn("错误啦！")
            })
    };

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
                </Form.Item>
            </Form>

            </div>
        )
    }
}

export default withRouter(Login)
```


<a name="sVw08"></a>
#### 实现index页面用户信息展示功能

- 注册完毕后，后端返回token，前端保存，即实现了自动登入
- 现在我们要做的是将index页面的用户信息面板改为动态
   - ![深度截图_选择区域_20201117220007.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1605621618267-8f7a94a6-c0fe-4769-b21e-acee5d9e01eb.png#align=left&display=inline&height=329&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201117220007.png&originHeight=456&originWidth=472&size=56301&status=done&style=none&width=341)
- 需要使用到/use/getInfo接口了
- 首先编写获取用户信息的api
- 这里我们需要在请求头部中增加token字段了，
<a name="k41hF"></a>
#### 进行token过期的判断，userbox显示"?"，message发送请重新登入提示

- 因为我想让用户未登入的情况也可以查看main卡片墙，所以token过期不强制跳转login.jsx
- 如需跳转的话这里还涉及到非路由组件进行编程式重定向的知识点(withRouter()、useHistory)
- ![深度截图_选择区域_20201201093454.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1606786536022-b4510866-c73b-4b53-86b3-20aa51f8e6ed.png#align=left&display=inline&height=290&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201201093454.png&originHeight=429&originWidth=917&size=84924&status=done&style=none&width=620)
<a name="9GJGU"></a>
#### 此处应该无痛实现token更新
<a name="eqfjB"></a>
#### 实现账户退出功能

- 这里在userbox的右上角增加了退出按钮
- 退出按钮确定函数的内容：
   - 删除localStorage中的token字段
   - 清空userbox组件的state的userInfo对象
   - ![深度截图_选择区域_20210305162246.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1614932578994-b9fb23b2-4edc-40f8-9549-eb1eb2747a09.png#align=left&display=inline&height=201&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210305162246.png&originHeight=201&originWidth=610&size=45315&status=done&style=none&width=610)
- 退出按钮代码
   - ![深度截图_选择区域_20210305162325.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1614932615215-9639716b-d531-4665-b67a-d55f9b04b946.png#align=left&display=inline&height=254&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210305162325.png&originHeight=318&originWidth=756&size=47324&status=done&style=none&width=605)
- userbox.jsx目前整体代码如下
```javascript
import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
    message,
    Popover,
    Upload,
    Tooltip,
    Popconfirm,

} from 'antd'
import ImgCrop from 'antd-img-crop';
import {
    PlusOutlined,
    QuestionOutlined,
    DeleteOutlined,
} from "@ant-design/icons"

import {
    getUserInfoAjax,
} from '../../api/index'

import "./userbox.css"

class Userbox extends Component{
    constructor(props){
        super(props)
    }
    state = {
        userInfo:{},
    }
    componentDidMount(){
        let token = localStorage.getItem("token")
        getUserInfoAjax(token)//获取用户信息接口
            .then(val => {
                if(val.data.code == 100){//token过期
                    message.warning("还未进行用户登入噢🙊")
                    // this.props.history.push("/login")
                }else{
                    this.setState({userInfo:val.data.userInfo})//更新state
                }
            })
            .catch(err => {
                message.error("服务器宕机啦!请稍候再试")
            })
    }
    gotoLogin = () => {
        console.log(this)
        this.props.history.push("/login")
    }
    {/* ---------------------本次重要代码start----------------- */}
    logoutConfirm = () => {
        //删除localStorage中存储的token
        localStorage.removeItem("token")
        //更新state中userInfo的状态
        this.setState({userInfo:{}})//清除userInfo
        message.success("退出成功")
    }
    {/* ---------------------本次重要代码end----------------- */}
     render() {
        const props = {
            name: 'file',
            action: 'http://localhost:3030/user/avatar',
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
          };
        return (
            <div className="user-box">
            {/* ---------------------本次重要代码start----------------- */}
            {
                Object.keys(this.state.userInfo).length
                ?
                <Popconfirm
                title="确定要退出该账户?"
                onConfirm={this.logoutConfirm}
                okText="Yes"
                cancelText="No"
                >
                <img className="exit-btn" src="exit.png" alt=""/>
                </Popconfirm>
                :
                null
            }
            {/* ---------------------本次重要代码end----------------- */}
            <div className="user-avatar" >
                {
                    Object.keys(this.state.userInfo).length
                    ?
                    <ImgCrop rotate>
                        <Upload {...props}>
                            {this.state.userInfo.avatar}
                        </Upload>
                    </ImgCrop>
                    ?
                    <ImgCrop rotate>
                        <Upload {...props}>
                            <img className="user-avatar-img" src={this.state.userInfo.avatar} alt=""/>
                        </Upload>
                    </ImgCrop>
                    :
                    <ImgCrop rotate>
                        <Upload {...props}>
                            <p className="user-avatar-img-logo">
                                {this.state.userInfo.nickname ? this.state.userInfo.nickname.slice(0,1) : null}
                            </p>
                        </Upload>
                    </ImgCrop>
                    :
                    //未登入
                        <p className="default-avatar" onClick={this.gotoLogin}>
                            <QuestionOutlined />
                        </p>
                }

            </div>
            <p className="nickName">
                {this.state.userInfo.nickname}
            </p>
            <div className="user-tag-box">
            <Popover  
            overlayClassName="userbox-popover" 
            content={<DeleteOutlined />}
            color="red" 
            title="" >
                <span className="tag">萌新</span>
            </Popover>
                {/* <span className="tag">二次元</span>
                <span className="tag">zzuli</span>
                <span className="tag">萌新</span>
                <span className="tag">二次元</span>
                <span className="tag">zzuli</span>
                <span className="tag">萌新</span>
                <span className="tag">二次元</span>
                <span className="tag">zzuli</span> */}
                <span className="tag tag-add-btn"><PlusOutlined /></span>
            </div>
        </div>
        )
    }
}

//props验证
Userbox.propTypes = {
    userInfo:PropTypes.object
}


export default withRouter(Userbox)
```
<a name="CFJhO"></a>
#### 实现用户头像可裁剪上传

- 首先复制粘贴antd的上传组件中的可剪裁部分（想说很久了，例图肯定是阿里程序员的女朋友）
   - ![深度截图_选择区域_20210306164635.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615020418785-aa4118e1-7f48-49a7-8e29-473b490bfd3b.png#align=left&display=inline&height=210&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210306164635.png&originHeight=386&originWidth=645&size=50078&status=done&style=none&width=351)
- Uploads组件的options配置对象onChange函数
   - ![深度截图_选择区域_20210306174617.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615023997482-842fd2b9-07ca-400f-a459-57442996e4ec.png#align=left&display=inline&height=236&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210306174617.png&originHeight=236&originWidth=1176&size=41614&status=done&style=none&width=1176)
   - 上传完毕需要再次调用getUserInfoAjax来获取新的userInfo
   - ![深度截图_选择区域_20210306174648.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615024031353-39983ebf-facf-4bae-a2cd-a1c950bd8737.png#align=left&display=inline&height=606&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210306174648.png&originHeight=606&originWidth=931&size=120665&status=done&style=none&width=931)
   - ![深度截图_选择区域_20210306174727.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615024065897-0c5f24a3-27ec-452a-b26d-226ca1144ea0.png#align=left&display=inline&height=96&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210306174727.png&originHeight=96&originWidth=701&size=23530&status=done&style=none&width=701)
- 效果如下：
   - ![深度录屏_google-chrome_20210306174936.gif](https://cdn.nlark.com/yuque/0/2021/gif/286208/1615024543032-21fabc43-2f05-4f06-979f-5143dd481f40.gif#align=left&display=inline&height=1340&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E5%BD%95%E5%B1%8F_google-chrome_20210306174936.gif&originHeight=1340&originWidth=2160&size=2560398&status=done&style=none&width=2160)



<a name="4ukIq"></a>
#### 接着我想实现userBox的个性tag编辑功能

- 首先实现userbox的个性标签的样式
- 这里使用到的就是@keyframes
- 动画帧组合实现自己想要的效果
- UI效果如下
   - ![深度录屏_选择区域_20210308170308.gif](https://cdn.nlark.com/yuque/0/2021/gif/286208/1615194221957-fbec6a4e-c12a-4d58-bf94-ac5c181c8ef8.gif#align=left&display=inline&height=384&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E5%BD%95%E5%B1%8F_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210308170308.gif&originHeight=563&originWidth=550&size=609219&status=done&style=none&width=375)
- 首先编写tag操作相关的ajax
   - new-wall/client/api/index.js
   - ![深度截图_选择区域_20210309160114.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615276878399-2108cf6b-c29b-410c-9350-4c9c5b075c94.png#align=left&display=inline&height=96&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210309160114.png&originHeight=96&originWidth=681&size=20058&status=done&style=none&width=681)
- 实现tag添加功能
   - 双向绑定input
   - ![深度截图_选择区域_20210309160349.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615277039267-668ce9c5-aee3-4601-9448-7c7bd34974ea.png#align=left&display=inline&height=257&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210309160349.png&originHeight=257&originWidth=1298&size=86317&status=done&style=none&width=1298)
   - submit button调用tag相关的ajax
   - ![深度截图_选择区域_20210309161125.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615277495429-9616f59f-6855-45dd-af4c-ea7cf03fff71.png#align=left&display=inline&height=845&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210309161125.png&originHeight=845&originWidth=1252&size=182186&status=done&style=none&width=1252)
- 这里又遇到个小问题就是关于dom获取问题
   - 获取antd的popover需要在其显示之后，我将他们都保存至state的userpopvers中，每次userpopvers的末尾dom就是还未绑定单机事件的，我为其进行绑定。
   - 并且进行删除操作的代码编写
   - ![深度截图_选择区域_20210309161651.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615277817301-c5b2af15-a6d2-4607-896b-45cc9c562e9e.png#align=left&display=inline&height=1072&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210309161651.png&originHeight=1072&originWidth=1243&size=232963&status=done&style=none&width=1243)
   - 注意这里的span使用onmouseenter事件，鼠标进入元素后激活一次，使用onmousemove还要手写防抖
      - ![深度截图_选择区域_20210309161757.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615277930715-e020fcdf-2be9-446b-94a3-6a7223913650.png#align=left&display=inline&height=167&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210309161757.png&originHeight=271&originWidth=1018&size=50811&status=done&style=none&width=629)
- 成品效果图如下：
   - 完美
   - ![深度录屏_选择区域_20210309162203.gif](https://cdn.nlark.com/yuque/0/2021/gif/286208/1615278198375-3917cefa-003c-4897-909b-fb14357a1fc7.gif#align=left&display=inline&height=776&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E5%BD%95%E5%B1%8F_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210309162203.gif&originHeight=776&originWidth=1381&size=1173643&status=done&style=none&width=1381)



<a name="E6pOM"></a>
### Koa2

- cd new-wall
- cd server
- npm init
- npm install koa
- touch index.js
- new-wall/server/index.js
```javascript
const Koa = require("koa")
const app = new Koa()

app.use(async (ctx) => {
    ctx.body = "Hello Koa2"
})

app.listen(3030)
console.log("koa2 running in 3030!!!")
```
<a name="nTEJs"></a>
#### koa2连接mongodb

- 本机开启mongod
   - ![深度截图_选择区域_20201102192314.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604316221898-7b0b5d88-b4e3-471d-ae00-0ded5c1dd61a.png#align=left&display=inline&height=134&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201102192314.png&originHeight=134&originWidth=1758&size=53824&status=done&style=none&width=1758)
- npm install mongoose
- mkdir database
   - touch connect.js
```javascript
const mongoose = require("mongoose")
const db = "mongodb://localhost:27017/new-wall"

module.exports.connect = () => {
    mongoose.connect(db,{ useNewUrlParser: true })
    let maxReconnectCount = 0
    return new Promise(((resolve, reject) => {
        //绑定事件
        mongoose.connection.on("disconnected",() => {
            if(maxReconnectCount < 3){
                //可进行重连
                mongoose.connect(db,{ useNewUrlParser: true })
                return 1
            }else{
                //超出最大连接限制
                reject("连接失败！超出最大重连次数限制！")
            }
        })

        mongoose.connection.on("error",() => {
            if(maxReconnectCount < 3){
                //可进行重连
                mongoose.connect(db,{ useNewUrlParser: true })
                return 1
            }else{
                //超出最大连接限制
                reject("连接失败！超出最大重连次数限制！")
            }
        })

        mongoose.connection.on("open",() => {
            resolve("连接数据库成功！🤓")
        })
    }))
}
```
<a name="h6lRn"></a>
#### 编写schema&module.js文件
<a name="ijaXU"></a>
##### 该文件引入mongoose来定义Schema和Model并导出

- new-wall/server/database/schema&module.js
```javascript
const mongoose = require("mongoose")
const Schema = mongoose.Schema

//定义Schema
const UserSchema = new Schema({
    userId:Schema.Types.ObjectId,
    username:String,
    password:String,
    nickname:String,
    gender:String,
    avatar:String,
   tags:Array //个人标签字段
})

//定义Model
const UserModel = new mongoose.model("user",UserSchema)

//导出是Model
exports.UserModel = UserModel

```
<a name="HxbC7"></a>
#### 编写一个user子路由

- cd new-wall/server
- **npm install koa-router**
- mkdir routes
- cd routes
- touch user.js
- touch router.js //用于装载众多routes
- new-wall/server/routes/user.js
   - ![深度截图_选择区域_20201103104240.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604371366736-cb78bec9-5efa-44f4-a126-38efa5491ae0.png#align=left&display=inline&height=331&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201103104240.png&originHeight=471&originWidth=696&size=46383&status=done&style=none&width=489)
- new-wall/server/routes/router.js
   - ![深度截图_选择区域_20201103104131.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604371303506-0666b0f0-6eef-40b4-9b64-51eaedb216e4.png#align=left&display=inline&height=231&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201103104131.png&originHeight=412&originWidth=1103&size=62219&status=done&style=none&width=619)
- new-wall/server/index.js  (app使用router.js中间件)
   - ![深度截图_选择区域_20201103104342.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604371427389-379f9631-11da-40d1-b70a-e7ae161974e7.png#align=left&display=inline&height=404&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201103104342.png&originHeight=961&originWidth=1097&size=136771&status=done&style=none&width=461)
   - 下图写法也可以，还是对配置中间件有点迷惑...
      - ![深度截图_选择区域_20201103104546.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604371549912-dd6ce532-a510-4814-8877-1c4b2572af7f.png#align=left&display=inline&height=72&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201103104546.png&originHeight=98&originWidth=666&size=13154&status=done&style=none&width=487)
      - <br />
- 子路由访问结果：
   - ![深度截图_选择区域_20201103104410.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604371454977-0ca331fe-207b-405a-9caa-5a9276fa4409.png#align=left&display=inline&height=95&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201103104410.png&originHeight=119&originWidth=580&size=8916&status=done&style=none&width=462)
<a name="Pyqpp"></a>
#### 使用token (这里疑惑的话再去看js笔记里的jwt部分)

- cd new-wall/server
- npm install jsonwebtoken
- mkdir utils
- touch jwt.js //编写工具类jwt.js
- new-wall/server/utils/jwt.js
```javascript
const jwt = require("jsonwebtoken")

class Jwt {
    constructor(data) {
        this.data = data
        this.sercet = "hello token"
    }

    generToken(){
        let data = this.data
        let secret = this.sercet
        let endTime = Math.floor(Date.now()/1000)
        console.log(endTime)
        // let token = jwt.sign(data,secret,{expiresIn:endTime + 10})
        let token = jwt.sign({data,exp:endTime + 60},secret)
        return token
    }

    verifyToken(token){
        let secret = this.sercet
        let nowTime = Math.floor(Date.now()/1000)
        let result = jwt.verify(token,secret,{},(error,decoded) => {
            if(error){
                //error有值有两种情况，
                    //exp过期时间已经小于当前时间。
                    //token传递有误。
                return {code:100,msg:"token已过期"}
            }
                return {code:200,data:decoded}
        })
        return result
    }
}

module.exports = Jwt
```

- touch tokenVerify.js  //编写验证token的中间件
- new-wall/server/utils/tokenVerify.js
```javascript
const Jwt = require("./jwt")

function tokenVerify(ctx, next){
    let urlArr = ["/user/info"] //需要token的url数组
    if(urlArr.indexOf(ctx.request.url) !== -1){
        //该url在需要token的url数组中
        let {token} = ctx.request.headers
        let jwt = new Jwt({}),result = null
        token ? result = jwt.verifyToken(token) : ctx.throw(401,"未携带token")
        console.log(result)
        if(result.code === 200){
            next()
        }else if(result.code === 100){
            ctx.throw(401,"token过期!")
        }
    }else{
        //请求url不需要token直接next()
        next()
    }
}

module.exports = tokenVerify
```

- 在index.js暂时直接生成token,配置中间件
   - 真实环境的token是应该在用户登入后生成,而不是直接生成
```javascript
const Koa = require("koa")
const router = require("./routes/router")//装载了众多子路由的router.js
const Jwt = require("./utils/jwt") //jsonwebtoken的生成与验证
const tokenVerify = require("./utils/tokenVerify")
const db = require("./database/connect")//mongodb数据库的连接操作
const {UserModel, } = require("./database/schema&model")//mongoose的schema和model

const app = new Koa()
//app加载路由中间件
app.use(router.routes(),router.allowedMethods())

//-------------重要代码start---------------------
//token测试
let jwt = new Jwt({username:"ttttjh",password:"tttjh"},"Hello Token")
let token = jwt.generToken()
console.log(token)
let result = jwt.verifyToken(token)
console.log(result)
//-------------重要代码end---------------------
//连接数据库
db.connect()
    .then(val => {
        console.log(val)
    })
    .catch(err => {
        console.log(err)
    })
//-------------重要代码start---------------------
app.use((ctx,next) => tokenVerify(ctx,next))
//-------------重要代码end---------------------


app.listen(3030)
console.log("koa2 running in 3030!!!")


```

- 此时访问/user/info就需要携带token了
- ![深度截图_选择区域_20201103160512.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604390718316-361274c2-a0c4-458f-bed5-41724ac98b85.png#align=left&display=inline&height=305&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201103160512.png&originHeight=728&originWidth=1097&size=75757&status=done&style=none&width=459)
<a name="scMZH"></a>
#### 编写user/register注册路由

- 本次注册要求传递的字段有：
   - username
   - password
   - nickname
   - gender
   - tags
<a name="a8PKw"></a>
#### 使用到koa-bodyparser中间件（解析post请求数据）

- npm i koa-bodyparser
- new-wall/server/routes/user.js
   - ![深度截图_选择区域_20201104150520.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604473533051-993e50b6-bc37-4f4e-b4a2-e0994576d0a8.png#align=left&display=inline&height=302&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201104150520.png&originHeight=499&originWidth=774&size=59832&status=done&style=none&width=468)
- 接着在user.js中导入UserModel
   - 因为我们要在user.js路由中对mongodb有所操作
   - UserModel为我们提供了操作mongodb的user表的途径
   - ![深度截图_选择区域_20201104150817.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604473700079-ae26467f-39be-4c58-bbda-c9d94bc1ff1f.png#align=left&display=inline&height=43&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201104150817.png&originHeight=43&originWidth=822&size=10334&status=done&style=none&width=822)
<a name="8mW82"></a>
#### 写到这里我觉得，应该在用户注册时，填完一个input后，就应该进行一次检查，是否重复，进行相应提示。
<a name="3siMH"></a>
#### 所以在register注册路由编写之前，再对应编写几个字段检查路由

- 下图为用户名检查路由
- 使用UserModel来对user-collection来进行username查询
- 注意UserModel的操作是异步的，需要使用async await来使其表现同步化，否则回调函数中的ctx.body的赋值代码无法起到正确作用。
- **后来使用检查路由时发现回调函数的写法有时会not found，所以还是要采用Promise链式调用的方法**
- ![深度截图_选择区域_20201108163954.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604824822392-10563747-dad9-4fb2-a692-7439fdbb8cfa.png#align=left&display=inline&height=79&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201108163954.png&originHeight=487&originWidth=958&size=72115&status=done&style=none&width=155)回调函数的写法会not found
- ![深度截图_选择区域_20201110083105.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604968269307-5765137e-ee78-4f2e-858c-30d8d2982bfb.png#align=left&display=inline&height=668&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201110083105.png&originHeight=668&originWidth=941&size=103501&status=done&style=none&width=941)
- //nickname检查路由
- ![深度截图_选择区域_20201108164411.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604825055617-aa1f8ec6-5c64-47cc-8bd7-a444ed9c82fa.png#align=left&display=inline&height=86&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201108164411.png&originHeight=442&originWidth=932&size=71720&status=done&style=none&width=182)回调函数的写法会not found
- ![深度截图_选择区域_20201110083308.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604968392142-1c1c358e-6125-42a5-929c-2ad8a7143ddc.png#align=left&display=inline&height=606&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201110083308.png&originHeight=606&originWidth=962&size=91758&status=done&style=none&width=962)
<a name="sonz4"></a>
#### 接着实现register路由

- 由于我们在用户每次输入input后都进行了是否重复可用检查，所以register路由执行时代表传递数据直接可用。
- 这里我们需要使用的npm上的md5包
   - npm i md5
   - md5包用于对传递来的password字段进行加密存储进数据库
   - 用户登入时传递的password也进行md5加密然后和数据库中加密过的password字段比较
- 注意：
   - 这里我们使用**Model.save()方法的链式调用方式**来获取数据库执行结果
   - 因为**回调函数**的写法，在**回调函数内部ctx.body无法设置**使得路由查询结果为**not found**（写**了async await的情况**）
   - ![深度截图_选择区域_20201108175001.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604829006451-20b191bd-1a3e-4250-a20b-8254072e2832.png#align=left&display=inline&height=734&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201108175001.png&originHeight=734&originWidth=1454&size=109004&status=done&style=none&width=1454)
   - 更新/user/register接口为注册后即生成token并返回
   - ![深度截图_选择区域_20201109211317.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604927604397-c97d5e5e-db9c-45c8-82a9-0d00b1344009.png#align=left&display=inline&height=612&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201109211317.png&originHeight=1048&originWidth=843&size=123506&status=done&style=none&width=492)
- **使用/user/register接口**
      - ![深度截图_选择区域_20201108175329.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604829228740-32f9ecba-2e6b-45d3-8365-d618e169f26b.png#align=left&display=inline&height=365&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201108175329.png&originHeight=688&originWidth=650&size=53078&status=done&style=none&width=345)
      - 数据添加成功
      - ![深度截图_选择区域_20201108175403.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604829248175-d1aef110-a36d-4c0c-9be9-d4824197c21c.png#align=left&display=inline&height=84&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201108175403.png&originHeight=84&originWidth=1747&size=34937&status=done&style=none&width=1747)
   - 下图的写法**ctx.body设置无效**(还不知道是为啥🥴🥴🥴)
   - ![深度截图_选择区域_20201108175120.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604829084893-6455fca7-5804-4b36-ac47-b9f3c721c79c.png#align=left&display=inline&height=210&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201108175120.png&originHeight=275&originWidth=773&size=34679&status=done&style=none&width=591)
   - ![深度截图_选择区域_20201108175135.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604829098336-4f2c9ef3-a8d2-4e91-bfc2-02a498f0e943.png#align=left&display=inline&height=44&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201108175135.png&originHeight=44&originWidth=234&size=1813&status=done&style=none&width=234)
- <br />
<a name="ugL5z"></a>
#### 接着编写登入路由

- 在登入路由中验证用户名和密码成功后我们需要使用之前便携的Jwt类生成token并返回
```javascript
//--------------用户登入路由--------------------
user.post("/login",async (ctx) => {
     let {username,password} = ctx.request.body
     password = md5(password)
     //数据库查询
     await UserModel.findOne({"username":username})
         .then(val => {
               if(val && (password === val.password)){ //username和password都正确
                    let data = { //token包含的数据
                         userId:val._id,
                         username:val.username,
                         nickname:val.nickname,
                         gender:val.gender
                    }
                    let jwt = new Jwt(data,"user-secret") //实例化Jwt类
                    let token = jwt.generToken() //调用jwt的生成token的方法
                    ctx.body = {code:200,data:{token}}
               }else if(val && (password !== val.password)){
                    ctx.body = {code:100,msg:"密码错了哦"}
               }else if(!val){
                    ctx.body = {code:100,msg:"该账户不存在哦"}
               }
          })
         .catch((err) => {
              ctx.body = {code:100,msg:"服务器过累啦，稍候再试"}
          })
})
```

- 测试成功
   - ![深度截图_选择区域_20201109083951.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604882395027-93eb49e9-69a8-4ebf-ae43-b43aae8e5629.png#align=left&display=inline&height=390&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201109083951.png&originHeight=733&originWidth=697&size=74307&status=done&style=none&width=371)
<a name="QmEcR"></a>
#### 设置跨域

- 因为当前koa的端口在3030，react前端的端口在3000,出现跨域，需要后端设置CROS解决
- koa设置跨域
   - 直接使用koa-cors实现
   - npm i koa-cors
   - ![深度截图_选择区域_20201109172533.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604913937994-a3093f90-e249-4488-b108-d212fae2b9e1.png#align=left&display=inline&height=43&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201109172533.png&originHeight=43&originWidth=459&size=6766&status=done&style=none&width=459)
   - ![深度截图_选择区域_20201109172542.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1604913947396-8b0bd76e-698c-448c-aa6a-55ab27560865.png#align=left&display=inline&height=83&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201109172542.png&originHeight=83&originWidth=425&size=12744&status=done&style=none&width=425)
   - 注意中间件设置顺序问题
<a name="vnk7S"></a>
#### 目前的index.js
```javascript
const Koa = require("koa")
const cors = require("koa-cors")
const router = require("./routes/router")//装载了众多子路由的router.js
const Jwt = require("./utils/jwt") //jsonwebtoken的生成与验证
const tokenVerify = require("./utils/tokenVerify")
const db = require("./database/connect")//mongodb数据库的连接操作
const {UserModel, } = require("./database/schema&model")//mongoose的schema和model

const app = new Koa()
app.use(cors()) //允许全部跨域
//app加载路由中间件
app.use(router.routes(),router.allowedMethods())
//-------------重要代码start---------------------
//token测试
// let jwt = new Jwt({username:"ttttjh",password:"tttjh"},"Hello Token")
// let token = jwt.generToken()
// console.log(token)
// let result = jwt.verifyToken(token)
// console.log(result)
//-------------重要代码end---------------------
//连接数据库
db.connect()
    .then(val => {
        console.log(val)
    })
    .catch(err => {
        console.log(err)
    })
//-------------重要代码start---------------------
app.use((ctx,next) => tokenVerify(ctx,next)) //启用编写的token验证中间件
//-------------重要代码end---------------------

app.listen(3030)
console.log("koa2 running in 3030!!!")
```
<a name="8e191"></a>
#### 现在应该去编写login和register的ui界面。☝☝☝
<a name="42ACt"></a>
#### 编写/user/getInfo路由

- 该路由用于返回用户信息
- 通过前端请求头中传递过来的token来进行token解析，里面包含有用户信息，主要看token有没有过期。
- **注意开启token验证中间件**
   - new-wall/server/index.js
   - ![深度截图_选择区域_20201118151121.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1605683496470-cbf5aa2e-1fb6-48d7-b8af-6567e0e4795c.png#align=left&display=inline&height=119&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201118151121.png&originHeight=119&originWidth=975&size=24921&status=done&style=none&width=975)
   - new-wall/server/utils/tokenVerify.js
   - ![深度截图_选择区域_20201118151240.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1605683565537-e9d24eae-58b3-48d8-9906-557a1282cfef.png#align=left&display=inline&height=385&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201118151240.png&originHeight=854&originWidth=1078&size=128026&status=done&style=none&width=486)
- **new-wall/server/routes/user.js**
   - 没有使用UserModel，总感觉之后还会改。
   - ![深度截图_选择区域_20201117223155.png](https://cdn.nlark.com/yuque/0/2020/png/286208/1605623569551-5654df58-6066-4bcc-8a09-87fb7860836e.png#align=left&display=inline&height=324&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20201117223155.png&originHeight=415&originWidth=723&size=55780&status=done&style=none&width=564)
<a name="E9txP"></a>
#### 编写用户头像上传接口

- 芜湖
- 这里我们使用到的一个模块叫做multiparty,用于图片的接收
- 该接口需要进行token验证，前端使用antd的图片上传，在Uploads组件的props中设置了headers的token字段进行token携带
- 图片存放路径为__dirname+"/uploads"
- 这里还需要设koa的静态文件目录，使用到了koa-static模块，本来想用nodejs的方式直接写出一个koa中间件来作为图片服务器路由，但是有问题，所以直接使用了koa-static进行静态目录设置
   - new-wall/server/index.js
   - ![深度截图_选择区域_20210306165138.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615020725026-538dc95e-725a-41c8-a643-9e3185a97380.png#align=left&display=inline&height=248&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210306165138.png&originHeight=248&originWidth=1045&size=64699&status=done&style=none&width=1045)
   - 这样就可以实现了http://localhost:3030/xxx.png来访问server项目的uploads目录下的图片了
      - ![深度截图_选择区域_20210306173228.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615023164596-f235cea6-500a-480b-aabe-9172e1055168.png#align=left&display=inline&height=185&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210306173228.png&originHeight=305&originWidth=783&size=19351&status=done&style=none&width=474)
- 在接受图片完毕后获取图片的名称进行数据库内的用户的avatar字段更新
- 此处的avatar接口仍存在问题，无论怎样都会返回code:200,msg:success,后续需要修改
- new-wall/server/routes/user.js
   - 主要的avatar部分
   - ![深度截图_选择区域_20210306174503.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615023922150-3b16122c-ee4e-4e8a-a25a-b76d6f263815.png#align=left&display=inline&height=768&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210306174503.png&originHeight=768&originWidth=1426&size=135782&status=done&style=none&width=1426)
```javascript
//-----------------user子路由模块-----------------------
const Router = require("koa-router")
const md5 = require("md5")//md5包用于password字段加密
const koaBodyParser = require("koa-bodyparser")//post传递数据解析中间件
const fs = require("fs")//nodejs的文件模块
const multiparty = require("multiparty")//解析文件上传模块
const util = require("util")//工具模块
const Jwt = require("../utils/jwt")
const {UserModel,} = require("../database/schema&model")//导入Model对象

const user = new Router()
user.use(koaBodyParser())
//--------------获取用户个人信息路由--------------------
user.get("/getInfo",async (ctx) => {
    let {token} =  ctx.request.headers
    let jwt = new Jwt()//实例化一个jwt对象来进行token验证
    let tokenVerifyResult = jwt.verifyToken(token)
    if(tokenVerifyResult.code == 200){//token验证通过
        //数据库查询
        await UserModel.findOne({"username":tokenVerifyResult.data.username})
            .then(val => {
                let userInfo = {
                    userId:val._id,
                    username:val.username,
                    nickname:val.nickname,
                    gender:val.gender,
                    avatar:val.avatar,
                    tags:val.tags
                }
                ctx.body = {code:200,data:userInfo}
            })
    }else{//token验证失败
        ctx.body = {code:100,msg:"token验证失败"}
    }
})

//--------------用户登入路由--------------------
user.post("/login",async (ctx) => {
     let {username,password} = ctx.request.body
     password = md5(password)
     //数据库查询
     await UserModel.findOne({"username":username})
         .then(val => {
               if(val && (password === val.password)){ //username和password都正确
                    let data = {
                         userId:val._id,
                         username:val.username,
                         nickname:val.nickname,
                         gender:val.gender,
                        avatar:val.avatar,
                         tags:val.tags
                    }
                    let jwt = new Jwt(data,"user-secret")
                    let token = jwt.generToken()
                    ctx.body = {code:200,data:{token}}
               }else if(val && (password !== val.password)){
                    ctx.body = {code:100,msg:"密码错了哦"}
               }else if(!val){
                    ctx.body = {code:100,msg:"该账户不存在哦"}
               }
          })
         .catch((err) => {
             console.log(err)
              ctx.body = {code:100,msg:"服务器过累啦，稍候再试"}
          })
})

//--------------测试路由--------------------
user.get("/images",async (ctx) => {
    console.log("/images被访问")
    ctx.body = ["people1","people1","people2","people2","people3","people3"]
})

//--------------用户注册路由-------------------------
user.post("/register",async (ctx) => {
     let {username,password,nickname,gender} = ctx.request.body
     let user = new UserModel({
          username,
          password:md5(password),//进行字段加密
          nickname,
          gender
     })
     //这里使用Model.save()的Promise链式调用方法，因为回调函数的写法在函数内部无法进行ctx.body使得路由返回结果为not found
     await user.save()
         .then((val) => {
              console.log(val)
              let data = {
                   userId:val._id,
                   username:val.username,
                   nickname:val.nickname,
                   gender:val.gender,
                  avatar:"",
              }
              let jwt = new Jwt(data,"user-secret")
              let token = jwt.generToken()
              ctx.body = {code:200,data:{token}}
          })
         .catch(() => {
              ctx.body = {code:100,msg:"服务器暂停营业，请稍候"}
         })
})

//---------------用户名检查路由----------------------
user.post("/username_check",async (ctx) => {
     let {username} = ctx.request.body
     //进行数据库操作
     await UserModel.findOne({"username":username})
         .then(val => {
             if(!val){
                 ctx.body = {code:200,msg:"该用户名可以使用"}
             }else{
                 ctx.body = {code:100,msg:"该用户名已经被注册,换一个吧"}
             }
         })
         .catch(err => {
             ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
         })
})

//----------------昵称检查------------------------
user.post("/nickname_check",async (ctx) => {
     let {nickname} = ctx.request.body
     await UserModel.findOne({"nickname":nickname})
         .then(val => {
             if(!val){
                 ctx.body = {code:200,msg:"该昵称还没被使用，快注册！"}
             }else{
                 ctx.body = {code:100,msg:"这个好听的昵称已经被人抢先注册啦！"}
             }
         })
         .catch(err => {
             ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
         })
})

//------------头像上传路由-------------------
user.post('/avatar',async (ctx,next) => {
    //token解析操作
    let {token} =  ctx.request.headers
    let jwt = new Jwt()//实例化一个jwt对象来进行token验证
    let userInfo = jwt.verifyToken(token).data
    //multiparty模块的使用
    let form = new multiparty.Form({uploadDir: './uploads'})
    form.parse(ctx.req, async (err,fields,files) => {
        if(err) {
            ctx.body = {code:100,msg:"上传失败!"}
        }
        let imageName = files.file[0].path.split("/")[1]
        //进行数据库更新
        await UserModel.findByIdAndUpdate(userInfo.userId,{avatar: imageName},(err,doc) => {
            if(err) throw err
        })
    })
    ctx.body = {code:200,msg:"成功上传:)"}
});
//-----------子路由导出----------------------
module.exports = user
```
<a name="hgvDF"></a>
#### 编写增加/减少tag的路由

- 该路由需要携带token来访问，所以在tokenVerify中进行路由添加
   - ![深度截图_选择区域_20210308170940.png](https://cdn.nlark.com/yuque/0/2021/png/286208/1615194599083-0be691a4-632a-460e-bed4-75e79a3da922.png#align=left&display=inline&height=146&margin=%5Bobject%20Object%5D&name=%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20210308170940.png&originHeight=146&originWidth=1124&size=29599&status=done&style=none&width=1124)
- 该路由通过前端传递data来判断是tag的增加操作还是减少操作
```javascript
// 个性tag增删路由
user.post("/tag",async (ctx,next) => {
    //token解析
    let {token} =  ctx.request.headers
    let jwt = new Jwt()//实例化一个jwt对象来进行token验证
    let userInfo = jwt.verifyToken(token).data
    let query = ctx.request.body //post数据获取
    if(query.addTagValue){
        //增加tag操作
        //数据库操作
        await UserModel.findById(userInfo.userId)
            .then(async val => {
                let {tags} = val
                tags.push(query.addTagValue)
                await UserModel.findByIdAndUpdate(userInfo.userId,{tags},(err,doc)=>{
                    if(err){
                        ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
                    }else{
                        ctx.body = {code:200,msg:"添加成功"}
                    }
                })
            })
            .catch((err) => {
                ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
            })
    }else{
        //删除tag操作
        //数据库操作
        await UserModel.findById(userInfo.userId)
            .then(async val => {
                let {tags} = val
                tags.splice(query.delTagIndex,1)
                await UserModel.findByIdAndUpdate(userInfo.userId,{tags},(err,doc)=>{
                    if(err){
                        ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
                    }else{
                        ctx.body = {code:200,msg:"删除成功"}
                    }
                })
            })
            .catch((err) => {
                ctx.body = {code:100,msg:"服务器出错🚫🚫🚫"}
            })
    }

})
```
