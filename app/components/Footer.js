import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'antd'

class Footer extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            data: {}
        }
    }
    componentWillMount() {
        
    }
    render() {
        return (
            <div className="footer">
                <Row className="footer-bd">
                    <Col span={16}>
                        <a href='http://www.gaodun.cn/' target='_block'>高顿财经</a>&nbsp;&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href='http://www.gaodun.com/' target='_block'>高顿网校</a>&nbsp;&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href='http://www.gaodun.com/' target='_block'>高顿财税学院</a>&nbsp;&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to='/about'>关于我们</Link>&nbsp;&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to='/collaborate'>商务合作</Link>&nbsp;&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to='/contact'>联系我们</Link>
                    </Col>
                    <Col span={8}>Copyright@2006-2017 高顿继续教育 All Rights Reserved</Col>
                </Row>
            </div>
        )
    }
}

export default Footer;