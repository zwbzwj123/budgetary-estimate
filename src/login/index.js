import React from 'react';

import {Fetch} from "../fetch";
import './login.scss';


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRegister: false
    }
  }

  login() {
    if (this.state.showRegister) {
      // 注册
      if (this.refs.name.value === '' || this.refs.password.value === '') {
        alert('请输入账号和密码！');
        return;
      } else if (this.refs.code.value === '') {
        alert('请输入邀请码！');
        return;
      }
      Fetch.register(this.refs.name.value, this.refs.password.value, this.refs.code.value, (data) => {
        if (data === 'false') {
          alert('邀请码不正确，请重新输入！')
        } else if (data === '用户名已存在！') {
          alert(data)
        } else {
          window.sessionStorage.setItem("name", this.refs.name.value);
          window.sessionStorage.setItem("password", this.refs.password.value);
          window.sessionStorage.setItem("factorDate", 'null');
          window.location.href = window.location.origin + "/home"
        }
      })
    } else {
      // 登录
      if (this.refs.name.value === '' || this.refs.password.value === '') {
        alert('请输入账号和密码！');
        return;
      }
      Fetch.login(this.refs.name.value, this.refs.password.value, (data) => {
        if (data === 'false') {
          alert('账号密码不正确，请重新输入！')
        } else {
          window.sessionStorage.setItem("name", this.refs.name.value);
          window.sessionStorage.setItem("password", this.refs.password.value);
          window.sessionStorage.setItem("factorDate", data.split(';')[0]);
          if (data.split(';')[1] === 'true') {
            window.sessionStorage.setItem("isRoot", true);
          }
          window.location.href = window.location.origin + "/home"
        }
      });
    }
  }

  register() {
    this.setState({
      showRegister: !this.state.showRegister
    })
  }

  render() {
    return (
      <div className="login">
        <div className="submit-form">
          <header className="form-header">燕山石化</header>
          <label>
            <input type="text" ref="name" className="form-control  "
                   autoComplete="off" placeholder="请输入账号"/>
            <input type="password" ref="password" className="form-control  "
                   autoComplete="off" placeholder="请输入密码"/>
            {
              this.state.showRegister ?
                <input type="text" ref="code" className="form-control  "
                       autoComplete="off" placeholder="请输入邀请码"/> : ''
            }
          </label>
          <div className="register-btn" onClick={() => this.register()}>{!this.state.showRegister ? '注册' : '去登录'}</div>
          <div className="confirm-login" onClick={() => this.login()}>{this.state.showRegister ? '注册' : '登录'}</div>
        </div>
      </div>
    );
  }
}