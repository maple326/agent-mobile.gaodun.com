import React, { Component } from 'react'
import { Link } from 'react-router'
import { Row, Col, Icon, Button, Tag } from 'antd';

import './chapter.less';

let numToZ = (num) => {
    return num;
}

class Panel extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            
        }
    }
    componentWillMount() {
        
    }
    showVideo (){
        let playerTime
        const chapter = this.props.chapter
        const time_minute = Number(chapter.time_minute)*60 
        const time_second = chapter.time_second
        this.props.studentId ? playerTime = time_minute + time_second : playerTime = 600
        this.props.openVideo(this.props.index,true,chapter.name,chapter.pkid,playerTime)
    }
    render() {
        var { children, chapter, index,token,studentId } = this.props;
        return (
            <Row className={`courseDetail-outline-item ${ index==0 && studentId == false ?  'try-listen' : '' } ${ chapter.see_minute == 0 && chapter.see_second == 0 ? "" : 'have-listened' }`} >
                <Col className="outline-item-name" span={11}>
                    <div className="courseList-name">{ chapter.name }</div>
                    { index==0 && studentId == false ? <Tag color='#31cc66' style={{ marginLeft: '10px', borderRadius: '10px' }}>试听</Tag> : '' }
                </Col>
                <Col span={10}>
                    <span style = {{display:"inline-block",width:"100px"}}>{ chapter.time_minute}分 {chapter.time_second }秒</span>
                    { chapter.see_minute == 0 && chapter.see_second == 0 ? 
                        '' 
                        : 
                        <span className="history">｜上次看到：{ chapter.see_minute }分{chapter.see_second}秒</span> }
                </Col>
                <Col span={3}>{index==0 && studentId == false ? <Button onClick = {()=>this.showVideo()} className="ant-btn-green" size="large" icon="play-circle-o">免费试听</Button>
                    : 
                    <div>{studentId ? <Button onClick = {()=>this.showVideo()} className="ant-btn-blue" size="large" icon="play-circle-o">观看视频</Button>:""}</div> 
                 }
                </Col>
            </Row>
        )
    }
}

export default Panel;