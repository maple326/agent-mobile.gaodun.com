import React, { Component } from 'react';

// 导入多个模板
import LoginByIdNumber from './LoginByIdNumber'
import Model2 from './Model2'

/**
 * login 模块
 */
class Login extends Component {
    constructor(props, context) {
        super(props);
    }
    componentWillMount() {

    }
    /**
     * 通过props 获取不同的model
     * 默认 LoginByIdNumber
     * 
     */
    getLoginModel() {
        const { model } = this.props
        switch (model) {
            case 1:
                return <LoginByIdNumber />
                break;
            case 2:
                return <Model2 />
                break;

            default:
                return <LoginByIdNumber />
                break;
        }
    }
    render() {
        let Model = this.getLoginModel()
        return Model
    }
}

export default Login