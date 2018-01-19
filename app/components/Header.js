import React, { Component } from 'react'
import {BrowserRouter, HashRouter,Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import pubsub from 'util/Pubsub';


import { Row, Col, Menu, Dropdown, Avatar, Icon, Modal } from 'antd';
import LoginDialog from 'components/LoginDialog'
import RegistDialog from 'components/RegistDialog'
import RegistShow from 'components/RegistShow'


import * as ACTION from 'actions/userinfo';
import * as ACTION_login from 'actions/login';
@connect(
    (state) => { return { state } },
    (dispatch) => bindActionCreators({ ...ACTION, ...ACTION_login }, dispatch)
)
class Header extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            key: "1",
            isMain: true,
            showLogin: false,
            showRegist: false,
            ifMustLogin: false
        }
    }

    componentWillMount() {
        this.initIfMain();

        // 这他喵是从util/eduAxios那边发过来的
        // 如果登录过期或者需要登录的话就。。。。
        pubsub.subscribe('login', (bool) => {
            this.props.toggleLoginDialog(true)
            this.setState({
                ifMustLogin: true
            })
        })
    }
    closeLoginModal() {
        let { ifMustLogin } = this.state
        this.props.toggleLoginDialog(false)
        if ( ifMustLogin ) {
            const modal = Modal.warning({
                title: '登录失败',
                content: '您已取消登录，即将返回首页！',
                onOk: ()=> {
                    this.setState({
                        ifMustLogin: true
                    })
                    hashHistory.push('/')
                }
            });
        }
        
    }
    getCurrentKey() {
        let { hash } = new BrowserRouter().history.location;
        let key = "1"
        if (hash.indexOf('member') > -1) {
            key = "3"
        } else if (hash.indexOf('course') > -1) {
            key = "2"
        }

        return key
    }
    initIfMain() {
        let host = location.host
        let ifNew = host.indexOf("new-jxjy") > -1
        let env = ifNew ? host.split("new-jxjy")[0] : host.split("jxjy")[0]

        if (env != 'dev-' && env != 't-' && env != 'pre-' && env != '') {
            this.setState({ isMain: false})
        }

    }
    handleClick = (e) => {
        this.setState({
            key: e.key,
        });
    }
    render() {
        const menuKey = this.getCurrentKey()
        const { isMain } = this.state
        const { userinfo, login } = this.props.state
        const { showLogin, showRegist } = login
        const menu = (
            <Menu className="userMenu">
                <Menu.Item>
                    <span onClick={() => this.props.getLogout()}>退出</span>
                </Menu.Item>
            </Menu>
        );
        const headerMenu = (
            <Menu
                className="menu"
                theme="light"
                onClick={this.handleClick}
                selectedKeys={[menuKey]}
                mode="horizontal"
                style={{ lineHeight: '78px' }}
            >
                <Menu.Item key="1"><Link to="/">首&nbsp;&nbsp;页</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/course">全部课程</Link></Menu.Item>
                {(!isMain && login.result.token) ? <Menu.Item key="3"><Link onClick={this.goIntoMember} to="/member/activetrain">个人中心</Link></Menu.Item> : ''}
            </Menu>
        );
        return (
            <div className="header">
                <div className="header-bd">
                    <Row>
                        <Col span={12}>
                            <a href='http://jxjy.gaodun.com'>
                                <div className="logo"><img src={require("assets/images/logo.png")} /></div>
                            </a>
                        </Col>
                        <Col span={8}>
                            {headerMenu}
                        </Col>

                        <Col span={4}>
                            {!isMain ? 
                                (
                                    login.result.token ? 
                                        <Dropdown overlay={menu} placement="bottomRight">
                                            <span className="ant-dropdown-link" style={{ float: 'right' }}>
                                                <Avatar className="avatar-img" icon="user" src={userinfo.student ? userinfo.student.avatar : ''} />
                                                <Icon type="caret-down" style={{ fontSize: 12, color: '#fff' }} />
                                            </span>
                                        </Dropdown> 
                                    : 
                                        <a href="javascript:;" onClick={() => this.props.toggleLoginDialog(true)} className="login-or-regist">登录</a>
                                )
                                : ''
                            }
                        </Col>
                    </Row>
                </div>

                <Modal
                    className="login-Dialog"
                    title={<div>
                            <RegistShow onClick={() => (this.props.toggleLoginDialog(false), this.props.toggleRegistDialog(true))} className="Dialog-hd-right"/>
                            <span className="login-title">用户登录</span>
                        </div>}
                    visible={showLogin}
                    okText="登录"
                    footer={null}
                    width={350}
                    wrapClassName="vertical-center-modal"
                    onCancel={() => this.closeLoginModal()}
                >
                    <LoginDialog />
                </Modal>

                <Modal
                    className="regist-Dialog"
                    title={<div>
                        <a onClick={() => (this.props.toggleRegistDialog(false), this.props.toggleLoginDialog(true))}
                                className="Dialog-hd-right" href="javascript:;">立即登录<Icon type="arrow-right" /></a>
                            <span className="regist-title">用户注册</span>
                        </div>}
                    visible={showRegist}
                    okText="注册"
                    footer={null}
                    width={670}
                    wrapClassName="vertical-center-modal"
                    onCancel={() => this.props.toggleRegistDialog(false)}
                >
                    <RegistDialog />
                </Modal>
            </div>
        )
    }
}

export default Header;