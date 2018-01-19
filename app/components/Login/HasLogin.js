import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import { Avatar, Button } from 'antd';


import * as ACTION from 'actions/login';
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION }, dispatch)
)
class HasLogin extends Component {
    constructor(props, context) {
        super(props);
    }
    componentWillMount() {

    }
    handleLogout() {
        this.props.getLogout();
    }
    render() {
        const { userinfo } = this.props.state
        return (
            <div className="login-hasLogin">
                <div className="login-box-hd">
                    <span className="login-box-tt">用户登录</span>
                </div>
                <div className="login-box-bd">
                    <Avatar className="hasLogin-img" icon="user" src={userinfo.student ? userinfo.student.avatar : ''}/>
                    <p className="hasLogin-p1">亲爱的学员：{userinfo.student ? userinfo.student.name : 'XXX'}，您好！</p>
                    <p className="hasLogin-p2">您已成功登录，祝您学习愉快！</p>
                    <div className="hasLogin-btns">
                        <Link to={`/member/activetrain`}>
                            <Button type="primary">进入学习</Button>
                        </Link>
                        <Button onClick={() => this.handleLogout()}>退出登录</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default HasLogin