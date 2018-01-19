import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as welcomeAction from '../../actions/welcome';
import { browserHistory } from 'react-router'

import { Form, Button, Row, Col, Input, Select, Modal } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import './RegistDialog.less';


import * as userinfoAction from 'actions/userinfo';
import * as ACTION from 'actions/login';
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION, ...userinfoAction }, dispatch)
)
class RegistrationForm extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            registLoading: false
        }
    }

    componentWillMount() {
        this.props.getCaptcha()
    }

    handleRegist = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    registLoading: true
                })
                const { captcha } = this.props.state
                const { agencyinfo } = this.props.state.childReducer
                let addObj = {
                    captcha_id: captcha.captcha_id,
                    agency_id: agencyinfo.pkid,
                    province_id: agencyinfo.province_id,
                    city_id: agencyinfo.city_id
                }
                let obj = Object.assign({}, values, addObj)

                this.props.getRegist(obj).then((data) => {
                    this.setState({
                        registLoading: false
                    })
                    const { status, info, result} = data.action.payload
                    
                    // 如果验证码错误
                    if (status == '553713922') {
                        this.props.getCaptcha()
                    }
                    // 如果报错
                    if (!status) {
                        this.props.toggleRegistDialog(false)
                        this.props.getUserinfo()
                        Modal.success({
                            title: '温馨提示',
                            content: info
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
    // 验证用户名唯一性
    handleIdNumber = (rule, value, callback) => {
        const { agencyinfo } = this.props.state.childReducer
        this.props.checkUniqueness({
            agency_id: agencyinfo.pkid,
            id_number: value
        }).then((data)=> {
            let { status, info } = data.action.payload
            if ( !status ) {
                callback()
            }else {
                callback(info)
            }
        })
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        // callback()
    }
    handleMobile = (rule, value, callback) => {
        const { agencyinfo } = this.props.state.childReducer
        this.props.checkUniqueness({
            agency_id: agencyinfo.pkid,
            mobile: value
        }).then((data) => {
            let { status, info } = data.action.payload
            if (!status) {
                callback()
            } else {
                callback(info)
            }
        })
    }

    render() {
        const { registLoading } = this.state
        const { captcha, childReducer } = this.props.state
        const { agencyinfo } = childReducer
        const { getFieldDecorator } = this.props.form
        return (
            <Form
                className="registform"
                onSubmit={this.handleRegist}
            >
                <Row gutter={40}>
                    <Col span="12">
                        <p>用户姓名</p>
                        <FormItem hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true,
                                    // pattern: /(^[\\u4e00-\\u9fa5]{2,10}$)/,
                                    whitespace: true,
                                    message: '请输入您的姓名'
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <p>手机号码</p>
                        <FormItem hasFeedback>
                            {getFieldDecorator('mobile', {
                                validateFirst: true,
                                rules: [{
                                    required: true,
                                    pattern: /(^[1]{1}[\d]{10}$)/,
                                    message: '请输入您的手机号码'
                                },
                                {
                                    validator: this.handleMobile
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <p>用户身份证号</p>
                        <FormItem hasFeedback>
                            {getFieldDecorator('id_number', {
                                validateFirst: true,
                                rules: [{ 
                                    required: true,
                                    pattern: /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|[xX])$)/,
                                    // pattern: /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|[xX])$)/,
                                    // pattern: /(^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$)/, 
                                    message: '请输入您的身份证号码'
                                },{
                                    validator: this.handleIdNumber
                                }]
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <p>所属行政区</p>
                        <FormItem hasFeedback>
                            {getFieldDecorator('county_id', {
                                rules: [{ required: true, message: '请选择所属行政区' }],
                                initialValue: agencyinfo.county_list[0].region_id
                            })(
                                <Select>
                                    {agencyinfo.county_list.map((county, key) => (
                                    <Option key={key} value={county.region_id}>{county.region_name}</Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                        {/* <div className="regist-form-notice">注：请登录“河北财政信息网 - 会计人员信息验证”中查看所属的“行政区划”</div> */}
                    </Col>
                    <Col span="12">
                        <p>填写验证码</p>
                        <FormItem hasFeedback>
                            {getFieldDecorator('captcha', {
                                rules: [{ required: true, message: '请输入验证码' }],
                            })(
                                <Input />
                                )}
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <img className="verifcodeimg" onClick={() => this.props.getCaptcha()} src={captcha.image_data} />
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <Button className="regist-form-button" htmlType="submit" type="primary" loading={registLoading}>注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm