import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Link } from 'react-router-dom'
import {Button} from 'antd'

//组件
import Sidemenu from './components/Sidemenu/sidemenu'
import Main from './components/Main/main'
import Login from './components/User/Login/login'
import Register from './components/User/Register/register'
import CardDetail from './components/Carddetail/carddetail'

import './index.less';

ReactDOM.render(
  // <React.StrictMode>
  <div className="container">
      <Router  className="Index">
          {/* <Header/> */}
          {/* <Sidemenu/> */}
          <Route path="/" exact component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register}/>
          
      </Router>
  </div>,
  // </React.StrictMode>,
  document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
