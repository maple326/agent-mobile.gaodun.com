import React, {Component} from 'react'
import {formatDate} from 'util/util'
import {Row, Col, Icon} from 'antd';
import './clock.less';
class Clock extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            time: <Icon type="loading"/>
        }
        this.config = {
            type: 0,
            loop: null,
            duration: 1 * 60 * 60 * 1000,
            onMarkStop: () => {
            },
            ...this.props
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.config.duration = nextProps.duration;
        clearInterval(this.loop);
        this.countDown();
    }
    componentDidMount() {
        this.countDown();
    }
    countDown() {
        let sessionNum = sessionStorage.getItem('COUNTDOWN');
        sessionNum = sessionNum ? Number(sessionNum) : 0;
        let num = this.config.type == 0 ? sessionNum : 0;
        let today = new Date;
        let todayStr = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
        this.loop = setInterval(() => {
            let todayTime = this.config.type === 0 ? new Date(todayStr).getTime() + num * 1000 : new Date(todayStr).getTime() + this.config.duration - num * 1000;
            let hour = this.doubleDigitOutput(new Date(todayTime).getHours());
            let minute = this.doubleDigitOutput(new Date(todayTime).getMinutes());
            let seconds = this.doubleDigitOutput(new Date(todayTime).getSeconds());
            this.setState({
                time: `${hour}:${minute}:${seconds}`
            });
            if (this.config.duration == num * 1000) {
                clearInterval(this.loop);
                this.config.onMarkStop();
            }
            num++;
            sessionStorage.setItem('COUNTDOWN',num);
        }, 1000)
    }

    /**
     * 将1位数转换为2位数，前面补0
     * @param value 需转换的值
     * @returns {String}
     */
    doubleDigitOutput(value) {
        value = value.toString();
        if (value.length == 1) {
            return "0" + value;
        }
        return value;
    }

    render() {
        return (
            <div className="exam_clock">
                <Row>
                    <Col span="10" className="exam_Dialog_clock_icon">
                        <Icon type={this.config.type === 0 ? 'clock-circle-o':'hourglass'}/><br/>
                        {this.config.type == 0 ? '答题时间' : '剩余时间'}
                    </Col>
                    <Col span="14" className="exam_clock_time">
                        {this.state.time}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Clock;