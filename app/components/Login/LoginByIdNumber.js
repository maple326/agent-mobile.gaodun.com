import React, {Component} from 'react';
import {HashRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Form, Input, Button, Row, Col, message} from 'antd';

const FormItem = Form.Item;
import * as userinfoAction from 'actions/userinfo';
import * as loginAction from 'actions/login';
import {stringify, parse} from 'query-string';

let hashHistory = new HashRouter().history;

@connect(
    (state) => {
        return {state}
    },
    (dispatch) => bindActionCreators({...loginAction, ...userinfoAction}, dispatch)
)
class NormalLoginForm extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            loginLoading: false,
            userName: '',
            showCaptcha: false
        }
    }

    handleSubmit = (e) => {
        let ret = parse(hashHistory.location.search)
        console.log(ret)
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { captcha, childReducer } = this.props.state
                values.captcha_id = captcha.captcha_id
                values.agency_id = childReducer.agencyinfo.pkid
                this.setState({
                    loginLoading: true
                })
                // 登录
                this.props.getLogin(values).then((data) => {
                    this.setState({
                        loginLoading: false
                    })
                    const { info, status, result, } = data.action.payload
                    // 如果验证码错误
                    if (status == '553713922') {
                        this.getCaptchaFun()
                    }

                    // 如果报错
                    if (!status) {
                        this.props.toggleLoginDialog(false)
                        this.props.getUserinfo().then(() => {
                            let objSearch = parse(hashHistory.location.search)
                            objSearch.vistion = Date.now();
                            let strSearch = stringify(objSearch)
                            hashHistory.replace(hashHistory.location + '?' + strSearch)
                        })
                    } else {
                        this.props.form.setFields({
                            [result.error]: {
                                value: values[result.error],
                                errors: [new Error(info)]
                            }
                        });
                    }
                })
            }
        });
    }

    componentWillMount() {
        console.log(new HashRouter)
    }

    /**
     * 获取验证码并显示
     */
    getCaptchaFun() {
        this.props.getCaptcha().then((data) => {
            this.setState({
                showCaptcha: true
            })
        })
    }

    nameOnblur(t) {
        const name = this.props.form.getFieldValue('name')

        this.props.getDisplaycaptcha({name}).then((data) => {
            const {info, status, result} = data.action.payload

            // 确认需要显示验证码
            if (!!status) {
                this.getCaptchaFun();
            }else {
                this.setState({
                    showCaptcha: false
                })
            }
        })

    }

    render() {
        const { loginLoading, showCaptcha, userName } = this.state
        const { captcha} =  this.props.state
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <p className="title-p">用户姓名</p>
                <FormItem hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, 
                            // pattern: /(^[\\u4e00-\\u9fa5]{2,10}$)/,
                            whitespace: true,
                            message: '请输入您的姓名'
                        }],
                        setFieldsValue: userName
                    })(
                        <Input placeholder="姓名" onBlur={() => this.nameOnblur(this)}/>
                    )}
                </FormItem>

                <p className="title-p">用户身份证号</p>
                <FormItem hasFeedback>
                    {getFieldDecorator('id_number', {
                        rules: [{
                            required: true,
                            pattern: /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|[xX])$)/,
                            // pattern: /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|[xX])$)/,
                            // pattern: /(^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$)/, 
                            message: '请输入正确身份证号' }],
                    })(
                        <Input placeholder="身份证号"/>
                    )}
                </FormItem>

                {
                    showCaptcha ?
                    (<div>
                        <p className="title-p">填写验证码</p>
                        <FormItem>
                        <Row>
                            <Col span={14}>
                                {getFieldDecorator('captcha', {
                                        rules: [{ required: true, message: '请输入验证码' }]
                                    })(
                                        <Input placeholder="验证码"/>
                                    )}
                            </Col>
                            <Col span={10}>
                                    <img className="verifcodeimg" src={captcha.image_data} onClick={() => this.getCaptchaFun()}/>
                            </Col>
                        </Row>
                    </FormItem></div>
                    )
                    :''
                }
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loginLoading}>登&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
                </FormItem>
            </Form>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm