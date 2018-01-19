import React, { Component } from 'react';
import { Button, Menu } from 'antd'
import Banner from '../../components/Banner'
import Activetrain from './Activetrain'
import Courselearn from "./Courselearn";
import Selectcourse from "./Selectcourse";
import Finalexam from "./Finalexam";
import Personinfo from "./Personinfo";
import "../../assets/css/Personcontent.less"
import { Tabs, Radio } from 'antd';

const TabPane = Tabs.TabPane;
import '../../../antd-theme'
import { Row, Col } from 'antd';
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

class Member extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            mode: 'left',
            active: '',
            child: ''
        }
    }

    handleModeChange = (e) => {

    }

    getChildComponent(key) {
        let Right
        if (key == '5') {
            Right = (
                <Personinfo />
            )
        } else if (key == '2') {
            Right = (
                <Courselearn name="Runoob" />
            )
        } else if (key == '3') {
            Right = (
                <Selectcourse />
            )
        } else if (key == '4') {
            Right = (
                <Finalexam />
            )
        } else {
            Right = (
                <Activetrain />
            )
        }
        return Right;
    }

    chosekey = (e) => {
        /*this.props.router.push({
            pathname: `${e}`
        })*/
        let child = this.getChildComponent(e);
        this.setState({
            child,
            mode: e
        });
    }

    componentWillMount() {
        let mode = this.props.params.id;
        let child = this.getChildComponent(mode);
        this.setState({
            child,
            mode
        })
    }

    componentDidMount() {
        // debugger
    }

    render() {
        return (
            <div>
                <Banner bgimg={require('assets/images/banner.jpg')} />
                <div className="Personcontent">
                    <div className="Perleft">
                        <Radio.Group onChange={this.handleModeChange} value={'left'} style={{ marginBottom: 8 }}>
                            {/*<Radio.Button value="top">Horizontal</Radio.Button>*/}
                            {/*<Radio.Button value="left">Vertical</Radio.Button>*/}
                        </Radio.Group>
                        <Tabs
                            defaultActiveKey="1"
                            tabPosition={'left'}
                            onTabClick={this.chosekey}
                        >
                            <TabPane tab="激活培训" key="1"></TabPane>
                            <TabPane tab="课程学习" key="2"></TabPane>
                            <TabPane tab="选择课程" key="3"></TabPane>
                            <TabPane tab="终极测试" key="4"></TabPane>
                            <TabPane tab="个人信息" key="5"></TabPane>
                        </Tabs>
                    </div>
                    <div className="Perright" key={this.state.mode}>
                        {this.state.child}
                    </div>
                </div>
            </div>
        )
    }
}

export default Member
