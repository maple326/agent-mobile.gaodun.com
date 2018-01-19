import React, {Component} from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import {bindActionCreators} from 'redux';
import * as exerciseAction from '../../../actions/exercise';
import './exercise.less';
import {Row, Col, Modal, Icon, Button} from 'antd'
import Clock from 'components/Clock/Clock'
import Card from 'components/Card'
import {saveAnswer, markExam} from 'api/course'
import {getQueryString} from 'util/util'

@connect(
    (state) => {
        return {
            state,
        }
    },
    (dispatch) => bindActionCreators({...exerciseAction}, dispatch)
)
class Examine extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            answer: ['A', 'B', 'C', 'D', 'E', 'F'],
            eid: '',
            endOfCountDown: false
        }
    }

    componentWillMount() {
        this.setExamId();
    }

    componentDidMount() {
        this.resetCardPostion();
    }

    setExamId() {
        let eid = getQueryString('eid') || 2;
        this.props.loadExamRoom(eid);
        this.setState({
            eid,
        })
    }

    answerClassName(type) {
        if (type == 1) {
            return 'eel_answer eel_circle'
        }
        return 'eel_answer eel_square'
    }

    answerTypeName(data, index) {
        if (index == 0) {
            if (data.useranswer.indexOf((index + 1) + '') > -1) {
                return 'check-circle'
            } else {
                return 'check-circle-o'
            }
        } else {
            if (data.useranswer.indexOf((index + 1) + '') > -1) {
                return 'close-circle'
            } else {
                return 'close-circle-o'
            }
        }
    }

    async selectAnswer(data, index) {
        // 单选题
        if (data.type == 1 || data.type == 3) {
            data.useranswer = [(index + 1) + ''];
        } else if (data.type == 2) {
            let position = data.useranswer.indexOf((index + 1) + '');
            if (position > -1) {
                data.useranswer.splice(position, 1)
            } else {
                data.useranswer.push((index + 1) + '');
            }
            data.useranswer = data.useranswer.sort();
        }
        this.props.updateExamRoom(data);
        await saveAnswer({
            content_id: data.pkid,
            question_id: data.question_id,
            exam_id: this.state.eid,
            user_answer: data.useranswer.join(',')
        });
        this.props.loadExamRoom(this.state.eid);
    }

    clickItem(o) {
        let element = document.querySelector(`.exercise_exam_list[qid="${o.question_id}"]`);
        let offsetTop = element.offsetTop;
        window.scrollTo(0, offsetTop + 140)
    }

    resetCardPostion() {
        let clockElement = document.querySelector('.exam_clock_box');
        let top = clockElement.offsetTop + 140;
        let autoInstance = '';
        window.onscroll = () => {
            clearTimeout(autoInstance);
            autoInstance = setTimeout(() => {
                if (window.scrollY > top) {
                    clockElement.setAttribute('class', 'exam_clock_box fixed');
                } else {
                    clockElement.setAttribute('class', 'exam_clock_box');
                }
            }, 100)
        }
    }

    onMarkStop() {
        let self = this;
        Modal.warning({
            title: '温馨提示',
            content: '考试时间到，请交卷!',
            okText: '交卷',
            onOk() {
                self.setState({
                    endOfCountDown: true
                }, () => {
                    self.markExam();
                })
            }
        });
    }

    preSubmit() {
        if (this.state.endOfCountDown) {
            return true;
        }
        let {examResult: {list: list}} = this.props.state.examReducer;
        let num = 0;
        for (let v of list) {
            if (v.useranswer.length === 0) {
                num++;
            }
        }
        if (num > 0) {
            Modal.confirm({
                title: `温馨提示`,
                content: (
                    <div>
                        还有{num}题没做，是否交卷？
                    </div>
                ),
                onOk() {
                    this.markExam();
                },
                okText: '交卷',
            });
            return false;
        }
        return true;
    }

    async markExam() {
        if (this.preSubmit() === false) {
            return;
        }
        let {examResult} = this.props.state.examReducer;
        let ret = await markExam({
            result_id: examResult.result_id,
            exam_id: this.state.eid,
            answer_times: examResult.answer_times
        });
        // 考试通过
        if (ret.result.pass_or_not == 1) {
            Modal.success({
                title: '温馨提示',
                content: <div>本次考试成绩 {ret.result.result_score} 分，恭喜你考试合格！</div>,
                okText: '确定',
            });
        } else {
            Modal.error({
                title: '温馨提示',
                content: <div>本次考试成绩 {ret.result.result_score} 分，不合格！请再接再厉！</div>,
                okText: '确定',
            });
        }
    }

    render() {
        let {examResult} = this.props.state.examReducer;
        let list = examResult.list || [];
        return (
            <div>
                <div className="exercise_title_box">
                    <div className="exercise_title">2017年企业类培训<span className="exercise_title_text">课程练习题</span></div>
                </div>
                <div className="exercise_content examine">
                    <div className="exam_clock_box">
                        <Row gutter={16} style={{'zIndex': 2}}>
                            <Col span="18">
                                <Clock type={1} onMarkStop={() => {
                                    this.onMarkStop()
                                }} duration={examResult.count_down * 1000}/>
                            </Col>
                            <Col span="6">
                                <Card onClick={this.clickItem.bind(this)} data={list}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button type="primary" className="button_block" onClick={() => {
                                    this.markExam()
                                }}>交卷</Button>
                            </Col>
                        </Row>
                    </div>
                    {list.map((v, i) => {
                        return ((v.type == 1 || v.type == 2) ?
                                <div className="exercise_exam_list" key={i} qid={v.question_id}>
                                    <div className="eel_info">
                                        <span className="eel_text" style={{'marginLeft': 0}}>{i + 1}、{v.type == 1 ? '单选题' : '多选题'}</span>
                                    </div>
                                    <div className="eel_content" style={{"overflow": "hidden"}}>
                                        <div className="eel_topic">{v.title}</div>
                                        <ul className="eel_answer_list">
                                            {
                                                v.option.map((value, i) => {
                                                    return (
                                                        <li key={i}>{this.state.answer[i]}、{value}</li>
                                                    )
                                                })
                                            }
                                        </ul>
                                        <ul className={this.answerClassName(v.type)}>
                                            {
                                                v.option.map((value, i) => {
                                                    v.useranswer = v.useranswer || [];
                                                    return (
                                                        <li key={i} onClick={() => {
                                                            this.selectAnswer(v, i)
                                                        }} className={v.useranswer.indexOf((i + 1 + '')) > -1 ? 'select' : ''}>{this.state.answer[i]}</li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                :
                                <div className="exercise_exam_list" key={i} qid={v.question_id}>
                                    <div className="eel_info">
                                        <span className="eel_text" style={{'marginLeft': 0}}>{i + 1}、判断题</span>
                                    </div>
                                    <div className="eel_content">
                                        <div className="eel_topic">{v.title}</div>
                                        <ul className="eel_answer_tf">
                                            <li onClick={() => {
                                                this.selectAnswer(v, 0)
                                            }}>
                                                <Icon type={this.answerTypeName(v, 0)}/>正确
                                            </li>
                                            <li onClick={() => {
                                                this.selectAnswer(v, 1)
                                            }}>
                                                <Icon type={this.answerTypeName(v, 1)}/>错误
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Examine