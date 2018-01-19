import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


// 导入模块
import { Button, Icon } from "antd"
import Login from './index'
import HasLogin from './HasLogin'
import RegistShow from 'components/RegistShow'


import './Login.less'

import * as ACTION from 'actions/login';
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION }, dispatch)
)
class ChildLogin extends Component {
    constructor(props, context){
        super(props);
    }
    componentWillMount(){

    }
    render() {
        const { login } = this.props.state
        return (
            <div className="login-box">
                {
                    !login.result.token ?
                        <div>
                            <div className="login-box-hd">
                                <RegistShow onClick={() => this.props.toggleRegistDialog(true)} className="show-regist" />
                                <span className="login-box-tt">用户登录</span>
                            </div>
                            <div className="login-box-bd">
                                <Login/>
                            </div>
                        </div>
                    :
                        <HasLogin/>
                }
            </div>
        )
    }
}

export default ChildLogin