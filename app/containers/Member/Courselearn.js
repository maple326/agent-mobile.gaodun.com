import React, {Component} from 'react';
import {
    Tabs,
    Row,
    Col,
    Table,
    Tag,
    Button,
    Checkbox,
    Modal
} from 'antd';
const TabPane = Tabs.TabPane;
const CheckableTag = Tag.CheckableTag;
import { Link } from 'react-router-dom'
import Blank from '../../components/Blank'

//引入redux

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as memberAction from 'actions/member';

function matchStateToProps(state) {
    //...
    return {state}
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        ...memberAction
    }, dispatch)
}
@connect(matchStateToProps, matchDispatchToProps)
class Courselearn extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            str: '',
            data: {},
            tit: [],
            Chosetab: '0', //tab切换
            active: [],
            history: [],
            activeTit: [],
            activeCon: [],
            historyTit: [],
            historyCon: [],
            flag: 0, //标记 是第一次刷新页面还是点击以后重新显示的 页面
            pagination: false,
            performance: [
                {
                    title: '课程名称',
                    dataIndex: 'course_name',
                    key: 'course_name'
                }, {
                    title: '课程类别',
                    dataIndex: 'group_name',
                    key: 'group_name'
                }, {
                    title: '学分',
                    dataIndex: 'course_score',
                    key: 'course_score'
                }, {
                    title: '学习时长',
                    dataIndex: 'learn_time',
                    key: 'learn_time'
                }, {
                    title: '课程时长',
                    dataIndex: 'total_minute',
                    key: 'total_minute'
                }
            ]

        }
    }

    componentWillMount() {
        let token = this.props.state.login.result.token;
        let {flag} = this.state;
        this
            .props
            .getCourseData({token: token})
            .then((res) => {
                //active = null返回时
                if (res.value.result.active == null) {
                    this.setState({active: [], activeTit: [], activeCon: []})
                } else { //active 是有内容的数据
                    let arr = []
                    for (let i in res.value.result.active) {
                        arr.push(res.value.result.active[i])
                    }
                    this.setState({active: arr})
                    if (flag == 0) { // 首次进入页面时页面显示
                        this.setState({activeTit: this.state.active[flag], activeCon: this.state.active[flag].list})
                    }
                }
                //history = null时
                if (res.value.result.history == null) {
                    this.setState({history:[]})
                } else {
                    this.setState({history: res.value.result.history})
                }

            })

    }
    handleChange(key, checked, e) {
        this.setState({
            Chosetab: key, //控制选择的下表 ，唯一值
            activeTit: this.state.active[key],
            activeCon: this.state.active[key].list
        })
    }
    doTopic(cid) {
        console.log(cid);
        window.location.href = '/#/course/exam/exercise?cid=' + cid
    }
    info2(list) {
        let examtime = this.state.performance;
        console.log(list)
        const {pagination} = this.state;
        Modal.info({title: "", width: 1000, iconType: "", content: (
                <div>
                    <Table
                        columns={examtime}
                        dataSource={list}
                        bordered={true}
                        pagination={pagination}/>
                </div>
            ), onOk() {}})
        Modal.iconType("")
    }
    render() {

        const {
            title,
            cont,
            str,
            Chosetab,
            active,
            activeTit,
            activeCon,
            history
        } = this.state;
        const Name = ''
        return (
            <div key={2}>
                <div className="Courselearn">
                    <div className="Learntit">
                        课程学习
                    </div>
                    <Blank
                        blank={active.length == 0}
                        doflag={true}
                        getText="你还没有可学习的课程 先去选择课程吧"
                        getGo="去选课">
                        <div className="Learntab">
                            培训年度 {active.map((item, key) => (
                                <CheckableTag
                                    key={key}
                                    className="Selecttab"
                                    checked={Chosetab == key}
                                    onChange={checked => this.handleChange(key, checked)}
                                    onClick={checked => this.getMessage(e)}>
                                    <span>{item.year}年</span>
                                </CheckableTag>

                            ))}
                        </div>

                        <div className="Learn_head">

                            <Row gutter={24}>
                                <Col className="learn_class" title={activeTit.training_name} span={6}>{activeTit.training_name}</Col>
                                <Col className="learn_score" span={4}>要求学分:<span>{activeTit.require_score}</span>
                                </Col>
                                <Col className="get_score" span={4}>获得学分:{activeTit.get_score}</Col>
                                <Col className="learn_time" span={10}>截止时间:{activeTit.close_time}</Col>
                            </Row>

                        </div>

                        <div className="Learn_con">
                            {activeCon.map((item, key) => (
                                <Row gutter={24} key={key} className="Learn_list">

                                    <Col className='name' span={6}>
                                        <span className="name_tit">{item.course_name}</span>
                                        <span className="name_con">讲师:{item.name}</span>
                                    </Col>
                                    <Col className='kind' span={3}>{item.group_name}</Col>
                                    <Col className='score' span={3}>{item.course_score}学分</Col>
                                    <Col className='subtime' span={4}>{item.learn_time}
                                        <span>/{item.total_minute}分钟</span>
                                    </Col>
                                    <Col span={4}>
                                        <Link
                                            to={`/course/detail/${item.course_id}?order_id=${item.order_id}&training_id=${item.training_id}`}>{item.isFinish
                                                ? <Button>已学完</Button>
                                                : <Button>去学习</Button>}</Link>
                                    </Col>
                                    <Col span={4}>
                                        <Button
                                            className="ant-btn-blue"
                                            disabled={item.is_quest
                                            ? false
                                            : true}
                                            onClick={() => this.doTopic(item.course_id)}>去做题</Button>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    </Blank>
                </div>
                {history.length == 0
                    ? ""
                    : <div className="Courselearnd">
                        <div className="Learntit">
                            历史记录
                        </div>
                        <div className="Learnd_head">
                            {history.map((item, key) => (
                                <Row gutter={24} key={key} className="history_data">
                                    <Col className="learn_class" span={6}>{item.training_name}</Col>
                                    <Col className="learn_score" span={4}>要求学分:<span>{item.min_score}</span>
                                    </Col>
                                    <Col className="get_score" span={4}>获得学分:{item.get_score}</Col>
                                    <Col className="learn_time" span={10}>课程有限期:{item.close_time}
                                        <Button type="gray" onClick={() => this.info2(item.list)}>全部课程
                                        </Button>
                                    </Col>
                                </Row>
                            ))}

                        </div>

                    </div>
}

            </div>
        )
    }
}
export default Courselearn