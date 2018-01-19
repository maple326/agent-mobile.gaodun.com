import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as exerciseAction from '../../../actions/exercise';
import {submitExerciseData} from '../../../api/course';
import './exercise.less';
import {Row, Col, Modal, Icon, Button, message, Spin} from 'antd'
import Clock from 'components/Clock/Clock'
import Card from 'components/Card'
import {getQueryString} from 'util/util'
function matchStateToProps(state) {
    //...
    return {
        state: state.examReducer,
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        ...exerciseAction
    }, dispatch)
}


@connect(matchStateToProps, matchDispatchToProps)
class Exercise extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            current: 0,
            listAnswer: ['A', 'B', 'C', 'D', 'E', 'F'],
            tfAnswer: ['正确', '错误'],
            course_id: null
        }
        this.autoNext = '';
    }

    componentWillMount() {
        this.initCourseId();
    }
    getQueryString = (name) =>{
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    initCourseId() {
        let course_id = getQueryString('cid');
        this.setState({
            course_id,
        },()=>{
            this.getQuestions();
        })
    }
    async getQuestions() {
        await this.props.getAnswerCard(this.state.course_id);
        let ret = await this.props.getQuestion({
            course_id: this.state.course_id,
            question_id: this.props.state.card[this.state.current].question_id
        })
    }

    submit() {
    }

    clickItem(o, index) {
        this.setState({
            current: index
        }, () => {
            this.getQuestions();
        })
    }

    /**
     * 根据题目类型输出题目标题
     * @param type 题目类型
     * @returns {string} 题目标题
     */
    printQuestionTitle(type) {
        let text = '';
        switch (type) {
            case '1' :
                text = '单选题'
                break;
            case '2' :
                text = '多选题'
                break;
            default:
                text = '判断题'
                break;
        }
        return text;
    }

    /**
     * 输出答案
     * @param question 当前题目
     * @returns {string} 答案
     */
    printQuestionAnswer(question) {
        let {realanswer, type} = question
        realanswer = realanswer || [];
        let answers = [];
        for (let value of realanswer) {
            if (type != 3) {
                answers.push(this.state.listAnswer[Number(value) - 1])
            } else {
                answers.push(this.state.tfAnswer[Number(value) - 1])
            }
        }
        return answers.join('，');
    }

    printRightOrWrongIcon({useranswer, realanswer}) {
        let ret = true;
        if (useranswer.length !== realanswer.length) {
            return 'close-circle-o'
        }
        for (let value of useranswer) {
            if (realanswer.indexOf(value) == -1) {
                ret = false;
                break;
            }
        }
        if (ret) {
            return 'check-circle-o'
        }
        return 'close-circle-o'
        /* if(status === 1){
             return 'check-circle-o'
         }
         return 'close-circle-o'*/
    }

    answerClassName(type) {
        if (type == 1) {
            return 'eel_answer eel_circle'
        }
        return 'eel_answer eel_square'
    }

    // 单选、判断题提交答案
    async selectAnswer(data, index) {
        // 单选或判断题
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
        // 多选题
        if (data.type == 2) {
            data.showResult = false;
            data.showWrongRight = false;
        } else {
            let result = this.getAnswerStatus(data);
            if (result == 1) {
                data.showResult = false;
            } else {
                data.showResult = undefined;
            }
        }
        this.props.updateQuestion(data); // 为了立即有选中效果更新当前题
        // 多选题
        if (data.type == 2) {
            return;
        }
        // 提交当前题
        let ret = await submitExerciseData({
            question_id: data.question_id,
            answer: data.useranswer.join(',')
        });
        this.props.getAnswerCard(this.state.course_id);    // 更新答题卡
        this.autoGoToNext(data);
    }

    /**
     * 用户答案结果
     * @param useranswer {Array} 用户答案
     * @param realanswer {Array} 正确答案
     * @returns {number} 1：正确 2：错误
     */
    getAnswerStatus({useranswer, realanswer}) {
        let ret = 1;
        if (useranswer.length != realanswer.length) {
            return 2;
        }
        for (let value of useranswer) {
            if (realanswer.indexOf(value) == -1) {
                ret = 2;
                break;
            }
        }
        return ret;
    }

    preQuestion() {
        if (this.state.current === 0) {
            return;
        }
        this.setState({
            current: --this.state.current
        }, () => {
            this.getQuestions();
        })
    }

    nextQuestion() {
        if (this.state.current === this.props.state.card.length - 1) {
            return;
        }
        this.setState({
            current: ++this.state.current
        }, () => {
            this.getQuestions();
        })
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

    // 多选题提交答案
    async submitAnswer() {
        let delay = '';
        let {question: {list: list}} = this.props.state;
        if(list.useranswer.length === 0){
            message.warning('请选择一个答案！');
            return;
        }
        let ret = await submitExerciseData({
            question_id: list.question_id,
            answer: list.useranswer.join(',')
        });
        list.showResult = undefined;
        list.showWrongRight = undefined;
        this.props.updateQuestion(list); // 更新当前题
        this.props.getAnswerCard(this.state.course_id);
        this.autoGoToNext(list)
    }
    autoGoToNext(data){
        let questionStatus = this.getAnswerStatus(data);
        if(questionStatus == 2){
            this.props.getQuestion({
                course_id: this.state.course_id,
                question_id: this.props.state.card[this.state.current].question_id
            })
        }else{
            if(this.state.current === this.props.state.card.length - 1){
                return;
            }
            clearTimeout(this.autoNext);
            this.autoNext = setTimeout(()=>{
                this.setState({
                    current: ++this.state.current
                },()=>{
                    this.props.getQuestion({
                        course_id: this.state.course_id,
                        question_id: this.props.state.card[this.state.current].question_id
                    })
                })
            },500)
        }
    }
    render() {
        let {question} = this.props.state;
        let {list} = question;
        return (
            <div>
                <div className="exercise_title_box">
                    <div className="exercise_title">{question.course_name}<span className="exercise_title_text">课程练习题</span></div>
                </div>
                <div className="exercise_content">
                    <div className="exam_clock_box">
                        <Row gutter={16}>
                            <Col span="18">
                                <Clock type={0} onMarkStop={this.submit.bind(this)} duration={24 * 60 * 60 * 1000}/>
                            </Col>
                            <Col span="6">
                                <Card onClick={(obj, i) => {
                                    this.clickItem(obj, i)
                                }} data={this.props.state.card}/>
                            </Col>
                        </Row>
                    </div>
                    <div className="exercise_exam_list">

                        {
                            list == undefined ? <Spin tip="Loading"/> :
                                <div>
                                    <div className="eel_info">
                                        <span className="eel_current">{this.state.current + 1}</span> /
                                        <span className="eel_total">{this.props.state.card.length}</span>
                                        <span className="eel_text">{this.printQuestionTitle(list.type)}</span>
                                    </div>
                                    <div className="eel_content">
                                        <Icon type="left" className={this.state.current === 0 ? 'exam-button disabled' : 'exam-button'} onClick={() => {
                                            this.preQuestion()
                                        }}/>
                                        <Icon type="right" className={this.state.current === this.props.state.card.length - 1 ? 'exam-button disabled' : 'exam-button'} onClick={() => {
                                            this.nextQuestion()
                                        }}/>
                                        {(list.useranswer.length === 0 || list.showWrongRight != undefined) ? '' : <Icon type={this.printRightOrWrongIcon(list)} className="exam-result"/>}

                                        <div className="eel_topic">{list.title}</div>
                                        {list.type == 3 ?
                                            <ul className="eel_answer_tf">
                                                <li onClick={() => {
                                                    this.selectAnswer(list, 0)
                                                }}>
                                                    <Icon type={this.answerTypeName(list, 0)}/>正确
                                                </li>
                                                <li onClick={() => {
                                                    this.selectAnswer(list, 1)
                                                }}>
                                                    <Icon type={this.answerTypeName(list, 1)}/>错误
                                                </li>
                                            </ul>
                                            :
                                            <div className="eel_answer_box">
                                                <ul className="eel_answer_list">
                                                    {list.option.map((value, i) => {
                                                        return <li key={i}>{this.state.listAnswer[i]}、{value}</li>
                                                    })}
                                                </ul>
                                                <ul className={this.answerClassName(list.type)}>
                                                    {
                                                        list.option.map((value, i) => {
                                                            return (
                                                                <li key={i} onClick={() => {
                                                                    this.selectAnswer(list, i)
                                                                }} className={list.useranswer.indexOf((i + 1 + '')) > -1 ? 'select' : ''}>{this.state.listAnswer[i]}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                                {
                                                    list.type == 2 ?
                                                    <div className="eel_submit_area">
                                                        <Button onClick={() => {
                                                            this.submitAnswer()
                                                        }}>提交</Button>
                                                    </div>
                                                    :
                                                    ''
                                                }

                                            </div>
                                        }
                                    </div>
                                    {
                                        (list.useranswer.length === 0 || list.showResult !== undefined || list.answerStatus != 2) ?
                                            ''
                                            :
                                            <div className="exam_answer_resolution">
                                                <h3 className="ear_title">答案解析</h3>
                                                <div className="ear_result">
                                                    这道问题的答案是：{this.printQuestionAnswer(list)}
                                                </div>
                                            </div>
                                    }
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Exercise