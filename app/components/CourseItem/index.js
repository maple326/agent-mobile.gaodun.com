import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd';
import './courseItem.less'

class CourseItem extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            
        }
    }
    componentWillMount() {
        
    }
    render() {
        var {children, course} = this.props;
        return (
            <a href={`#/course/detail/${course.pkid}`} target="_blank">
                <div className="course-item">
                    <div className="course-item-img">
                        <img src={course.course_image}/>
                    </div>
                    <div className="course-item-info">
                        <span className="score">{course.course_score}学分</span>
                        <span className="title">{course.name}</span><br/>
                        <span className="teacher">讲师：{course.teacher_name}</span>
                    </div>
                </div>
            </a>
        )
    }
}

export default CourseItem;