import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Menu } from 'antd'

class MemberLeftMenu extends Component {
    constructor(props, context) {
        super(props,context);
    }
    componentWillMount() {
    }
    componentDidMount(){
    }
    render() {
        let {location} = this.props;
        var keyvalue = location.pathname=='/member/payfor'?"/member/activetrain":location.pathname;

        return (
            <Menu
                style={{ width: 200 }}
                selectedKeys={[keyvalue]}
                theme='dark'
            >   
                <Menu.Item key="/member/activetrain"><Link to="/member/activetrain">激活培训</Link></Menu.Item>
                <Menu.Item key="/member/courselearn"><Link to="/member/courselearn">课程学习</Link></Menu.Item>
                <Menu.Item key="/member/selectcourse"><Link to="/member/selectcourse">选择课程</Link></Menu.Item>
                <Menu.Item key="/member/finalexam"><Link to="/member/finalexam">终极测试</Link></Menu.Item>
                <Menu.Item key="/member/personinfo"><Link to="/member/personinfo">个人信息</Link></Menu.Item>
            </Menu>
        )
    }
}

export default MemberLeftMenu