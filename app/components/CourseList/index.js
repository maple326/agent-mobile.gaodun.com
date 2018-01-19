import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './CourseList.less'

// 引入antd
import { Row, Col, Button } from 'antd';

// 引入自定义组件
import CourseItem from 'components/CourseItem'

class ChildCourseList extends Component {
    
    constructor(props, context){
        super(props);
        this.state = {
            
        }
    }
    componentWillMount(){
    }
    render() {
        const { children, courses, hasMore, onClickFun, loading } = this.props
        
        return (
            <div>
                <div className="course-list">
                    <Row gutter={24}>
                        {courses.map((course, key) => (
                            <Col className="course-list-item" span={8} key={key}>
                                <CourseItem course={course} />
                            </Col>
                        ))}
                    </Row>
                </div>
                {
                    hasMore ?
                        <div className="get-more-courselist">
                            <Button type="primary" onClick={onClickFun} loading={loading}>
                                {loading ? '正在加载' : '加载更多'}
                            </Button>
                        </div>
                        :
                        ""
                }
            </div>
        )
    }
}

export default ChildCourseList