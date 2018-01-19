import React, {Component} from 'react'
import {Row, Col, Icon, Badge} from 'antd';
import ReactIScroll from 'react-iscroll'
import iScroll from 'iscroll';
import './card.less';

class Clock extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            down: false,
        }
        this.config = {
            onClick: () => {
            },
            ...this.props
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
    }

    onClick(o, i, e) {
        e.stopPropagation();
        this.config.onClick(o, i, e);
    }

    stopEvent(e) {
        e.stopPropagation();
    }

    toggleCard(e) {
        this.setState({
            down: !this.state.down
        })
    }

    printStatus(status) {
        let text = status == 1 ? 'success' : 'error';
        return text;
    }

    render() {
        let data = this.props.data || [];
        return (
            <div className="exam_card" style={{'overflow': this.state.down ? 'inherit' : 'hidden'}} onClick={() => {
                this.toggleCard()
            }}>
                <div className="exam_button_area">
                    <Icon type="file-text"/>
                    <br/>
                    {this.state.down ? <Icon type="caret-up"/> : ''}
                    <br/>
                    {this.state.down ? '收起' : '答题卡'}
                </div>
                <div className="exam_card_list" style={{'display': this.state.down ? 'block' : 'none'}} onClick={(e) => {
                    this.stopEvent(e)
                }}>
                    <ReactIScroll iScroll={iScroll}
                                  options={{
                                      mouseWheel: true,
                                      scrollbars: true
                                  }}>
                        <ul>
                            {data.map((o, i) => (
                                <li className={o.useranswer.length ? 'writed' : ''} qid={o.question_id} key={i} onClick={(e) => {
                                    this.onClick(o, i, e)
                                }}>
                                    {(o.answerStatus  === 3 || o.answerStatus == undefined) ? '' : <Badge className="card_icon" status={this.printStatus(o.answerStatus)}/>}
                                    {i + 1}
                                </li>
                            ))}
                        </ul>
                    </ReactIScroll>
                </div>
            </div>
        )
    }
}

export default Clock;